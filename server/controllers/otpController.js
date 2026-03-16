import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import sendEmail from '../utils/sendEmail.js'

// Generate 6 digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' })
    }

    if (user.verifyOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    if (user.verifyOTPExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired, please register again' })
    }

    user.isVerified = true
    user.verifyOTP = undefined
    user.verifyOTPExpiry = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
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

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' })
    }

    const otp = generateOTP()
    user.verifyOTP = otp
    user.verifyOTPExpiry = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    await sendEmail(
      email,
      'Your new TiffinBox OTP',
      `
        <h2>TiffinBox OTP 🍱</h2>
        <p>Your new verification OTP is:</p>
        <h1 style="color: #E07B2A; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP expires in <b>10 minutes.</b></p>
      `
    )

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email!'
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}