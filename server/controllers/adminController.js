import User from '../models/User.js'
import CookProfile from '../models/CookProfile.js'
import sendEmail from '../utils/sendEmail.js'

// @desc    Get all pending cooks
// @route   GET /api/admin/cooks/pending
export const getPendingCooks = async (req, res) => {
  try {
    const pendingCooks = await CookProfile.find({ isVerified: false })
      .populate('userId', 'name email city createdAt')

    res.status(200).json({ success: true, pendingCooks })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Approve cook
// @route   PUT /api/admin/cooks/:id/verify
export const verifyCook = async (req, res) => {
  try {
    const cookProfile = await CookProfile.findById(req.params.id)
      .populate('userId', 'name email')

    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook not found' })
    }

    cookProfile.isVerified = true
    await cookProfile.save()

    // Send approval email
    await sendEmail(
      cookProfile.userId.email,
      'Your TiffinBox cook profile is approved! 🎉',
      `
        <h2>Congratulations ${cookProfile.userId.name}! 🍱</h2>
        <p>Your cook profile has been approved by TiffinBox team.</p>
        <p>You can now start posting your daily menu and accepting orders.</p>
        <p>Welcome to the TiffinBox family!</p>
      `
    )

    res.status(200).json({ success: true, message: 'Cook approved successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Reject cook
// @route   PUT /api/admin/cooks/:id/reject
export const rejectCook = async (req, res) => {
  try {
    const { reason } = req.body

    const cookProfile = await CookProfile.findById(req.params.id)
      .populate('userId', 'name email')

    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook not found' })
    }

    // Send rejection email
    await sendEmail(
      cookProfile.userId.email,
      'TiffinBox cook profile update',
      `
        <h2>Hi ${cookProfile.userId.name},</h2>
        <p>Unfortunately your cook profile was not approved at this time.</p>
        <p><strong>Reason:</strong> ${reason || 'Profile information incomplete'}</p>
        <p>You can update your profile and apply again.</p>
      `
    )

    await CookProfile.findByIdAndDelete(req.params.id)

    res.status(200).json({ success: true, message: 'Cook rejected and notified' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all users
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.status(200).json({ success: true, users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get platform stats
// @route   GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' })
    const totalCooks = await CookProfile.countDocuments({ isVerified: true })
    const pendingCooks = await CookProfile.countDocuments({ isVerified: false })

    res.status(200).json({
      success: true,
      stats: { totalUsers, totalCooks, pendingCooks }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/// @desc    Ban user
// @route   PUT /api/admin/users/:id/ban
export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.isActive = !user.isActive
    await user.save()

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'unbanned' : 'banned'} successfully`
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Delete cook profile if exists
    await CookProfile.deleteOne({ userId: req.params.id })

    // Delete user
    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'User and related data deleted successfully'
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}