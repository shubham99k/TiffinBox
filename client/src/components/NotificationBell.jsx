import { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Bell } from "lucide-react";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target) && open) {
        setNotifications((notifications) =>
          notifications.map((n) => ({ ...n, isRead: true })),
        );
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get("/notifications");
      setNotifications(data.notifications);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchNotifications();
  }, []);

  const handleOpen = async () => {
    if (!open) {
      try {
        await axiosInstance.put("/notifications/read");
      } catch (err) {
        console.log(err);
      }
    } else {
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    }
    setOpen(!open);
  };

  const unreadCount = open ? 0 : notifications.filter((n) => !n.isRead).length;

  return (
    <div ref={bellRef} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        style={{
          position: "relative",
          background: open
            ? "var(--primary-fixed)"
            : "var(--surface-container-high)",
          border: "none",
          borderRadius: "var(--radius-lg)",
          width: "38px",
          height: "38px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--primary-fixed)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = open
            ? "var(--primary-fixed)"
            : "var(--surface-container-high)")
        }>
        <Bell
          size={17}
          color={
            open ? "var(--primary-container)" : "var(--on-surface-variant)"
          }
        />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-3px",
              right: "-3px",
              background: "var(--error)",
              color: "#fff",
              borderRadius: "var(--radius-pill)",
              fontSize: "0.625rem",
              fontWeight: 700,
              minWidth: "16px",
              height: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              fontFamily: "var(--font-body)",
              border: "2px solid var(--surface-container-lowest)",
            }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "46px",
            width: "320px",
            background: "var(--surface-container-lowest)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 8px 32px rgba(20,27,43,0.12)",
            zIndex: 100,
            overflow: "hidden",
          }}>
          {/* Header */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid var(--surface-container-high)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "0.9375rem",
                color: "var(--on-surface)",
                letterSpacing: "-0.02em",
              }}>
              Notifications
            </span>
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  color: "var(--primary-container)",
                  background: "var(--primary-fixed)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-pill)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}>
                {notifications.filter((n) => !n.isRead).length} new
              </span>
            )}
          </div>

          {/* Body */}
          {notifications.length === 0 ? (
            <div
              style={{
                padding: "40px 24px",
                textAlign: "center",
              }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "var(--surface-container-high)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}>
                <Bell size={18} color='var(--outline)' />
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--on-surface)",
                  marginBottom: "4px",
                  fontFamily: "var(--font-display)",
                }}>
                All caught up
              </p>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--on-surface-variant)",
                }}>
                No notifications yet
              </p>
            </div>
          ) : (
            <div style={{ maxHeight: "340px", overflowY: "auto" }}>
              {notifications.map((n, i) => (
                <div
                  key={n._id}
                  style={{
                    padding: "13px 18px",
                    background: n.isRead
                      ? "transparent"
                      : "var(--primary-fixed)",
                    borderBottom:
                      i < notifications.length - 1
                        ? "1px solid var(--surface-container-high)"
                        : "none",
                    transition: "background 0.2s",
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}>
                  {/* Unread dot */}
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: n.isRead ? "transparent" : "var(--primary)",
                      flexShrink: 0,
                      marginTop: "6px",
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--on-surface)",
                        fontWeight: n.isRead ? 400 : 600,
                        lineHeight: 1.5,
                        marginBottom: "3px",
                        fontFamily: "var(--font-body)",
                      }}>
                      {n.message}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--on-surface-variant)",
                        fontFamily: "var(--font-body)",
                      }}>
                      {new Date(n.createdAt).toLocaleDateString()} at{" "}
                      {new Date(n.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
