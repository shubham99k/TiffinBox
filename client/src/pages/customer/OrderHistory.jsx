import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'

function OrderHistory() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get('/orders/my')
      setOrders(data.orders)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return
    try {
      await axiosInstance.put(`/orders/${id}/cancel`)
      setOrders(orders.map(o =>
        o._id === id ? { ...o, status: 'cancelled' } : o
      ))
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot cancel order')
    }
  }

  const statusColor = (status) => {
    const colors = {
      confirmed: 'badge-verified',
      preparing: 'badge-cook',
      ready: 'badge-customer',
      delivered: 'badge-verified',
      cancelled: 'badge-rejected',
      pending: 'badge-pending'
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
          <button className='dashboard-navbar-btn' onClick={() => navigate('/home')}>
            ← Home
          </button>
        </div>
      </div>

      <div className='dashboard-content'>
        <div className='dashboard-title'>My Orders</div>
        <div className='dashboard-subtitle'>{orders.length} orders total</div>

        {orders.length === 0 ? (
          <div className='table-card'>
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🍽️</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
                No orders yet
              </div>
              <div style={{ fontSize: '13px', color: 'var(--subtle)', marginBottom: '20px' }}>
                Browse home cooks and place your first order!
              </div>
              <button className='auth-btn' style={{ width: 'auto', padding: '10px 24px' }}
                onClick={() => navigate('/home')}>
                Browse Cooks
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {orders.map(order => (
              <div key={order._id} className='table-card'>
                <div style={{ padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

                  {/* Dish Photo */}
                  {order.dish?.photo && (
                    <img src={order.dish.photo} alt={order.dish.name}
                      style={{ width: '72px', height: '72px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
                  )}

                  {/* Order Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
                        {order.dish?.name}
                      </div>
                      <span className={`badge ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--subtle)', marginBottom: '4px' }}>
                      Qty: {order.quantity} · ₹{order.totalAmount} · COD
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--subtle)', marginBottom: '8px' }}>
                      📍 {order.deliveryAddress}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--subtle)' }}>
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </div>

                    {/* Cancel Button */}
                    {['confirmed', 'pending'].includes(order.status) && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        className='btn-reject'
                        style={{ marginLeft: 0, marginTop: '10px' }}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistory