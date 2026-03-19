import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

function PendingCooks() {
  const navigate = useNavigate();
  const [cooks, setCooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState(null);

  useEffect(() => {
    fetchPendingCooks();
  }, []);

  const fetchPendingCooks = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/cooks/pending");
      setCooks(data.pendingCooks);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/admin/cooks/${id}/verify`);
      setCooks(cooks.filter((c) => c._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to reject this cook?",
    );
    if (!confirm) return;
    try {
      await axiosInstance.put(`/admin/cooks/${id}/reject`, {
        reason: rejectReason,
      });
      setCooks(cooks.filter((c) => c._id !== id));
      setRejectingId(null);
      setRejectReason("");
    } catch (err) {
      console.log(err);
    }
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
      {/* Navbar */}
      <div className="dashboard-navbar">
        <div className="dashboard-navbar-brand">🍱 TiffinBox Admin</div>
        <div className="dashboard-navbar-right">
          <button
            className="dashboard-navbar-btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Dashboard
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-title">Pending Cooks</div>
        <div className="dashboard-subtitle">
          {cooks.length} cook{cooks.length !== 1 ? "s" : ""} waiting for
          approval
        </div>

        {cooks.length === 0 ? (
          <div className="table-card">
            <div
              style={{
                padding: "48px",
                textAlign: "center",
                color: "var(--muted)",
                fontSize: "14px",
              }}
            >
              No pending cooks 🎉
            </div>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {cooks.map((cook) => (
              <div key={cook._id} className="table-card">
                {/* Cook Summary Row */}
                <div
                  className="pending-cook-row"
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                    }}
                  >
                    {cook.photo ? (
                      <img
                        src={cook.photo}
                        alt="cook"
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "10px",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "10px",
                          background: "var(--brand-light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          flexShrink: 0,
                        }}
                      >
                        👩‍🍳
                      </div>
                    )}
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "var(--ink)",
                          fontSize: "15px",
                        }}
                      >
                        {cook.userId?.name}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--subtle)",
                          marginTop: "2px",
                        }}
                      >
                        {cook.userId?.email} · {cook.city}
                      </div>
                    </div>
                  </div>

                  <div
                    className="pending-cook-actions"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === cook._id ? null : cook._id)
                      }
                      style={{
                        background: "none",
                        border: "1.5px solid var(--border)",
                        borderRadius: "8px",
                        padding: "7px 14px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        color: "var(--muted)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {expandedId === cook._id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(cook._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-reject"
                      style={{ marginLeft: 0 }}
                      onClick={() => setRejectingId(cook._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === cook._id && (
                  <div
                    className="pending-cook-details"
                    style={{
                      borderTop: "1px solid var(--border)",
                      padding: "24px",
                      background: "#fafafa",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    {cook.photo && (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <img
                          src={cook.photo}
                          alt="cook"
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "12px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--subtle)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "4px",
                        }}
                      >
                        Full Name
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--ink)",
                          fontWeight: 500,
                        }}
                      >
                        {cook.userId?.name}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--subtle)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "4px",
                        }}
                      >
                        Email
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--ink)",
                          fontWeight: 500,
                        }}
                      >
                        {cook.userId?.email}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--subtle)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "4px",
                        }}
                      >
                        City
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--ink)",
                          fontWeight: 500,
                        }}
                      >
                        {cook.city}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--subtle)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "4px",
                        }}
                      >
                        Address
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--ink)",
                          fontWeight: 500,
                        }}
                      >
                        {cook.address}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--subtle)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "4px",
                        }}
                      >
                        Cuisine Type
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--ink)",
                          fontWeight: 500,
                        }}
                      >
                        {cook.cuisineType?.join(", ")}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--subtle)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "4px",
                        }}
                      >
                        Submitted On
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--ink)",
                          fontWeight: 500,
                        }}
                      >
                        {new Date(cook.createdAt).toLocaleDateString()} at{" "}
                        {new Date(cook.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--subtle)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "4px",
                        }}
                      >
                        Bio
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--ink)",
                          fontWeight: 500,
                          lineHeight: 1.6,
                        }}
                      >
                        {cook.bio}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reject Reason */}
                {rejectingId === cook._id && (
                  <div
                    style={{
                      borderTop: "1px solid #FECACA",
                      padding: "16px 24px",
                      background: "#fff5f5",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#DC2626",
                        marginBottom: "10px",
                      }}
                    >
                      Enter rejection reason:
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        style={{
                          border: "1.5px solid #FECACA",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          flex: 1,
                          background: "#fff",
                          fontSize: "14px",
                          outline: "none",
                          fontFamily: "var(--font-body)",
                        }}
                        placeholder="e.g. Profile information incomplete..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                      <button
                        className="btn-reject"
                        style={{ marginLeft: 0 }}
                        onClick={() => handleReject(cook._id)}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          setRejectingId(null);
                          setRejectReason("");
                        }}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingCooks;
