import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import NotificationBell from "./NotificationBell";
import {
  ArrowLeft,
  ClipboardList,
  PlusCircle,
  ListOrdered,
  Users,
  ChefHat,
  Key,
  User as UserIcon,
  LogOut,
} from "lucide-react";

function Navbar({ showBack, backPath, backLabel }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getHomePath = () => {
    if (user?.role === "cook") return "/cook/dashboard";
    if (user?.role === "admin") return "/admin/dashboard";
    return "/home";
  };

  return (
    <nav
      style={{
        background: "rgba(249,249,255,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(20,27,43,0.06)",
        padding: "0 40px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
        fontFamily: "var(--font-body)",
      }}>
      {/* Brand */}
      <span
        onClick={() => navigate(getHomePath())}
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "1.15rem",
          color: "var(--on-surface)",
          letterSpacing: "-0.02em",
          cursor: "pointer",
          userSelect: "none",
        }}>
        TiffinBox
      </span>

      {/* Right side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}>
        {/* Back button */}
        {showBack && (
          <NavBtn
            icon={<ArrowLeft size={14} />}
            label={backLabel || "Back"}
            onClick={() => navigate(backPath || -1)}
          />
        )}

        {/* Customer links */}
        {user?.role === "customer" && (
          <NavBtn
            icon={<ClipboardList size={14} />}
            label='My Orders'
            onClick={() => navigate("/orders/my")}
          />
        )}

        {/* Cook links */}
        {user?.role === "cook" && (
          <>
            <NavBtn
              icon={<PlusCircle size={14} />}
              label='Post Menu'
              onClick={() => navigate("/cook/post-menu")}
            />
            <NavBtn
              icon={<ListOrdered size={14} />}
              label='Orders'
              onClick={() => navigate("/cook/orders")}
            />
          </>
        )}

        {/* Admin links */}
        {user?.role === "admin" && (
          <NavBtn
            icon={<Users size={14} />}
            label='Pending Cooks'
            onClick={() => navigate("/admin/pending-cooks")}
          />
        )}

        <NotificationBell />

        {/* User chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "var(--radius-pill)",
            background: "var(--surface-container-high)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--on-surface-variant)",
            userSelect: "none",
          }}>
          {user?.role === "cook" ? (
            <ChefHat size={14} />
          ) : user?.role === "admin" ? (
            <Key size={14} />
          ) : (
            <UserIcon size={14} />
          )}
          {user?.name?.split(" ")[0]}
        </div>

        {/* Logout */}
        <NavBtn
          icon={<LogOut size={14} />}
          label='Logout'
          onClick={handleLogout}
          danger
        />
      </div>
    </nav>
  );
}

/* ── Small reusable nav button ── */
function NavBtn({ icon, label, onClick, danger }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "7px 13px",
        borderRadius: "var(--radius-lg)",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "0.8125rem",
        transition: "all 0.15s",
        background: danger
          ? hovered
            ? "#fee2e2"
            : "transparent"
          : hovered
            ? "var(--primary-fixed-dim)"
            : "var(--primary-fixed)",
        color: danger
          ? hovered
            ? "#991b1b"
            : "var(--on-surface-variant)"
          : "var(--primary-container)",
      }}>
      {icon} {label}
    </button>
  );
}

// useState needed for NavBtn hover
import { useState } from "react";

export default Navbar;
