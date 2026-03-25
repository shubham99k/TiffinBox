import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import NotificationBell from "./NotificationBell";
import { ArrowLeft, ClipboardList, PlusCircle, ListOrdered, Users, ChefHat, Key, User as UserIcon, LogOut } from "lucide-react";

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
    <div className="dashboard-navbar">
      <div
        className="dashboard-navbar-brand"
        onClick={() => navigate(getHomePath())}
        style={{ cursor: "pointer" }}
      >
        TiffinBox
      </div>
      <div className="dashboard-navbar-right">
        {showBack && (
          <button
            className="dashboard-navbar-btn"
            onClick={() => navigate(backPath || -1)}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <ArrowLeft size={16} /> {backLabel || "Back"}
          </button>
        )}

        {/* Customer Links */}
        {user?.role === "customer" && (
          <button
            className="dashboard-navbar-btn"
            onClick={() => navigate("/orders/my")}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <ClipboardList size={16} /> My Orders
          </button>
        )}

        {/* Cook Links */}
        {user?.role === "cook" && (
          <>
            <button
              className="dashboard-navbar-btn"
              onClick={() => navigate("/cook/post-menu")}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <PlusCircle size={16} /> Post Menu
            </button>
            <button
              className="dashboard-navbar-btn"
              onClick={() => navigate("/cook/orders")}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <ListOrdered size={16} /> Orders
            </button>
          </>
        )}

        {/* Admin Links */}
        {user?.role === "admin" && (
          <button
            className="dashboard-navbar-btn"
            onClick={() => navigate("/admin/pending-cooks")}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Users size={16} /> Pending Cooks
          </button>
        )}

        <NotificationBell />

        <div
          className="dashboard-navbar-user"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            {user?.role === "cook"
              ? <ChefHat size={18} />
              : user?.role === "admin"
                ? <Key size={18} />
                : <UserIcon size={18} />}
          </span>
          <span>{user?.name?.split(" ")[0]}</span>
        </div>

        <button 
          className="dashboard-navbar-btn" 
          onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
