import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'
import axiosInstance from '../../utils/axiosInstance'

function AdminDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axiosInstance.get('/admin/stats'),
        axiosInstance.get('/admin/users')
      ])
      setStats(statsRes.data.stats)
      setUsers(usersRes.data.users)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBan = async (id) => {
    try {
      await axiosInstance.put(`/admin/users/${id}/ban`)
      setUsers(users.map(u =>
        u._id === id ? { ...u, isActive: !u.isActive } : u
      ))
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this user? This cannot be undone.')
    if (!confirm) return
    try {
      await axiosInstance.delete(`/admin/users/${id}`)
      setUsers(users.filter(u => u._id !== id))
    } catch (err) {
      console.log(err)
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

  return (
    <div className='dashboard-wrap'>

      {/* ── Navbar ── */}
      <div className='dashboard-navbar'>
        <div className='dashboard-navbar-brand'>🍱 TiffinBox Admin</div>
        <div className='dashboard-navbar-right'>
          <div className='dashboard-navbar-user'>👤 {user?.name}</div>
          <button className='dashboard-navbar-btn' onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className='dashboard-content'>
        <div className='dashboard-title'>Admin Dashboard</div>
        <div className='dashboard-subtitle'>Platform overview and management</div>

        {/* ── Stats ── */}
        <div className='stats-grid'>
          <div className='stat-card'>
            <div className='stat-card-label'>Total Customers</div>
            <div className='stat-card-value purple'>{stats?.totalUsers || 0}</div>
          </div>
          <div className='stat-card'>
            <div className='stat-card-label'>Verified Cooks</div>
            <div className='stat-card-value green'>{stats?.totalCooks || 0}</div>
          </div>
          <div className='stat-card'>
            <div className='stat-card-label'>Pending Approvals</div>
            <div className='stat-card-value amber'>{stats?.pendingCooks || 0}</div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className='table-card' style={{ marginBottom: '24px' }}>
          <div className='table-card-header'>
            <div className='table-card-title'>Quick Actions</div>
          </div>
          <div style={{ padding: '24px' }}>
            <Link to='/admin/pending-cooks'>
              <button className='auth-btn' style={{ width: 'auto', padding: '10px 20px', fontSize: '13px' }}>
                Review Pending Cooks ({stats?.pendingCooks || 0})
              </button>
            </Link>
          </div>
        </div>

        {/* ── All Users Table ── */}
        <div className='table-card'>
          <div className='table-card-header'>
            <div className='table-card-title'>All Users</div>
            <div style={{ fontSize: '13px', color: 'var(--subtle)' }}>{users.length} total</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 500, color: 'var(--ink)' }}>{u.name}</td>
                  <td style={{ color: 'var(--subtle)', fontSize: '13px' }}>{u.email}</td>
                  <td>
                    <span className={`badge badge-${u.role}`}>{u.role}</span>
                  </td>
                  <td>{u.city}</td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-verified' : 'badge-rejected'}`}>
                      {u.isActive ? 'Active' : 'Banned'}
                    </span>
                  </td>
                  <td>
                    {u.role !== 'admin' && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          className={u.isActive ? 'btn-reject' : 'btn-approve'}
                          style={{ marginLeft: 0 }}
                          onClick={() => handleBan(u._id)}
                        >
                          {u.isActive ? 'Ban' : 'Unban'}
                        </button>
                        <button
                          onClick={() => handleDelete(u._id)}
                          style={{
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: 'none',
                            padding: '7px 14px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-body)',
                            transition: 'background 0.2s'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard