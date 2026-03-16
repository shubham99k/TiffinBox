import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// @desc    Register user
// @route   POST /api/auth/register


export const register = async (req, res) => {
  try {
    console.log('Register hit:', req.body)
    const { name, email, password, role, city, phone } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Create user
    const user = await User.create({
      name, email, password, role, city, phone
    })

    // Send response with token
    res.status(201).json({
      success: true,
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city
      }
    })
  } catch (error) {
    console.log('EXACT ERROR:', error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Send response with token
    res.status(200).json({
      success: true,
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get logged in user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}