import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";

function CookPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [cook, setCook] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mealType, setMealType] = useState("lunch");

  useEffect(() => {
    fetchCookData();
  }, [id]);

  const fetchCookData = async () => {
    try {
      const [cookRes, menuRes] = await Promise.all([
        axiosInstance.get(`/cook/${id}`),
        axiosInstance.get(`/menu/today/${id}`),
      ]);
      setCook(cookRes.data.cookProfile);
      setMenus(menuRes.data.menus);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMenus = menus.filter((m) => m.mealType === mealType);

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
        <div className="dashboard-navbar-brand">TiffinBox</div>
        <div className="dashboard-navbar-right">
          <button
            className="dashboard-navbar-btn"
            onClick={() => navigate("/home")}
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Cook Profile Header */}
        <div className="table-card" style={{ marginBottom: "24px" }}>
          <div
            style={{
              padding: "28px 24px",
              display: "flex",
              gap: "20px",
              alignItems: "flex-start",
            }}
          >
            {cook?.photo ? (
              <img
                src={cook.photo}
                alt="cook"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "16px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "16px",
                  background: "var(--brand-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                  flexShrink: 0,
                }}
              >
                👩‍🍳
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "var(--ink)",
                  letterSpacing: "-0.5px",
                  marginBottom: "4px",
                }}
              >
                {cook?.userId?.name}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--subtle)",
                  marginBottom: "8px",
                }}
              >
                📍 {cook?.address}, {cook?.city}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--muted)",
                  marginBottom: "12px",
                  lineHeight: 1.6,
                }}
              >
                {cook?.bio}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#D97706",
                  }}
                >
                  ⭐ {cook?.rating || 0} ({cook?.totalReviews || 0} reviews)
                </div>
                <div className="cook-card-tags">
                  {cook?.cuisineType?.map((c, i) => (
                    <span key={i} className="cook-tag">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meal Type Toggle */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
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
                    : "2px solid var(--border)",
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
              {type === "lunch" ? "Lunch" : "Dinner"}
            </button>
          ))}
        </div>

        {/* Today's Menu */}
        {filteredMenus.length === 0 ? (
          <div className="table-card">
            <div style={{ padding: "48px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🍽️</div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "6px",
                }}
              >
                No {mealType} menu today
              </div>
              <div style={{ fontSize: "13px", color: "var(--subtle)" }}>
                Check back later or try dinner menu
              </div>
            </div>
          </div>
        ) : (
          filteredMenus.map((menu) => (
            <div key={menu._id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  Today's {mealType} menu
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#D97706",
                    fontWeight: 600,
                  }}
                >
                  ⏰ Order before {menu.cutoffTime}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {menu.dishes?.map((dish, i) => (
                  <div key={i} className="menu-dish-card">
                    {dish.photo && (
                      <img
                        src={dish.photo}
                        alt={dish.name}
                        className="menu-dish-image"
                      />
                    )}
                    <div className="menu-dish-body">
                      <div className="menu-dish-name">{dish.name}</div>
                      {dish.description && (
                        <div className="menu-dish-desc">{dish.description}</div>
                      )}
                      <div className="menu-dish-footer">
                        <div className="menu-dish-price">₹{dish.price}</div>
                        <div className="menu-dish-portions">
                          {dish.portionsLeft} portions left
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CookPublicProfile;
