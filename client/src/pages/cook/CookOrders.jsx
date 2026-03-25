import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Alert from "../../components/Alert";
import Navbar from '../../components/Navbar';
import { Package, Star, Inbox, MapPin, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import ConfirmDialog from '../../components/ConfirmDialog'

function CookOrders() {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pastMenus, setPastMenus] = useState([])
  const [pastMenusLoading, setPastMenusLoading] = useState(false)
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmCancelId, setConfirmCancelId] = useState(null)
  const [confirmStatusUpdate, setConfirmStatusUpdate] = useState(null)

  useEffect(() => {
    fetchOrders();
    fetchReviews();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/orders/cook");
      setOrders(data.orders);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const profileRes = await axiosInstance.get("/cook/profile/me");
      const { data } = await axiosInstance.get(
        `/reviews/cook/${profileRes.data.cookProfile._id}`,
      );
      setReviews(data.reviews);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPastMenus = async () => {
    setPastMenusLoading(true)
    try {
      const { data } = await axiosInstance.get('/menu/history')
      setPastMenus(data.menus)
    } catch (err) {
      console.log(err)
    } finally {
      setPastMenusLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    try {
      await axiosInstance.put(`/orders/${confirmStatusUpdate.id}/status`, { status: confirmStatusUpdate.status })
      setOrders(orders.map((o) => o._id === confirmStatusUpdate.id ? { ...o, status: confirmStatusUpdate.status } : o))
      setSuccess(`Order marked as ${confirmStatusUpdate.status}!`)
      setConfirmStatusUpdate(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
      setConfirmStatusUpdate(null)
    }
  }

  const handleCancelOrder = async () => {
    try {
      await axiosInstance.put(`/orders/${confirmCancelId}/status`, { status: 'cancelled' })
      setOrders(orders.map((o) => o._id === confirmCancelId ? { ...o, status: 'cancelled' } : o))
      setSuccess('Order cancelled successfully!')
      setConfirmCancelId(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  const nextStatus = (current) => {
    const flow = {
      confirmed: "preparing",
      preparing: "ready",
      ready: "delivered",
    };
    return flow[current] || null;
  };

  const statusColor = (status) => {
    const colors = {
      confirmed: "badge-verified",
      preparing: "badge-cook",
      ready: "badge-customer",
      delivered: "badge-verified",
      cancelled: "badge-rejected",
    };
    return colors[status] || "badge-pending";
  };

  if (loading)
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ fontSize: "14px", color: "var(--muted)" }}>Loading...</div>
      </div>
    );

  return (
    <div className="dashboard-wrap">
      <Navbar showBack backPath='/cook/dashboard' backLabel='Dashboard' />

      <div className="dashboard-content">
        <div className="dashboard-title">Cook Panel</div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {["orders", "reviews", "pastMenus"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                if (tab === 'pastMenus' && pastMenus.length === 0) fetchPastMenus()
              }}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: activeTab === tab ? "1.5px solid var(--brand)" : "1.5px solid var(--border)",
                background: activeTab === tab ? "var(--brand-light)" : "var(--white)",
                color: activeTab === tab ? "var(--brand)" : "var(--subtle)",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              {tab === "orders" && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Package size={16} /> Orders ({orders.length})</span>}
              {tab === "reviews" && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={16} fill="currentColor" /> Reviews ({reviews.length})</span>}
              {tab === "pastMenus" && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Inbox size={16} /> Past Menus</span>}
            </button>
          ))}
        </div>

        <Alert type="error" message={error} onClose={() => setError("")} />
        <Alert type="success" message={success} onClose={() => setSuccess("")} />

        {/* Orders Tab */}
        {activeTab === "orders" &&
          (orders.length === 0 ? (
            <div className="table-card">
              <div style={{ padding: "48px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px", color: "var(--ink)" }}><Inbox size={40} /></div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)" }}>No orders yet</div>
                <div style={{ fontSize: "13px", color: "var(--subtle)" }}>Orders will appear here once customers place them</div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {orders.map((order) => (
                <div key={order._id} className="table-card">
                  <div style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)", marginBottom: "2px" }}>
                          {order.dish?.name}
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--subtle)" }}>
                          Qty: {order.quantity} · ₹{order.totalAmount} · COD
                        </div>
                      </div>
                      <span className={`badge ${statusColor(order.status)}`}>{order.status}</span>
                    </div>

                    <div style={{ background: "#fafafa", borderRadius: "10px", padding: "12px", marginBottom: "12px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--subtle)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                        Customer
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500 }}>{order.customerId?.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--subtle)" }}>{order.customerId?.email}</div>
                      <div style={{ fontSize: "12px", color: "var(--subtle)", marginTop: "4px" }}>
                        <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                        {order.deliveryAddress}
                      </div>
                    </div>

                    <div style={{ fontSize: "11px", color: "var(--subtle)", marginBottom: "12px" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-GB")} at{" "}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {nextStatus(order.status) && (
                        <button
                          className="btn-approve"
                          onClick={() => setConfirmStatusUpdate({ id: order._id, status: nextStatus(order.status) })}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Mark as {nextStatus(order.status)} <ArrowRight size={14} />
                          </span>
                        </button>
                      )}
                      {["confirmed", "preparing"].includes(order.status) && (
                        <button className="btn-reject" style={{ marginLeft: 0 }} onClick={() => setConfirmCancelId(order._id)}>
                          Cancel Order
                        </button>
                      )}
                      {order.status === "delivered" && (
                        <span style={{ fontSize: "13px", color: "#16A34A", fontWeight: 600 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> Delivered</span>
                        </span>
                      )}
                      {order.status === "cancelled" && (
                        <span style={{ fontSize: "13px", color: "#DC2626", fontWeight: 600 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={14} /> Cancelled</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

        {/* Reviews Tab */}
        {activeTab === "reviews" &&
          (reviews.length === 0 ? (
            <div className="table-card">
              <div style={{ padding: "48px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px", color: "var(--ink)" }}><Star size={40} fill="currentColor" /></div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)" }}>No reviews yet</div>
                <div style={{ fontSize: "13px", color: "var(--subtle)" }}>Reviews will appear here once customers rate your food</div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {reviews.map((review) => (
                <div key={review._id} className="table-card">
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>{review.customerId?.name}</div>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={16} color="#D97706" fill="#D97706" />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{review.comment}</div>
                    )}
                    <div style={{ fontSize: "11px", color: "var(--subtle)", marginTop: "6px" }}>
                      {new Date(review.createdAt).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

        {/* Past Menus Tab */}
        {activeTab === "pastMenus" && (
          pastMenusLoading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)', fontSize: '14px' }}>Loading...</div>
          ) : pastMenus.length === 0 ? (
            <div className="table-card">
              <div style={{ padding: "48px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px", color: "var(--ink)" }}><Inbox size={40} /></div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)" }}>No past menus</div>
                <div style={{ fontSize: "13px", color: "var(--subtle)" }}>Your expired and past menus will appear here</div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {pastMenus.map((menu) => (
                <div key={menu._id} className="table-card">
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', textTransform: 'capitalize' }}>
                        {menu.mealType} menu
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--subtle)' }}>
                        {new Date(menu.date).toLocaleDateString('en-GB')} · cutoff {menu.cutoffTime}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {menu.dishes?.map((d, i) => (
                        <span key={i} className="cook-tag">
                          {d.name} · ₹{d.price} · {d.maxPortions - d.portionsLeft}/{d.maxPortions} sold
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {confirmCancelId && (
        <ConfirmDialog
          message="Are you sure you want to cancel this order?"
          confirmLabel="Cancel Order"
          confirmColor="#DC2626"
          onConfirm={handleCancelOrder}
          onCancel={() => setConfirmCancelId(null)}
        />
      )}
      {confirmStatusUpdate && (
        <ConfirmDialog
          message={`Mark this order as ${confirmStatusUpdate.status}?`}
          confirmLabel={`Mark as ${confirmStatusUpdate.status}`}
          confirmColor="#16A34A"
          onConfirm={handleStatusUpdate}
          onCancel={() => setConfirmStatusUpdate(null)}
        />
      )}
    </div>
  );
}

export default CookOrders;