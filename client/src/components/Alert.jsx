import { useEffect, useState } from "react";

function Alert({ type = "error", message, onClose, duration = 2500 }) {
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message || !onClose) return;

    setProgress(100);
    setVisible(false);

    // Slight delay to trigger enter animation
    const enterTimeout = setTimeout(() => setVisible(true), 10);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // wait for exit animation before removing
    }, duration);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev - 100 / (duration / 100);
        return next <= 0 ? 0 : next;
      });
    }, 100);

    return () => {
      clearTimeout(enterTimeout);
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [message, onClose, duration]);

  if (!message) return null;

  const styles = {
    error: {
      bg: "#FEF2F2",
      color: "#DC2626",
      border: "#FECACA",
      bar: "#DC2626",
    },
    success: {
      bg: "#F0FDF4",
      color: "#16A34A",
      border: "#BBF7D0",
      bar: "#16A34A",
    },
    warning: {
      bg: "#FFFBEB",
      color: "#D97706",
      border: "#FDE68A",
      bar: "#D97706",
    },
    info: {
      bg: "#EFF6FF",
      color: "#2563EB",
      border: "#BFDBFE",
      bar: "#2563EB",
    },
  };

  const s = styles[type];

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "24px",
        zIndex: 9999,
        minWidth: "280px",
        maxWidth: "380px",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: 500,
        fontFamily: "var(--font-body)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        overflow: "hidden",
        // Animation
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(110%)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {/* Content */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{message}</span>
        {onClose && (
          <span
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            style={{
              cursor: "pointer",
              fontSize: "16px",
              marginLeft: "12px",
              opacity: 0.6,
            }}
          >
            ×
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{ height: "3px", background: "rgba(0,0,0,0.06)" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: s.bar,
            opacity: 0.5,
            transition: "width 0.1s linear",
          }}
        />
      </div>
    </div>
  );
}

export default Alert;
