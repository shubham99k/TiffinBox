import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'

function CookOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get('/orders/cook')
      setOrders(data.orders)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await axiosInstance.put(`/orders/${id}/status`, { status })
      setOrders(orders.map(o =>
        o._id === id ? { ...o, status } : o
      ))
    } catch (err) {
      console.log(err)
    }
  }

  const nextStatus = (current) => {
    const flow = {
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'delivered'
    }
    return flow[current] || null
  }

  const statusColor = (status) => {
    const colors = {
      confirmed: 'badge-verified',
      preparing: 'badge-cook',
      ready: 'badge-customer',
      delivered: 'badge-verified',
      cancelled: 'badge-rejected'
    }
    return colors[status] || 'badge-pending'
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ fontSize: '14px', color: 'var(--muted)' }}>Loading...</div>
    </div>
  )

  return (
    <div className='dashboard-wrap'>

      <div className='dashboard-navbar'>
        <div className='dashboard-navbar-brand'>🍱 TiffinBox</div>
        <div className='dashboard-navbar-right'>
          <button className='dashboard-navbar-btn' onClick={() => navigate('/cook/dashboard')}>
            ← Dashboard
          </button>
        </div>
      </div>

      <div className='dashboard-content'>
        <div className='dashboard-title'>Incoming Orders</div>
        <div className='dashboard-subtitle'>{orders.length} orders total</div>

        {orders.length === 0 ? (
          <div className='table-card'>
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
                No orders yet
              </div>
              <div style={{ fontSize: '13px', color: 'var(--subtle)' }}>
                Orders will appear here once customers place them
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {orders.map(order => (
              <div key={order._id} className='table-card'>
                <div style={{ padding: '20px 24px' }}>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>
                        {order.dish?.name}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--subtle)' }}>
                        Qty: {order.quantity} · ₹{order.totalAmount} · COD
                      </div>
                    </div>
                    <span className={`badge ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div style={{ background: '#fafafa', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Customer Details
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 500 }}>
                      {order.customerId?.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--subtle)' }}>
                      {order.customerId?.email}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--subtle)', marginTop: '4px' }}>
                      📍 {order.deliveryAddress}
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--subtle)', marginBottom: '12px' }}>
                    Ordered: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </div>

                  {/* Update Status Button */}
                  {nextStatus(order.status) && (
                    <button
                      className='btn-approve'
                      onClick={() => handleStatusUpdate(order._id, nextStatus(order.status))}
                    >
                      Mark as {nextStatus(order.status)} →
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <span style={{ fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
                      ✓ Delivered
                    </span>
                  )}

                  {order.status === 'cancelled' && (
                    <span style={{ fontSize: '13px', color: '#DC2626', fontWeight: 600 }}>
                      ✗ Cancelled
                    </span>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CookOrders