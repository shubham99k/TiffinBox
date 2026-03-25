import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import Navbar from '../../components/Navbar'
import Alert from '../../components/Alert'
import ConfirmDialog from '../../components/ConfirmDialog'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [confirmBanId, setConfirmBanId] = useState(null)

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

  const handleBan = async () => {
    try {
      await axiosInstance.put(`/admin/users/${confirmBanId}/ban`)
      setUsers(users.map(u =>
        u._id === confirmBanId ? { ...u, isActive: !u.isActive } : u
      ))
      setConfirmBanId(null)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/users/${confirmDeleteId}`)
      setUsers(prev => prev.filter(u => u._id !== confirmDeleteId))
      setConfirmDeleteId(null)
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ fontSize: '14px', color: 'var(--muted)' }}>Loading...</div>
    </div>
  )

  // Find the user being banned to show correct action in dialog
  const banTargetUser = users.find(u => u._id === confirmBanId)

  return (
    <div className='dashboard-wrap'>

      <Navbar />
      <div className='dashboard-content'>
        <div className='dashboard-title'>Admin Dashboard</div>
        <div className='dashboard-subtitle'>Platform overview and management</div>

        {/* ── Stats ── */}
        <div className='stats-grid'>
          <div className='stat-card'>
            <div className='stat-card-label'>Total Customers</div>
            <div className='stat-card-value'>{stats?.totalUsers || 0}</div>
          </div>
          <div className='stat-card'>
            <div className='stat-card-label'>Total Verified Cooks</div>
            <div className='stat-card-value'>{stats?.totalCooks || 0}</div>
          </div>
          <div className='stat-card'>
            <div className='stat-card-label'>Pending Approvals</div>
            <div className='stat-card-value'>{stats?.pendingCooks || 0}</div>
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
                          onClick={() => setConfirmBanId(u._id)}
                        >
                          {u.isActive ? 'Ban' : 'Unban'}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(u._id)}
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

      {/* ── Confirm Ban/Unban Dialog ── */}
      {confirmBanId && (
        <ConfirmDialog
          message={
            banTargetUser?.isActive
              ? `Are you sure you want to ban '${banTargetUser?.name}' ?`
              : `Are you sure you want to unban ${banTargetUser?.name}?`
          }
          confirmLabel={banTargetUser?.isActive ? 'Ban' : 'Unban'}
          confirmColor={banTargetUser?.isActive ? '#DC2626' : '#16A34A'}
          onConfirm={handleBan}
          onCancel={() => setConfirmBanId(null)}
        />
      )}

      {/* ── Confirm Delete Dialog ── */}
      {confirmDeleteId && (
        <ConfirmDialog
          message="Are you sure you want to delete this user? This cannot be undone."
          confirmLabel="Delete"
          confirmColor="#DC2626"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}

    </div>
  )
}

export default AdminDashboard