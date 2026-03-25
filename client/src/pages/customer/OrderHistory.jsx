import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from '../../components/Navbar'
import Alert from '../../components/Alert'
import { validateReview } from "../../utils/validate";
import { Utensils, MapPin, Star, CheckCircle2 } from "lucide-react";
import ConfirmDialog from '../../components/ConfirmDialog'

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [confirmCancelId, setConfirmCancelId] = useState(null)
  const [expandedReviewId, setExpandedReviewId] = useState(null)

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/orders/my");
      setOrders(data.orders);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await axiosInstance.put(`/orders/${confirmCancelId}/cancel`)
      setOrders(orders.map((o) => o._id === confirmCancelId ? { ...o, status: 'cancelled' } : o))
      setConfirmCancelId(null)
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot cancel order')
    }
  }

  const handleReview = async (orderId) => {
    const validationError = validateReview(reviewData.rating);
    if (validationError) return alert(validationError);
    try {
      await axiosInstance.post("/reviews", {
        orderId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, isReviewed: true } : o)),
      );
      setReviewingId(null);
      setReviewData({ rating: 5, comment: "" });
      setReviewSuccess("Review submitted successfully!");
      setTimeout(() => setReviewSuccess(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const statusColor = (status) => {
    const colors = {
      confirmed: "badge-verified",
      preparing: "badge-cook",
      ready: "badge-customer",
      delivered: "badge-verified",
      cancelled: "badge-rejected",
      pending: "badge-pending",
    };
    return colors[status] || "badge-pending";
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ fontSize: "14px", color: "var(--muted)" }}>
          Loading...
        </div>
      </div>
    );

  return (
    <div className="dashboard-wrap">
      <Navbar showBack backPath='/home' backLabel='Home' />


      <div className="dashboard-content">
        <div className="dashboard-title">My Orders</div>
        <div className="dashboard-subtitle">{orders.length} orders total</div>

        {reviewSuccess && <Alert type="success" message={reviewSuccess} onClose={() => setReviewSuccess("")} />}

        {orders.length === 0 ? (
          <div className="table-card">
            <div style={{ padding: "48px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px", color: "var(--ink)" }}><Utensils size={40} /></div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "6px",
                }}
              >
                No orders yet
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--subtle)",
                  marginBottom: "20px",
                }}
              >
                Browse home cooks and place your first order!
              </div>
              <button
                className="auth-btn"
                style={{ width: "auto", padding: "10px 24px" }}
                onClick={() => navigate("/home")}
              >
                Browse Cooks
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {orders.map((order) => (
              <div key={order._id} className="table-card">
                <div style={{ padding: "20px 24px" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "flex-start",
                    }}
                  >
                    {order.dish?.photo && (
                      <img
                        src={order.dish.photo}
                        alt={order.dish.name}
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "12px",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "var(--ink)",
                          }}
                        >
                          {order.dish?.name}
                        </div>
                        <span className={`badge ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--subtle)",
                          marginBottom: "4px",
                        }}
                      >
                        Qty: {order.quantity} · ₹{order.totalAmount} · COD
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--subtle)",
                          marginBottom: "8px",
                        }}
                      >
                        <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> {order.deliveryAddress}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--subtle)" }}>
                        {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>

                      {["confirmed", "pending"].includes(order.status) && (
                        <button
                          onClick={() => setConfirmCancelId(order._id)}
                          className="btn-reject"
                          style={{ marginLeft: 0, marginTop: "10px" }}
                        >
                          Cancel Order
                        </button>
                      )}

                      {/* Review Button */}
                      {order.status === "delivered" && !order.isReviewed && (
                        <button
                          onClick={() => setReviewingId(order._id)}
                          className="btn-approve"
                          style={{ marginTop: "10px" }}
                        >
                          <Star size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} /> Leave Review
                        </button>
                      )}

                      {order.isReviewed && (
                        <div style={{ marginTop: '8px' }}>
                          <div
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                            onClick={() => setExpandedReviewId(expandedReviewId === order._id ? null : order._id)}
                          >
                            <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={12} /> Reviewed
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--subtle)' }}>
                              {expandedReviewId === order._id ? 'Hide ▲' : 'View ▼'}
                            </span>
                          </div>

                          {expandedReviewId === order._id && order.review && (
                            <div style={{
                              marginTop: '8px',
                              padding: '10px 14px',
                              background: '#F0FDF4',
                              borderRadius: '8px',
                              border: '1px solid #BBF7D0'
                            }}>
                              <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
                                {Array.from({ length: order.review.rating }).map((_, i) => (
                                  <Star key={i} size={14} color="#D97706" fill="#D97706" />
                                ))}
                              </div>
                              {order.review.comment && (
                                <div style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>
                                  {order.review.comment}
                                </div>
                              )}
                              <div style={{ fontSize: '11px', color: 'var(--subtle)', marginTop: '4px' }}>
                                {new Date(order.review.createdAt).toLocaleDateString('en-GB')}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Form */}
                  {reviewingId === order._id && (
                    <div
                      style={{
                        borderTop: "1px solid var(--border)",
                        marginTop: "16px",
                        paddingTop: "16px",
                      }}
                    >
                      {/* Star Rating */}
                      <div style={{ marginBottom: "12px" }}>
                        <div
                          className="inp-label"
                          style={{ marginBottom: "8px" }}
                        >
                          Rating
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() =>
                                setReviewData({ ...reviewData, rating: star })
                              }
                              style={{
                                fontSize: "24px",
                                cursor: "pointer",
                                opacity: star <= reviewData.rating ? 1 : 0.3,
                                transition: "opacity 0.15s",
                              }}
                            >
                              <Star size={24} fill="currentColor" />
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <div
                        className="inp-wrap"
                        style={{ marginBottom: "12px" }}
                      >
                        <div className="inp-label">Comment (optional)</div>
                        <input
                          className="inp-field"
                          type="text"
                          value={reviewData.comment}
                          onChange={(e) =>
                            setReviewData({
                              ...reviewData,
                              comment: e.target.value,
                            })
                          }
                          placeholder="How was the food?"
                        />
                      </div>

                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          className="btn-approve"
                          onClick={() => handleReview(order._id)}
                        >
                          Submit Review
                        </button>
                        <button
                          onClick={() => setReviewingId(null)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--subtle)",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {confirmCancelId && (
        <ConfirmDialog
          message="Are you sure you want to cancel this order?"
          confirmLabel="Cancel Order"
          confirmColor="#DC2626"
          onConfirm={handleCancel}
          onCancel={() => setConfirmCancelId(null)}
        />
      )}
    </div>
  );
}

export default OrderHistory;
