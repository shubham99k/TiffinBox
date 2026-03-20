import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import stockPhotos from "../../utils/stockPhotos";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

function PostMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [mealType, setMealType] = useState("lunch");
  const [cutoffTime, setCutoffTime] = useState("10:00");
  const [dishes, setDishes] = useState([
    {
      name: "",
      photo: "",
      description: "",
      price: "",
      maxPortions: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPhotoPicker, setShowPhotoPicker] = useState(null);
  const [existingMenus, setExistingMenus] = useState([]);

  useEffect(() => {
    fetchMyMenus();
  }, []);

  const fetchMyMenus = async () => {
    try {
      const { data } = await axiosInstance.get("/menu/my");
      setExistingMenus(data.menus);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDishChange = (index, field, value) => {
    const updated = [...dishes];
    updated[index][field] = value;
    setDishes(updated);
  };

  const handleAddDish = () => {
    setDishes([
      ...dishes,
      { name: "", photo: "", description: "", price: "", maxPortions: "" },
    ]);
  };

  const handleRemoveDish = (index) => {
    setDishes(dishes.filter((_, i) => i !== index));
  };

  const handleSelectPhoto = (index, url) => {
    handleDishChange(index, "photo", url);
    setShowPhotoPicker(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axiosInstance.post("/menu", {
        mealType,
        cutoffTime,
        dishes: dishes.map((d) => ({
          ...d,
          price: Number(d.price),
          maxPortions: Number(d.maxPortions),
        })),
      });
      setSuccess(`${mealType} menu posted successfully!`);
      fetchMyMenus();
      setDishes([
        { name: "", photo: "", description: "", price: "", maxPortions: "" },
      ]);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="menu-wrap">
      {/* Navbar */}
      <div className="dashboard-navbar">
        <div className="dashboard-navbar-brand">TiffinBox</div>
        <div className="dashboard-navbar-right">
          <button
            className="dashboard-navbar-btn"
            onClick={() => navigate("/cook/dashboard")}
          >
            ← Dashboard
          </button>
          <button className="dashboard-navbar-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-title">Post Today's Menu</div>
        <div className="dashboard-subtitle">
          Add dishes for lunch or dinner today
        </div>

        {/* Existing Menus */}
        {existingMenus.length > 0 && (
          <div className="table-card" style={{ marginBottom: "24px" }}>
            <div className="table-card-header">
              <div className="table-card-title">Already Posted Today</div>
            </div>
            <div style={{ padding: "16px 24px", display: "flex", gap: "10px" }}>
              {existingMenus.map((menu) => (
                <span key={menu._id} className="badge badge-verified">
                  ✓ {menu.mealType} menu posted
                </span>
              ))}
            </div>
          </div>
        )}

        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Meal Type + Cutoff Time */}
          <div className="table-card" style={{ marginBottom: "20px" }}>
            <div className="table-card-header">
              <div className="table-card-title">Menu Details</div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div className="inp-row">
                <div style={{ flex: 1 }}>
                  <div className="inp-label" style={{ marginBottom: "8px" }}>
                    Meal Type
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {["lunch", "dinner"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setMealType(type);
                          setCutoffTime(type === "lunch" ? "10:00" : "16:00");
                        }}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "10px",
                          border:
                            mealType === type
                              ? "2px solid var(--brand)"
                              : "1.5px solid var(--border)",
                          background:
                            mealType === type
                              ? "var(--brand-light)"
                              : "var(--white)",
                          color:
                            mealType === type
                              ? "var(--brand)"
                              : "var(--subtle)",
                          fontWeight: 600,
                          fontSize: "13px",
                          cursor: "pointer",
                          fontFamily: "var(--font-body)",
                          textTransform: "capitalize",
                        }}
                      >
                        {type === "lunch" ? "Lunch" : "Dinner"}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="inp-wrap">
                    <div className="inp-label">Cutoff Time (24hr)</div>
                    <input
                      className="inp-field"
                      type="time"
                      value={cutoffTime}
                      onChange={(e) => setCutoffTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dishes */}
          <div className="table-card" style={{ marginBottom: "20px" }}>
            <div className="table-card-header">
              <div className="table-card-title">Dishes</div>
              <div style={{ fontSize: "13px", color: "var(--subtle)" }}>
                {dishes.length} dish{dishes.length !== 1 ? "es" : ""}
              </div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              {dishes.map((dish, index) => (
                <div key={index} className="dish-card">
                  <div className="dish-card-header">
                    <div className="dish-card-title">Dish {index + 1}</div>
                    {dishes.length > 1 && (
                      <button
                        type="button"
                        className="dish-remove-btn"
                        onClick={() => handleRemoveDish(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Photo Picker */}
                  <div style={{ marginBottom: "14px" }}>
                    <div className="inp-label" style={{ marginBottom: "8px" }}>
                      Photo
                    </div>
                    {dish.photo ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <img
                          src={dish.photo}
                          alt="dish"
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "10px",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPhotoPicker(
                              showPhotoPicker === index ? null : index,
                            )
                          }
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
                          Change Photo
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setShowPhotoPicker(
                            showPhotoPicker === index ? null : index,
                          )
                        }
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          border: "1.5px dashed var(--border)",
                          background: "#fafafa",
                          fontSize: "13px",
                          color: "var(--subtle)",
                          cursor: "pointer",
                          fontFamily: "var(--font-body)",
                          fontWeight: 500,
                        }}
                      >
                        + Pick a photo
                      </button>
                    )}

                    {/* Photo Grid */}
                    {showPhotoPicker === index && (
                      <div style={{ marginTop: "12px" }}>
                        <div className="photo-picker-grid">
                          {stockPhotos.map((p, pi) => (
                            <div key={pi}>
                              <div
                                className={`photo-picker-item ${dish.photo === p.url ? "selected" : ""}`}
                                onClick={() => handleSelectPhoto(index, p.url)}
                              >
                                <img src={p.url} alt={p.name} />
                              </div>
                              <div className="photo-picker-name">{p.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="inp-wrap">
                    <div className="inp-label">Dish Name</div>
                    <input
                      className="inp-field"
                      type="text"
                      value={dish.name}
                      onChange={(e) =>
                        handleDishChange(index, "name", e.target.value)
                      }
                      placeholder="e.g. Dal Tadka"
                      required
                    />
                  </div>

                  <div className="inp-wrap">
                    <div className="inp-label">
                      Description{" "}
                      <span style={{ textTransform: "none", fontWeight: 400 }}>
                        (optional)
                      </span>
                    </div>
                    <input
                      className="inp-field"
                      type="text"
                      value={dish.description}
                      onChange={(e) =>
                        handleDishChange(index, "description", e.target.value)
                      }
                      placeholder="e.g. Homemade dal with tadka"
                    />
                  </div>

                  <div className="inp-row">
                    <div className="inp-wrap">
                      <div className="inp-label">Price (₹)</div>
                      <input
                        className="inp-field"
                        type="number"
                        value={dish.price}
                        onChange={(e) =>
                          handleDishChange(index, "price", e.target.value)
                        }
                        placeholder="80"
                        required
                        min="1"
                      />
                    </div>
                    <div className="inp-wrap">
                      <div className="inp-label">Max Portions</div>
                      <input
                        className="inp-field"
                        type="number"
                        value={dish.maxPortions}
                        onChange={(e) =>
                          handleDishChange(index, "maxPortions", e.target.value)
                        }
                        placeholder="10"
                        required
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="add-dish-btn"
                onClick={handleAddDish}
              >
                + Add Another Dish
              </button>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading
              ? "Posting menu..."
              : `Post ${mealType === "lunch" ? "Lunch" : "Dinner"} Menu`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostMenu;
