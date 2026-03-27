import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Alert from "../../components/Alert";
import Navbar from "../../components/Navbar";
import {
  Package,
  Star,
  Inbox,
  MapPin,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import ConfirmDialog from "../../components/ConfirmDialog";
import Footer from "../../components/Footer";

function CookOrders() {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pastMenus, setPastMenus] = useState([]);
  const [pastMenusLoading, setPastMenusLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [confirmStatusUpdate, setConfirmStatusUpdate] = useState(null);

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
    setPastMenusLoading(true);
    try {
      const { data } = await axiosInstance.get("/menu/history");
      setPastMenus(data.menus);
    } catch (err) {
      console.log(err);
    } finally {
      setPastMenusLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await axiosInstance.put(`/orders/${confirmStatusUpdate.id}/status`, {
        status: confirmStatusUpdate.status,
      });
      setOrders(
        orders.map((o) =>
          o._id === confirmStatusUpdate.id
            ? { ...o, status: confirmStatusUpdate.status }
            : o,
        ),
      );
      setSuccess(`Order marked as ${confirmStatusUpdate.status}!`);
      setConfirmStatusUpdate(null);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setConfirmStatusUpdate(null);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await axiosInstance.put(`/orders/${confirmCancelId}/status`, {
        status: "cancelled",
      });
      setOrders(
        orders.map((o) =>
          o._id === confirmCancelId ? { ...o, status: "cancelled" } : o,
        ),
      );
      setSuccess("Order cancelled successfully!");
      setConfirmCancelId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const nextStatus = (current) => {
    const flow = {
      confirmed: "preparing",
      preparing: "ready",
      ready: "delivered",
    };
    return flow[current] || null;
  };

  const statusStyle = (status) => {
    const map = {
      confirmed: {
        bg: "var(--primary-fixed)",
        color: "var(--primary-container)",
      },
      preparing: { bg: "#fef3c7", color: "#92400e" },
      ready: {
        bg: "var(--primary-fixed-dim)",
        color: "var(--primary-container)",
      },
      delivered: {
        bg: "var(--primary-fixed)",
        color: "var(--primary-container)",
      },
      cancelled: { bg: "#fee2e2", color: "#991b1b" },
    };
    return (
      map[status] || {
        bg: "var(--surface-container-high)",
        color: "var(--on-surface-variant)",
      }
    );
  };

  /* ── Loading ── */
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--surface)",
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "3px solid var(--primary-fixed)",
              borderTopColor: "var(--primary)",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span
            style={{
              fontSize: "0.875rem",
              color: "var(--on-surface-variant)",
              fontFamily: "var(--font-body)",
            }}>
            Loading orders…
          </span>
        </div>
      </div>
    );

  const tabs = [
    {
      id: "orders",
      icon: <Package size={15} />,
      label: `Orders (${orders.length})`,
    },
    {
      id: "reviews",
      icon: <Star size={15} fill='currentColor' />,
      label: `Reviews (${reviews.length})`,
    },
    { id: "pastMenus", icon: <Inbox size={15} />, label: "Past Menus" },
  ];

  return (
    <div>
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        fontFamily: "var(--font-body)",
      }}>
      <Navbar showBack backPath='/cook/dashboard' backLabel='Dashboard' />

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 24px 64px",
        }}>
        {/* Page header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "2rem",
              color: "var(--on-surface)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "6px",
            }}>
            Cook Panel
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--on-surface-variant)" }}>
            Manage your orders, reviews and past menus
          </p>
        </div>

        {/* ── TABS ── */}
        <div
          style={{
            display: "flex",
            background: "var(--surface-container-high)",
            borderRadius: "var(--radius-lg)",
            padding: "4px",
            gap: "4px",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}>
          {tabs.map(({ id, icon, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  if (id === "pastMenus" && pastMenus.length === 0)
                    fetchPastMenus();
                }}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  padding: "10px 16px",
                  borderRadius: "calc(var(--radius-lg) - 2px)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  transition: "all 0.2s",
                  background: isActive
                    ? "var(--surface-container-lowest)"
                    : "transparent",
                  color: isActive
                    ? "var(--primary-container)"
                    : "var(--on-surface-variant)",
                  boxShadow: isActive ? "0 1px 6px rgba(6,78,59,0.12)" : "none",
                }}>
                {icon} {label}
              </button>
            );
          })}
        </div>

        <Alert type='error' message={error} onClose={() => setError("")} />
        <Alert
          type='success'
          message={success}
          onClose={() => setSuccess("")}
        />

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" &&
          (orders.length === 0 ? (
            <EmptyState
              icon={<Inbox size={32} color='var(--outline)' />}
              title='No orders yet'
              sub='Orders will appear here once customers place them'
            />
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {orders.map((order) => {
                const { bg, color } = statusStyle(order.status);
                const next = nextStatus(order.status);
                return (
                  <div
                    key={order._id}
                    style={{
                      background: "var(--surface-container-lowest)",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                      overflow: "hidden",
                    }}>
                    {/* Order header */}
                    <div
                      style={{
                        padding: "18px 22px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        borderBottom: "1px solid var(--surface-container-high)",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}>
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 800,
                            fontSize: "1rem",
                            color: "var(--on-surface)",
                            letterSpacing: "-0.02em",
                            marginBottom: "3px",
                          }}>
                          {order.dish?.name}
                        </p>
                        <p
                          style={{
                            fontSize: "0.8125rem",
                            color: "var(--on-surface-variant)",
                          }}>
                          Qty: {order.quantity} &nbsp;·&nbsp; ₹
                          {order.totalAmount} &nbsp;·&nbsp; COD
                        </p>
                      </div>
                      {/* Status badge */}
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "var(--radius-pill)",
                          background: bg,
                          color,
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          flexShrink: 0,
                        }}>
                        {order.status}
                      </span>
                    </div>

                    {/* Customer info */}
                    <div
                      style={{
                        padding: "14px 22px",
                        borderBottom: "1px solid var(--surface-container-high)",
                      }}>
                      <p
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          color: "var(--on-surface-variant)",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          marginBottom: "8px",
                        }}>
                        Customer
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "0.9375rem",
                          color: "var(--on-surface)",
                          marginBottom: "2px",
                        }}>
                        {order.customerId?.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--on-surface-variant)",
                          marginBottom: "6px",
                        }}>
                        {order.customerId?.email}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--on-surface-variant)",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}>
                        <MapPin size={13} style={{ flexShrink: 0 }} />
                        {order.deliveryAddress}
                      </p>
                    </div>

                    {/* Footer: timestamp + actions */}
                    <div
                      style={{
                        padding: "12px 22px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--on-surface-variant)",
                        }}>
                        {new Date(order.createdAt).toLocaleDateString("en-GB")}{" "}
                        at {new Date(order.createdAt).toLocaleTimeString()}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}>
                        {next && (
                          <button
                            onClick={() =>
                              setConfirmStatusUpdate({
                                id: order._id,
                                status: next,
                              })
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 16px",
                              borderRadius: "var(--radius-lg)",
                              background: "var(--primary-fixed)",
                              color: "var(--primary-container)",
                              border: "none",
                              cursor: "pointer",
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              fontSize: "0.8125rem",
                              transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background =
                                "var(--primary-fixed-dim)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background =
                                "var(--primary-fixed)")
                            }>
                            Mark as {next} <ArrowRight size={13} />
                          </button>
                        )}

                        {["confirmed", "preparing"].includes(order.status) && (
                          <button
                            onClick={() => setConfirmCancelId(order._id)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 16px",
                              borderRadius: "var(--radius-lg)",
                              background: "#fee2e2",
                              color: "#991b1b",
                              border: "none",
                              cursor: "pointer",
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              fontSize: "0.8125rem",
                            }}>
                            Cancel Order
                          </button>
                        )}

                        {order.status === "delivered" && (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              fontSize: "0.8125rem",
                              fontWeight: 700,
                              color: "var(--primary-container)",
                            }}>
                            <CheckCircle2 size={15} /> Delivered
                          </span>
                        )}

                        {order.status === "cancelled" && (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              fontSize: "0.8125rem",
                              fontWeight: 700,
                              color: "#991b1b",
                            }}>
                            <XCircle size={15} /> Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

        {/* ── REVIEWS TAB ── */}
        {activeTab === "reviews" &&
          (reviews.length === 0 ? (
            <EmptyState
              icon={
                <Star size={32} fill='var(--outline)' color='var(--outline)' />
              }
              title='No reviews yet'
              sub='Reviews will appear here once customers rate your food'
            />
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {reviews.map((review) => (
                <div
                  key={review._id}
                  style={{
                    background: "var(--surface-container-lowest)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                    padding: "20px 24px",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "10px",
                    }}>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "0.9375rem",
                        color: "var(--on-surface)",
                        letterSpacing: "-0.01em",
                      }}>
                      {review.customerId?.name}
                    </p>
                    {/* Star rating */}
                    <div style={{ display: "flex", gap: "2px" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          fill={i < review.rating ? "#b45309" : "none"}
                          color={
                            i < review.rating
                              ? "#b45309"
                              : "var(--border-light)"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {review.comment && (
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--on-surface-variant)",
                        lineHeight: 1.7,
                        marginBottom: "10px",
                        paddingLeft: "12px",
                        borderLeft: "3px solid var(--primary-fixed-dim)",
                      }}>
                      {review.comment}
                    </p>
                  )}

                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--on-surface-variant)",
                      opacity: 0.7,
                    }}>
                    {new Date(review.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
              ))}
            </div>
          ))}

        {/* ── PAST MENUS TAB ── */}
        {activeTab === "pastMenus" &&
          (pastMenusLoading ? (
            <div
              style={{
                textAlign: "center",
                padding: "56px",
                color: "var(--on-surface-variant)",
                fontSize: "0.875rem",
              }}>
              Loading past menus…
            </div>
          ) : pastMenus.length === 0 ? (
            <EmptyState
              icon={<Inbox size={32} color='var(--outline)' />}
              title='No past menus'
              sub='Your expired and past menus will appear here'
            />
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {pastMenus.map((menu) => (
                <div
                  key={menu._id}
                  style={{
                    background: "var(--surface-container-lowest)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                    overflow: "hidden",
                  }}>
                  {/* Menu header */}
                  <div
                    style={{
                      padding: "14px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid var(--surface-container-high)",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "0.9375rem",
                        color: "var(--on-surface)",
                        textTransform: "capitalize",
                        letterSpacing: "-0.01em",
                      }}>
                      {menu.mealType} menu
                    </span>
                    <span
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--on-surface-variant)",
                      }}>
                      {new Date(menu.date).toLocaleDateString("en-GB")} · cutoff{" "}
                      {menu.cutoffTime}
                    </span>
                  </div>

                  {/* Dish tags */}
                  <div
                    style={{
                      padding: "12px 20px",
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                    }}>
                    {menu.dishes?.map((d, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "4px 12px",
                          borderRadius: "var(--radius-pill)",
                          background: "var(--surface-container-high)",
                          color: "var(--on-surface-variant)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          fontFamily: "var(--font-body)",
                        }}>
                        {d.name} · ₹{d.price} · {d.maxPortions - d.portionsLeft}
                        /{d.maxPortions} sold
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>

      {confirmCancelId && (
        <ConfirmDialog
          message='Are you sure you want to cancel this order?'
          confirmLabel='Cancel Order'
          confirmColor='#DC2626'
          onConfirm={handleCancelOrder}
          onCancel={() => setConfirmCancelId(null)}
        />
      )}
      {confirmStatusUpdate && (
        <ConfirmDialog
          message={`Mark this order as ${confirmStatusUpdate.status}?`}
          confirmLabel={`Mark as ${confirmStatusUpdate.status}`}
          confirmColor='#059669'
          onConfirm={handleStatusUpdate}
          onCancel={() => setConfirmStatusUpdate(null)}
        />
      )}
    </div>
    <Footer />
    </div>
  );
}

/* ── Reusable empty state ── */
function EmptyState({ icon, title, sub }) {
  return (
    <div
      style={{
        background: "var(--surface-container-lowest)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
        padding: "105px 32px",
        textAlign: "center",
      }}>
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "var(--surface-container-high)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 18px",
        }}>
        {icon}
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "1rem",
          color: "var(--on-surface)",
          letterSpacing: "-0.02em",
          marginBottom: "6px",
        }}>
        {title}
      </p>
      <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)" }}>
        {sub}
      </p>
    </div>
  );
}

export default CookOrders;
