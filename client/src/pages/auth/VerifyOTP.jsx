import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../redux/slices/authSlice'
import axiosInstance from '../../utils/axiosInstance'
import OTPInput from '../../components/OTPInput'

function VerifyOTP() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const email = localStorage.getItem('verifyEmail')
  useEffect(() => {
  if (!email) {
    navigate('/login')
  }
}, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (otp.length < 6) return setError('Please enter complete 6 digit OTP')
    setLoading(true)
    setError('')
    try {
      const { data } = await axiosInstance.post('/auth/verify-otp', { email, otp })
      dispatch(setCredentials({ token: data.token, user: data.user }))

      // Auto redirect based on role — no login needed!
      if (data.user.role === 'cook') navigate('/cook/setup')
      else if (data.user.role === 'admin') navigate('/admin/dashboard')
      else navigate('/home') 
    
      localStorage.removeItem('verifyEmail')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError('')
    setSuccess('')
    try {
      await axiosInstance.post('/auth/resend-otp', { email })
      setSuccess('New OTP sent to your email!')
      setOtp('')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className='auth-wrap'>

      {/* ── LEFT ── */}
      <div className='auth-left'>
        <div className='auth-left-inner'>

          <span className='auth-back' onClick={() => navigate('/register')}>
            ← Back to register
          </span>

          <div className='auth-page-title'>
            Check your<br />email.
          </div>

          <p className='auth-page-sub'>
            We sent a 6-digit OTP to{' '}
            <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{email}</strong>
          </p>

          {error && <div className='error-box'>{error}</div>}
          {success && <div className='success-box'>{success}</div>}

          <form onSubmit={handleSubmit}>
            <OTPInput value={otp} onChange={setOtp} />

            <button type='submit' className='auth-btn' disabled={loading || otp.length < 6}>
              {loading ? 'Verifying…' : 'Verify Email'}
            </button>
          </form>

          <div className='auth-switch' style={{ marginTop: '16px' }}>
            Didn't receive OTP?{' '}
            <span
              onClick={handleResend}
              style={{ color: 'var(--brand)', fontWeight: 600, cursor: 'pointer' }}
            >
              {resending ? 'Sending…' : 'Resend OTP'}
            </span>
          </div>

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
              One step<br />away from<br /><span className='accent'>home food.</span>
            </div>
            <p className='auth-right-body'>
              Verify your email to start ordering fresh homemade meals from home cooks near you.
            </p>
          </div>
          <div className='auth-right-note'>OTP is valid for 10 minutes only.</div>
        </div>
      </div>

    </div>
  )
}

export default VerifyOTP