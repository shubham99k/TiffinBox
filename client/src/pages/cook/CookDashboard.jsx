import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'
import axiosInstance from '../../utils/axiosInstance'

function CookDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [cookProfile, setCookProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ bio: '', cuisineType: '', city: '', address: '' })
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    try {
      const { data } = await axiosInstance.get('/cook/profile/me')
      setCookProfile(data.cookProfile)
      setFormData({
        bio: data.cookProfile.bio,
        cuisineType: data.cookProfile.cuisineType?.join(', '),
        city: data.cookProfile.city,
        address: data.cookProfile.address
      })
    } catch (err) {
      if (err.response?.status === 404) navigate('/cook/setup')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setError('')
    setSuccess('')
    try {
      const form = new FormData()
      form.append('bio', formData.bio)
      form.append('cuisineType', formData.cuisineType)
      form.append('city', formData.city)
      form.append('address', formData.address)
      if (photo) form.append('photo', photo)

      const { data } = await axiosInstance.put('/cook/profile', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setCookProfile(data.cookProfile)
      setSuccess('Profile updated successfully!')
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setUpdating(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ fontSize: '14px', color: 'var(--muted)' }}>Loading...</div>
    </div>
  )

  if (cookProfile && !cookProfile.isVerified) return (
    <div className='pending-wrap'>
      <div className='pending-card'>
        <div className='pending-icon'>⏳</div>
        <div className='pending-title'>Profile under review</div>
        <div className='pending-desc'>
          Your cook profile has been submitted and is currently being reviewed
          by our team. We'll notify you via email once approved — usually within 24 hours.
        </div>
        <div style={{ fontSize: '13px', color: 'var(--subtle)', marginBottom: '24px' }}>
          Submitted as: <strong style={{ color: 'var(--ink)' }}>{user?.email}</strong>
        </div>
        <button className='auth-btn' style={{ maxWidth: '200px', margin: '0 auto' }} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className='dashboard-wrap'>

      {/* Navbar */}
      <div className='dashboard-navbar'>
        <div className='dashboard-navbar-brand'>TiffinBox</div>
        <div className='dashboard-navbar-right'>
          <div className='dashboard-navbar-user'>👩‍🍳 {user?.name}</div>
          <button className='dashboard-navbar-btn' onClick={() => navigate('/cook/post-menu')}>
            + Post Menu
          </button>
          <button className='dashboard-navbar-btn' onClick={() => navigate('/cook/orders')}>
  📦 Orders
</button>
          <button className='dashboard-navbar-btn' onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className='dashboard-content'>
        <div className='dashboard-title'>Welcome back, {user?.name?.split(' ')[0]}! 👋</div>
        <div className='dashboard-subtitle'>Here's your cook dashboard</div>

        {/* Stats */}
        <div className='stats-grid'>
          <div className='stat-card'>
            <div className='stat-card-label'>Total Earnings</div>
            <div className='stat-card-value purple'>₹{cookProfile?.earnings?.total || 0}</div>
          </div>
          <div className='stat-card'>
            <div className='stat-card-label'>This Week</div>
            <div className='stat-card-value green'>₹{cookProfile?.earnings?.thisWeek || 0}</div>
          </div>
          <div className='stat-card'>
            <div className='stat-card-label'>Rating</div>
            <div className='stat-card-value amber'>{cookProfile?.rating || 0} ★</div>
          </div>
          <div className='stat-card'>
            <div className='stat-card-label'>Total Reviews</div>
            <div className='stat-card-value'>{cookProfile?.totalReviews || 0}</div>
          </div>
        </div>

        {/* Profile Card */}
        <div className='table-card'>
          <div className='table-card-header'>
            <div className='table-card-title'>Your Profile</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className='badge badge-verified'>✓ Verified</span>
              <button
                className='dashboard-navbar-btn'
                onClick={() => { setEditing(!editing); setSuccess(''); setError('') }}
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Success / Error */}
          {success && <div className='success-box' style={{ margin: '16px 24px 0' }}>{success}</div>}
          {error && <div className='error-box' style={{ margin: '16px 24px 0' }}>{error}</div>}

          {editing ? (
            /* Edit Form */
            <form onSubmit={handleUpdate} style={{ padding: '24px' }}>

              {/* Photo */}
              <div style={{ marginBottom: '16px' }}>
                <div className='inp-label' style={{ marginBottom: '8px' }}>Profile Photo (Click on image to upload new photo)</div>
                <label htmlFor='edit-photo' style={{ cursor: 'pointer' }}>
                  {preview || cookProfile?.photo
                    ? <img
                        src={preview || cookProfile?.photo}
                        alt='preview'
                        className='photo-upload-preview'
                      />
                    : <div className='photo-upload'>
                        <div className='photo-upload-text'>Click to upload photo</div>
                        <div className='photo-upload-hint'>JPG, PNG up to 5MB</div>
                      </div>
                  }
                </label>
                <input id='edit-photo' type='file' accept='image/*'
                  onChange={handlePhoto} style={{ display: 'none' }} />
              </div>

              <div className='inp-wrap'>
                <div className='inp-label'>Bio</div>
                <input className='inp-field' type='text' name='bio'
                  value={formData.bio} onChange={handleChange}
                  placeholder='Tell customers about your cooking...' required />
              </div>

              <div className='inp-wrap'>
                <div className='inp-label'>Cuisine Type</div>
                <input className='inp-field' type='text' name='cuisineType'
                  value={formData.cuisineType} onChange={handleChange}
                  placeholder='e.g. Gujarati, Punjabi' required />
              </div>

              <div className='inp-row'>
                <div className='inp-wrap'>
                  <div className='inp-label'>City</div>
                  <input className='inp-field' type='text' name='city'
                    value={formData.city} onChange={handleChange}
                    placeholder='Surat' required />
                </div>
                <div className='inp-wrap'>
                  <div className='inp-label'>Address</div>
                  <input className='inp-field' type='text' name='address'
                    value={formData.address} onChange={handleChange}
                    placeholder='Your full address' required />
                </div>
              </div>

              <button type='submit' className='auth-btn' disabled={updating}>
                {updating ? 'Updating...' : 'Save Changes'}
              </button>

            </form>
          ) : (
            /* View Mode */
            <div style={{ padding: '24px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              {cookProfile?.photo && (
                <img src={cookProfile.photo} alt='profile'
                  style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                  <strong style={{ color: 'var(--ink)' }}>Bio:</strong> {cookProfile?.bio}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                  <strong style={{ color: 'var(--ink)' }}>Cuisine:</strong> {cookProfile?.cuisineType?.join(', ')}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                  <strong style={{ color: 'var(--ink)' }}>City:</strong> {cookProfile?.city}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                  <strong style={{ color: 'var(--ink)' }}>Address:</strong> {cookProfile?.address}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default CookDashboard