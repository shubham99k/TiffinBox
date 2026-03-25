import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import NotificationBell from "../../components/NotificationBell";
import Navbar from '../../components/Navbar'
import { Utensils, MapPin, ChefHat, Star, Clock, ArrowRight } from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mealType, setMealType] = useState("lunch");

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(
          `/menu/all?mealType=${mealType}`,
        );
        setMenus(data.menus);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, [mealType]);

  const getHour = new Date().getHours();
  const greeting =
    getHour < 12 ? "Morning" : getHour < 17 ? "Afternoon" : "Evening";

  const getTimeRemaining = (cutoffTime) => {
    const now = new Date()
    const [hours, minutes] = cutoffTime.split(':').map(Number)
    const cutoff = new Date()
    cutoff.setHours(hours, minutes, 0, 0)

    const diff = cutoff - now
    if (diff <= 0) return 'Expired'

    const h = Math.floor(diff / (1000 * 60 * 60))
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (h > 0) return `${h}h ${m}m remaining`
    if (m > 0) return `${m}m remaining`
    return `few seconds remaining`
  }

  return (
    <div className="dashboard-wrap">
      {/* Navbar */}
      <Navbar />

      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-title">
          Good {greeting}, <br /> {user?.name?.split(" ")[0]}!
        </div>
        <div className="dashboard-subtitle">
          Fresh homemade meals available today
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
        ) : menus.length === 0 ? (
          <div className="table-card">
            <div style={{ padding: "48px", textAlign: "center" }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "12px", color: "var(--ink)" }}><Utensils size={40} /></div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "6px",
                }}
              >
                No {mealType} menus available right now
              </div>
              <div style={{ fontSize: "13px", color: "var(--subtle)" }}>
                Check back later or try switching meal type
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {menus.map((menu) => (
              <div key={menu._id} className="table-card">
                {/* Cook Info Header */}
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    {menu.cookId?.photo ? (
                      <img
                        src={menu.cookId.photo}
                        alt="cook"
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "10px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "10px",
                          background: "var(--brand-light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                        }}
                      >
                        <ChefHat size={20} />
                      </div>
                    )}
                    <div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "var(--ink)",
                        }}
                      >
                        {menu.cookId?.userId?.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--subtle)" }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Star size={12} fill="#D97706" color="#D97706" /> {menu.cookId?.rating || 0}</span>&nbsp;&nbsp;&nbsp;<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {menu.cookId?.city}</span>&nbsp;&nbsp;&nbsp;<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: "#D97706" }}><Clock size={12} />Order before {menu.cutoffTime}&nbsp;({getTimeRemaining(menu.cutoffTime)})</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/cook/${menu.cookId?._id}`)}
                    style={{
                      fontSize: "12px",
                      color: "var(--brand)",
                      fontWeight: 600,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>View Profile <ArrowRight size={14} /></span>
                  </button>
                </div>

                {/* Dishes */}
                <div
                  style={{
                    padding: "16px 20px",
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
                          <div className="menu-dish-desc">
                            {dish.description}
                          </div>
                        )}
                        <div className="menu-dish-footer">
                          <div className="menu-dish-price">₹{dish.price}</div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <div className="menu-dish-portions">
                              {dish.portionsLeft} left
                            </div>
                            {dish.portionsLeft > 0 && (
                              <button
                                onClick={() =>
                                  navigate("/orders/place", {
                                    state: {
                                      menuId: menu._id,
                                      dishIndex: i,
                                      dish,
                                    },
                                  })
                                }
                                style={{
                                  background: "var(--brand)",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "8px",
                                  padding: "6px 14px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  fontFamily: "var(--font-body)",
                                }}
                              >
                                Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
