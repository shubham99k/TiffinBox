import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import ConfirmDialog from "../../components/ConfirmDialog";

function PendingCooks() {
  const [cooks, setCooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [confirmApproveId, setConfirmApproveId] = useState(null);
  const [confirmRejectId, setConfirmRejectId] = useState(null);

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

  const handleApprove = async () => {
    try {
      await axiosInstance.put(`/admin/cooks/${confirmApproveId}/verify`);
      setCooks(cooks.filter((c) => c._id !== confirmApproveId));
      setConfirmApproveId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async () => {
    try {
      await axiosInstance.put(`/admin/cooks/${confirmRejectId}/reject`, {
        reason: rejectReason,
      });
      setCooks(cooks.filter((c) => c._id !== confirmRejectId));
      setConfirmRejectId(null);
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
          background: "var(--surface)",
        }}>
        <div
          style={{
            fontSize: "0.875rem",
            color: "var(--outline)",
            fontFamily: "var(--font-body)",
          }}>
          Loading…
        </div>
      </div>
    );

  return (
    <div className='dashboard-wrap'>
      <Navbar showBack backPath='/admin/dashboard' backLabel='Dashboard' />

      <div
        className='dashboard-content'
        style={{ maxWidth: "1300px", margin: "0 auto", paddingBottom: "48px" }}>
        {/* ── Page Header ── */}
        <div style={{ marginBottom: "36px" }}>
          <div className='dashboard-title'>Pending Cooks</div>
          <div className='dashboard-subtitle'>
            {cooks.length} cook{cooks.length !== 1 ? "s" : ""} waiting for
            approval
          </div>
        </div>

        {/* ── Empty State ── */}
        {cooks.length === 0 ? (
          <div className='table-card'>
            <div
              style={{
                padding: "56px 48px",
                textAlign: "center",
                color: "var(--outline)",
                fontSize: "0.875rem",
                fontFamily: "var(--font-body)",
              }}>
              No pending cooks — all caught up!
            </div>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {cooks.map((cook) => (
              <div
                key={cook._id}
                className='table-card'
                style={{ overflow: "visible" }}>
                {/* ── Cook Summary Row ── */}
                <div
                  style={{
                    padding: "20px 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}>
                  {/* Avatar + info */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}>
                    {cook.photo ? (
                      <img
                        src={cook.photo}
                        alt='cook'
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "var(--radius-lg)",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "var(--radius-lg)",
                          background: "var(--primary-fixed)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          flexShrink: 0,
                        }}>
                        👩‍🍳
                      </div>
                    )}
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "var(--on-surface)",
                          fontSize: "0.9375rem",
                          fontFamily: "var(--font-display)",
                          letterSpacing: "-0.01em",
                        }}>
                        {cook.userId?.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--outline)",
                          marginTop: "2px",
                          fontFamily: "var(--font-body)",
                        }}>
                        {cook.userId?.email} · {cook.city}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}>
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === cook._id ? null : cook._id)
                      }
                      style={{
                        background: "var(--surface-container-high)",
                        border: "none",
                        borderRadius: "var(--radius-lg)",
                        padding: "7px 16px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        color: "var(--on-surface-variant)",
                        fontFamily: "var(--font-body)",
                        transition: "background 0.2s",
                      }}>
                      {expandedId === cook._id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                    <button
                      className='btn-approve'
                      onClick={() => setConfirmApproveId(cook._id)}>
                      Approve
                    </button>
                    <button
                      className='btn-reject'
                      style={{ marginLeft: 0 }}
                      onClick={() => setRejectingId(cook._id)}>
                      Reject
                    </button>
                  </div>
                </div>

                {/* ── Expanded Details ── */}
                {expandedId === cook._id && (
                  <div
                    style={{
                      borderTop: "1px solid var(--outline-variant)",
                      padding: "28px",
                      background: "var(--surface-container-low)",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                    }}>
                    {cook.photo && (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <img
                          src={cook.photo}
                          alt='cook'
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "var(--radius-lg)",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}

                    {[
                      { label: "Full Name", value: cook.userId?.name },
                      { label: "Email", value: cook.userId?.email },
                      { label: "City", value: cook.city },
                      { label: "Address", value: cook.address },
                      {
                        label: "Cuisine Type",
                        value: cook.cuisineType?.join(", "),
                      },
                      {
                        label: "Submitted On",
                        value: `${new Date(cook.createdAt).toLocaleDateString("en-GB")} at ${new Date(cook.createdAt).toLocaleTimeString()}`,
                      },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div
                          className='stat-card-label'
                          style={{ marginBottom: "4px" }}>
                          {label}
                        </div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--on-surface)",
                            fontWeight: 500,
                            fontFamily: "var(--font-body)",
                          }}>
                          {value}
                        </div>
                      </div>
                    ))}

                    <div style={{ gridColumn: "1 / -1" }}>
                      <div
                        className='stat-card-label'
                        style={{ marginBottom: "4px" }}>
                        Bio
                      </div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--on-surface)",
                          fontWeight: 500,
                          lineHeight: 1.65,
                          fontFamily: "var(--font-body)",
                        }}>
                        {cook.bio}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Reject Reason Input ── */}
                {rejectingId === cook._id && (
                  <div
                    style={{
                      borderTop: "1px solid var(--error-border)",
                      padding: "16px 28px",
                      background: "var(--error-bg)",
                      borderBottomLeftRadius: "var(--radius-lg)",
                      borderBottomRightRadius: "var(--radius-lg)",
                    }}>
                    <div
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: "var(--error)",
                        marginBottom: "12px",
                        fontFamily: "var(--font-display)",
                      }}>
                      Enter rejection reason:
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}>
                      <div className='inp-icon-wrap' style={{ flex: 1 }}>
                        <input
                          className='inp-field no-icon'
                          placeholder='e.g. Profile information incomplete…'
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          style={{ borderColor: "var(--error-border)" }}
                        />
                      </div>
                      <button
                        className='btn-reject'
                        style={{ marginLeft: 0 }}
                        onClick={() => setConfirmRejectId(cook._id)}>
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
                          color: "var(--outline)",
                          cursor: "pointer",
                          fontSize: "0.8125rem",
                          fontFamily: "var(--font-body)",
                          transition: "color 0.15s",
                        }}>
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

      {/* ── Confirm Approve Dialog ── */}
      {confirmApproveId && (
        <ConfirmDialog
          message={`Are you sure you want to approve ${cooks.find((c) => c._id === confirmApproveId)?.userId?.name}?`}
          confirmLabel='Approve'
          confirmColor='#16A34A'
          onConfirm={handleApprove}
          onCancel={() => setConfirmApproveId(null)}
        />
      )}

      {/* ── Confirm Reject Dialog ── */}
      {confirmRejectId && (
        <ConfirmDialog
          message={`Are you sure you want to reject ${cooks.find((c) => c._id === confirmRejectId)?.userId?.name}?`}
          confirmLabel='Reject'
          confirmColor='#DC2626'
          onConfirm={handleReject}
          onCancel={() => {
            setConfirmRejectId(null);
          }}
        />
      )}
    </div>
  );
}

export default PendingCooks;
