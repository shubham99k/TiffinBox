import CookProfile from '../models/CookProfile.js'
import cloudinary from '../utils/cloudinary.js'

// @desc    Create cook profile
// @route   POST /api/cook/profile
export const createCookProfile = async (req, res) => {
  try {
    const { bio, cuisineType, city, address } = req.body

    // Check if profile already exists
    const existing = await CookProfile.findOne({ userId: req.user.id })
    if (existing) {
      return res.status(400).json({ message: 'Cook profile already exists' })
    }

    let photoUrl = ''

    // Upload photo to Cloudinary if provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'tiffinbox/cooks' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(req.file.buffer)
      })
      photoUrl = result.secure_url
    }

    const cookProfile = await CookProfile.create({
      userId: req.user.id,
      bio,
      cuisineType: cuisineType.split(',').map(c => c.trim()),
      city,
      address,
      photo: photoUrl
    })

    res.status(201).json({
      success: true,
      message: 'Cook profile created! Waiting for admin approval.',
      cookProfile
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get own cook profile
// @route   GET /api/cook/profile
export const getCookProfile = async (req, res) => {
  try {
    const cookProfile = await CookProfile.findOne({ userId: req.user.id })
    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook profile not found' })
    }
    res.status(200).json({ success: true, cookProfile })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update cook profile
// @route   PUT /api/cook/profile
export const updateCookProfile = async (req, res) => {
  try {
    const { bio, cuisineType, city, address } = req.body

    const cookProfile = await CookProfile.findOne({ userId: req.user.id })
    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook profile not found' })
    }

    let photoUrl = cookProfile.photo

    // Upload new photo if provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'tiffinbox/cooks' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(req.file.buffer)
      })
      photoUrl = result.secure_url
    }

    cookProfile.bio = bio || cookProfile.bio
    cookProfile.cuisineType = cuisineType
      ? cuisineType.split(',').map(c => c.trim())
      : cookProfile.cuisineType
    cookProfile.city = city || cookProfile.city
    cookProfile.address = address || cookProfile.address
    cookProfile.photo = photoUrl

    await cookProfile.save()

    res.status(200).json({ success: true, cookProfile })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all verified cooks by city
// @route   GET /api/cook/all?city=
export const getAllCooks = async (req, res) => {
  try {
    const { city } = req.query

    const cooks = await CookProfile.find({
      isVerified: true,
      isAvailable: true,
      ...(city && { city: { $regex: city, $options: 'i' } })
    }).populate('userId', 'name email')

    res.status(200).json({ success: true, cooks })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get single cook profile
// @route   GET /api/cook/:id
export const getSingleCook = async (req, res) => {
  try {
    const cookProfile = await CookProfile.findById(req.params.id)
      .populate('userId', 'name email')

    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook not found' })
    }

    res.status(200).json({ success: true, cookProfile })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Toggle availability
// @route   PUT /api/cook/availability
export const toggleAvailability = async (req, res) => {
  try {
    const cookProfile = await CookProfile.findOne({ userId: req.user.id })
    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook profile not found' })
    }

    cookProfile.isAvailable = !cookProfile.isAvailable
    await cookProfile.save()

    res.status(200).json({
      success: true,
      isAvailable: cookProfile.isAvailable,
      message: `You are now ${cookProfile.isAvailable ? 'available' : 'unavailable'}`
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}