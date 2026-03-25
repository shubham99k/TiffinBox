import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from '../../components/Navbar'
import { ChefHat, MapPin, Star, Utensils, Clock } from "lucide-react";


function CookPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cook, setCook] = useState(null);
  const [menus, setMenus] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mealType, setMealType] = useState("lunch");

  useEffect(() => {
    const fetchCookData = async () => {
      try {
        const [cookRes, menuRes, reviewRes] = await Promise.all([
          axiosInstance.get(`/cook/${id}`),
          axiosInstance.get(`/menu/today/${id}`),
          axiosInstance.get(`/reviews/cook/${id}`),
        ]);
        setCook(cookRes.data.cookProfile);
        setMenus(menuRes.data.menus);
        setReviews(reviewRes.data.reviews);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCookData();
  }, [id]);

  const filteredMenus = menus.filter((m) => m.mealType === mealType);

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
      <Navbar showBack backPath='/home' backLabel='Home' />


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
                <ChefHat size={40} />
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
                <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> {cook?.address}, {cook?.city}
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
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Star size={14} fill="currentColor" color="#D97706" /> {cook?.rating || 0} ({cook?.totalReviews || 0} reviews)</span>
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
          <div className="table-card" style={{ marginBottom: "24px" }}>
            <div style={{ padding: "48px", textAlign: "center" }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "12px", color: "var(--ink)" }}><Utensils size={32} /></div>
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
            <div key={menu._id} style={{ marginBottom: "24px" }}>
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
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Order before {menu.cutoffTime}&nbsp;({getTimeRemaining(menu.cutoffTime)})</span>
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
          ))
        )}

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div style={{ marginTop: "24px" }}>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: "14px",
              }}
            >
              Reviews ({reviews.length})
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {reviews.map((review) => (
                <div key={review._id} className="table-card">
                  <div style={{ padding: "16px 20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "var(--ink)",
                        }}
                      >
                        {review.customerId?.name}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#D97706",
                          fontWeight: 600,
                        }}
                      >
                        <div style={{ display: "flex", gap: "2px" }}>
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={12} color="#D97706" fill="#D97706" />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--muted)",
                          lineHeight: 1.6,
                        }}
                      >
                        {review.comment}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--subtle)",
                        marginTop: "6px",
                      }}
                    >
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CookPublicProfile;
