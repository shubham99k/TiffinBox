import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import axiosInstance from "../../utils/axiosInstance";
import NotificationBell from '../../components/NotificationBell'


function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [cooks, setCooks] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mealType, setMealType] = useState("lunch");

  useEffect(() => {
    fetchData();
  }, [mealType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cooksRes, menusRes] = await Promise.all([
        axiosInstance.get(`/cook/all?city=${user?.city}`),
        axiosInstance.get(`/menu/city?city=${user?.city}&mealType=${mealType}`),
      ]);
      setCooks(cooksRes.data.cooks);
      setMenus(menusRes.data.menus);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Find menu for a cook
  const getCookMenu = (cookId) => {
    return menus.find((m) => m.cookId._id === cookId);
  };

  return (
    <div className="dashboard-wrap">
      {/* Navbar */}
      <div className="dashboard-navbar">
        <div className="dashboard-navbar-brand">TiffinBox</div>
        <div className="dashboard-navbar-right">
            <NotificationBell />  
          <div className="dashboard-navbar-user">👤 {user?.name}</div>
          <button className='dashboard-navbar-btn' onClick={() => navigate('/orders/my')}>
  My Orders
</button>
          <button className="dashboard-navbar-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-title">
          Good{" "}
          {new Date().getHours() < 12
            ? "Morning"
            : new Date().getHours() < 17
              ? "Afternoon"
              : "Evening"}
          , {user?.name?.split(" ")[0]}! 👋
        </div>
        <div className="dashboard-subtitle">
          Fresh homemade meals in {user?.city} today
        </div>

        {/* Meal Type Toggle */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
          {["lunch", "dinner"].map((type) => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              style={{
                padding: "10px 24px",
                borderRadius: "10px",
                border:
                  mealType === type
                    ? "2px solid var(--brand)"
                    : "1.5px solid var(--border)",
                background:
                  mealType === type ? "var(--brand-light)" : "var(--white)",
                color: mealType === type ? "var(--brand)" : "var(--subtle)",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                textTransform: "capitalize",
                transition: "all 0.2s",
              }}
            >
              {type === "lunch" ? " Lunch" : "Dinner"}
            </button>
          ))}
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px",
              color: "var(--muted)",
              fontSize: "14px",
            }}
          >
            Loading...
          </div>
        ) : cooks.length === 0 ? (
          <div className="table-card">
            <div style={{ padding: "48px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🍽️</div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "6px",
                }}
              >
                No cooks available in {user?.city}
              </div>
              <div style={{ fontSize: "13px", color: "var(--subtle)" }}>
                Check back later or try switching meal type
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {cooks.map((cook) => {
              const menu = getCookMenu(cook._id);
              return (
                <div
                  key={cook._id}
                  className="cook-card"
                  onClick={() => navigate(`/cook/${cook._id}`)}
                >
                  {/* Cook Photo */}
                  {cook.photo ? (
                    <img
                      src={cook.photo}
                      alt={cook.userId?.name}
                      className="cook-card-image"
                    />
                  ) : (
                    <div className="cook-card-image">👩‍🍳</div>
                  )}

                  <div className="cook-card-body">
                    <div className="cook-card-name">{cook.userId?.name}</div>
                    <div className="cook-card-meta">
                      📍 {cook.city} · ⭐ {cook.rating || 0} (
                      {cook.totalReviews || 0} reviews)
                    </div>

                    {/* Cuisine Tags */}
                    <div className="cook-card-meta" style={{fontSize: "11px",
                            fontWeight: 600,
                            color: "var(--subtle)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            marginBottom: "6px",}}>
                      &nbsp;Cusine Type:
                      </div>
                      <div
                        className="cook-card-tags"
                        style={{ marginBottom: "12px" }}
                      >
                        {cook.cuisineType?.map((c, i) => (
                          <span key={i} className="cook-tag">
                            {c}
                          </span>
                        ))}
                      </div>

                    {/* Menu Preview */}
                    {menu ? (
                      <div
                        style={{
                          borderTop: "1px solid var(--border)",
                          paddingTop: "10px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "var(--subtle)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            marginBottom: "6px",
                          }}
                        >
                          Today's {mealType} menu
                        </div>
                        {menu.dishes?.slice(0, 2).map((dish, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "4px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "13px",
                                color: "var(--ink)",
                                fontWeight: 500,
                              }}
                            >
                              {dish.name}
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "var(--brand)",
                                fontWeight: 700,
                              }}
                            >
                              ₹{dish.price}
                            </div>
                          </div>
                        ))}
                        {menu.dishes?.length > 2 && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--subtle)",
                              marginTop: "4px",
                            }}
                          >
                            +{menu.dishes.length - 2} more dishes
                          </div>
                        )}
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#D97706",
                            fontWeight: 600,
                            marginTop: "6px",
                          }}
                        >
                          ⏰ Order before {menu.cutoffTime}
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          borderTop: "1px solid var(--border)",
                          paddingTop: "10px",
                          fontSize: "12px",
                          color: "var(--subtle)",
                        }}
                      >
                        No {mealType} menu posted yet
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
