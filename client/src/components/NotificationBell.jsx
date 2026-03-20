import { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance'

function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get('/notifications')
      setNotifications(data.notifications)
    } catch (err) {
      console.log(err)
    }
  }

  const handleOpen = async () => {
    setOpen(!open)
    if (!open) {
      // Mark all as read when opening
      try {
        await axiosInstance.put('/notifications/read')
        setNotifications(notifications.map(n => ({ ...n, isRead: true })))
      } catch (err) {
        console.log(err)
      }
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div style={{ position: 'relative' }}>

      {/* Bell Button */}
      <button
        onClick={handleOpen}
        style={{
          position: 'relative', background: 'var(--brand-light)',
          border: 'none', borderRadius: '8px', padding: '7px 12px',
          cursor: 'pointer', fontSize: '16px', fontFamily: 'var(--font-body)'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            background: '#EF4444', color: '#fff', borderRadius: '99px',
            fontSize: '10px', fontWeight: 700, minWidth: '16px',
            height: '16px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '0 4px'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '44px',
          width: '300px', background: 'var(--white)',
          border: '1px solid var(--border)', borderRadius: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)', zIndex: 100,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>
            Notifications
          </div>

          {notifications.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', fontSize: '13px', color: 'var(--subtle)' }}>
              No notifications yet
            </div>
          ) : (
            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {notifications.map(n => (
                <div key={n._id} style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #f3f4f6',
                  background: n.isRead ? 'var(--white)' : 'var(--brand-pale)'
                }}>
                  <div style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: n.isRead ? 400 : 600 }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--subtle)', marginTop: '3px' }}>
                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default NotificationBell