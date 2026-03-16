import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import OTPInput from '../../components/OTPInput'

function ResetPassword() {
  const navigate = useNavigate()
  const email = localStorage.getItem('resetEmail')
  const [otp, setOtp] = useState('')
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (otp.length < 6) return setError('Please enter complete 6 digit OTP')
    if (formData.newPassword !== formData.confirmPassword) return setError('Passwords do not match')
    setLoading(true)
    setError('')
    try {
      await axiosInstance.post('/auth/reset-password', {
        email,
        otp,
        newPassword: formData.newPassword
      })
      setSuccess('Password reset successfully!')
      localStorage.removeItem('resetEmail')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='auth-wrap'>

      {/* ── LEFT ── */}
      <div className='auth-left'>
        <div className='auth-left-inner'>

          <span className='auth-back' onClick={() => navigate('/forgot-password')}>
            ← Back
          </span>

          <div className='auth-page-title'>
            Reset your<br />password.
          </div>

          <p className='auth-page-sub'>
            Enter the OTP sent to{' '}
            <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{email}</strong>{' '}
            and set your new password.
          </p>

          {error && <div className='error-box'>{error}</div>}
          {success && <div className='success-box'>{success}</div>}

          <form onSubmit={handleSubmit}>

            <OTPInput value={otp} onChange={setOtp} />

            <div className='inp-wrap'>
              <div className='inp-label'>New Password</div>
              <input
                className='inp-field' type='password'
                name='newPassword' value={formData.newPassword}
                onChange={handleChange}
                placeholder='Min 6 characters' required
              />
            </div>

            <div className='inp-wrap'>
              <div className='inp-label'>Confirm Password</div>
              <input
                className='inp-field' type='password'
                name='confirmPassword' value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='Re-enter new password' required
              />
            </div>

            <button type='submit' className='auth-btn' disabled={loading || otp.length < 6}>
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>

          </form>

        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className='auth-right'>
        <div className='auth-right-noise' />
        <div className='auth-right-content'>
          <div className='auth-right-brand'>
            <div className='auth-right-brand-text'>
              <span className='auth-right-brand-name'>TiffinBox</span>
            </div>
          </div>
          <div>
            <div className='auth-right-headline'>
              Almost<br />there.<br /><span className='accent'>New start.</span>
            </div>
            <p className='auth-right-body'>
              Set your new password and get back to ordering fresh homemade meals instantly.
            </p>
          </div>
          <div className='auth-right-note'>Make sure your new password is strong and secure.</div>
        </div>
      </div>

    </div>
  )
}

export default ResetPassword