import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import sendEmail from '../utils/sendEmail.js'
import { generateOTP } from './otpController.js'

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, city, phone } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    const user = await User.create({
      name, email, password, role, city, phone,
      verifyOTP: otp,
      verifyOTPExpiry: otpExpiry
    })

    await sendEmail(
      email,
      'Verify your TiffinBox account',
      `
        <h2>Welcome to TiffinBox! 🍱</h2>
        <p>Hi ${name},</p>
        <p>Your verification OTP is:</p>
        <h1 style="color: #E07B2A; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP expires in <b>10 minutes.</b></p>
        <p>If you did not register, please ignore this email.</p>
      `
    )

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please verify your email.',
      email
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: 'Please verify your email first',
        isVerified: false,
        email
      })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
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