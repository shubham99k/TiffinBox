import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await axiosInstance.post('/auth/forgot-password', { email })
      localStorage.setItem('resetEmail', email)
      setSuccess('OTP sent! Check your email.')
      navigate('/reset-password')
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

          <span className='auth-back' onClick={() => navigate('/login')}>
            ← Back to login
          </span>

          <div className='auth-page-title'>
            Forgot your<br />password?
          </div>

          <p className='auth-page-sub'>
            No worries! Enter your email and we'll send you a reset OTP.
          </p>

          {error && <div className='error-box'>{error}</div>}
          {/* {success && <div className='success-box'>{success}</div>} */}

          <form onSubmit={handleSubmit}>
            <div className='inp-wrap'>
              <div className='inp-label'>Email Address</div>
              <input
                className='inp-field' type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='you@gmail.com' required
              />
            </div>

            <button type='submit' className='auth-btn' disabled={loading}>
              {loading ? 'Sending OTP…' : 'Send Reset OTP'}
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
              We got<br />your<br /><span className='accent'>back.</span>
            </div>
            <p className='auth-right-body'>
              Enter your email and we'll send you an OTP to reset your password instantly.
            </p>
          </div>

          <div className='auth-right-note'>Reset OTP is valid for 10 minutes only.</div>
        </div>
      </div>

    </div>
  )
}

export default ForgotPassword