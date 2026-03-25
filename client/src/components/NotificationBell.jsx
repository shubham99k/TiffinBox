import { useEffect, useState, useRef } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { Bell } from 'lucide-react'

function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const bellRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target) && open) {
        setNotifications(notifications => notifications.map(n => ({ ...n, isRead: true })))
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get('/notifications')
      setNotifications(data.notifications)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line
    fetchNotifications()
  }, [])

  const handleOpen = async () => {
    if (!open) {
      // Mark as read in API, but keep local state unchanged 
      // so they still render with the unread color while the dropdown is open.
      try {
        await axiosInstance.put('/notifications/read')
      } catch (err) {
        console.log(err)
      }
    } else {
      // On close, update local state so they become read.
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    }
    setOpen(!open)
  }

  // Hide badge if dropdown is open
  const unreadCount = open ? 0 : notifications.filter(n => !n.isRead).length

  return (
    <div ref={bellRef} style={{ position: 'relative' }}>

      {/* Bell Button */}
      <button
        onClick={handleOpen}
        style={{
          position: 'relative', background: 'var(--brand-light)',
          border: 'none', borderRadius: '8px', padding: '7px 12px',
          cursor: 'pointer', fontSize: '16px', fontFamily: 'var(--font-body)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <Bell size={20} color="var(--ink)" />
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
                  <div style={{ fontSize: '11px', color: n.isRead ? 'var(--subtle)' : 'var(--ink)', fontWeight: n.isRead ? 200 : 400, marginTop: '3px' }}>
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