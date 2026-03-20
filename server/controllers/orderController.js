import Order from '../models/Order.js'
import Menu from '../models/Menu.js'
import CookProfile from '../models/CookProfile.js'
import sendEmail from '../utils/sendEmail.js'
import Notification from '../models/Notification.js'


// Helper — check if cutoff time has passed
const isCutoffPassed = (cutoffTime) => {
  const now = new Date()
  const [hours, minutes] = cutoffTime.split(':').map(Number)
  const cutoff = new Date()
  cutoff.setHours(hours, minutes, 0, 0)
  return now > cutoff
}

// @desc    Place order (COD)
// @route   POST /api/orders
export const placeOrder = async (req, res) => {
  try {
    const { menuId, dishIndex, quantity, deliveryAddress } = req.body

    // Get menu
    const menu = await Menu.findById(menuId)
    if (!menu) return res.status(404).json({ message: 'Menu not found' })

    // Check cutoff time
    if (isCutoffPassed(menu.cutoffTime)) {
      return res.status(400).json({ message: 'Order cutoff time has passed' })
    }

    // Get dish
    const dish = menu.dishes[dishIndex]
    if (!dish) return res.status(404).json({ message: 'Dish not found' })

    // Check portions
    if (dish.portionsLeft < quantity) {
      return res.status(400).json({
        message: `Only ${dish.portionsLeft} portions left`
      })
    }

    const totalAmount = dish.price * quantity

    // Decrease portions
    menu.dishes[dishIndex].portionsLeft -= quantity

    // Auto close menu if all portions finished
    const allDishesEmpty = menu.dishes.every(d => d.portionsLeft <= 0)
    if (allDishesEmpty) menu.isActive = false

    await menu.save()

    // Create order
    const order = await Order.create({
      customerId: req.user.id,
      cookId: menu.cookId,
      menuId,
      dish: {
        name: dish.name,
        photo: dish.photo,
        price: dish.price
      },
      quantity,
      totalAmount,
      deliveryAddress,
      status: 'confirmed',
      paymentStatus: 'pending'
    })

    await Notification.create({
    userId: cookProfile.userId._id,
    message: `New order received for ${dish.name}!`,
    type: 'order_placed'
  })

    // Notify cook via email
    const cookProfile = await CookProfile.findById(menu.cookId)
      .populate('userId', 'name email')

    await sendEmail(
      cookProfile.userId.email,
      'New order received! 🍱',
      `
        <h2>New Order from TiffinBox!</h2>
        <p>Hi ${cookProfile.userId.name},</p>
        <p>You have a new order:</p>
        <p><strong>Dish:</strong> ${dish.name}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Amount:</strong> ₹${totalAmount} (Cash on Delivery)</p>
        <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
        <p>Please prepare the order on time!</p>
      `
    )

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get customer orders
// @route   GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .populate('cookId')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get cook incoming orders
// @route   GET /api/orders/cook
export const getCookOrders = async (req, res) => {
  try {
    const cookProfile = await CookProfile.findOne({ userId: req.user.id })
    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook profile not found' })
    }

    const orders = await Order.find({ cookId: cookProfile._id })
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body

    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.status = status
    await order.save()

    await Notification.create({
    userId: order.customerId._id,
    message: `Your order for ${order.dish.name} is now ${status}!`,
    type: `order_${status}`
  })

    // Notify customer via email
    await sendEmail(
      order.customerId.email,
      `Your TiffinBox order is ${status}! 🍱`,
      `
        <h2>Order Update</h2>
        <p>Hi ${order.customerId.name},</p>
        <p>Your order for <strong>${order.dish.name}</strong> is now <strong>${status}</strong>.</p>
        ${status === 'delivered'
          ? '<p>Enjoy your meal! Don\'t forget to leave a review. 😊</p>'
          : '<p>We\'ll keep you updated!</p>'
        }
      `
    )

    res.status(200).json({ success: true, order })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' })
    }

    order.status = 'cancelled'
    await order.save()

    // Restore portions
    const menu = await Menu.findById(order.menuId)
    if (menu) {
      const dish = menu.dishes.find(d => d.name === order.dish.name)
      if (dish) {
        dish.portionsLeft += order.quantity
        menu.isActive = true
        await menu.save()
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully'
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}