import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import stockPhotos from "../../utils/stockPhotos";
import Alert from "../../components/Alert";
import { validateMenu } from "../../utils/validate";
import Navbar from '../../components/Navbar'
import ConfirmDialog from '../../components/ConfirmDialog'
import { Pencil, Trash2, X, ChevronDown, ChevronUp } from "lucide-react";

function PostMenu() {
  const [mealType, setMealType] = useState("lunch");
  const [cutoffTime, setCutoffTime] = useState("10:00");
  const [dishes, setDishes] = useState([{ name: "", photo: "", description: "", price: "", maxPortions: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPhotoPicker, setShowPhotoPicker] = useState(null);
  const [existingMenus, setExistingMenus] = useState([]);
  const [editingMenu, setEditingMenu] = useState(null);
  const [confirmDeleteMenuId, setConfirmDeleteMenuId] = useState(null)
  const [inlineEditId, setInlineEditId] = useState(null)
  const [inlineFormData, setInlineFormData] = useState({})
  const [inlinePhotoPicker, setInlinePhotoPicker] = useState(null)
  const [inlineLoading, setInlineLoading] = useState(false)

  const getCurrentTime = () => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  }

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
    setDishes([...dishes, { name: "", photo: "", description: "", price: "", maxPortions: "" }]);
  };

  const handleRemoveDish = (index) => {
    if (dishes.length === 1) return;
    setDishes(dishes.filter((_, i) => i !== index));
  };

  const handleSelectPhoto = (index, url) => {
    handleDishChange(index, "photo", url);
    setShowPhotoPicker(null);
  };

  // Inline edit handlers
  const handleInlineEdit = (menu) => {
    setInlineEditId(menu._id)
    setInlineFormData({
      cutoffTime: menu.cutoffTime,
      dishes: menu.dishes.map(d => ({
        name: d.name, photo: d.photo, description: d.description,
        price: d.price, maxPortions: d.maxPortions
      }))
    })
  }

  const handleInlineDishChange = (index, field, value) => {
    const updated = [...inlineFormData.dishes]
    updated[index][field] = value
    setInlineFormData({ ...inlineFormData, dishes: updated })
  }

  const handleInlineAddDish = () => {
    setInlineFormData({
      ...inlineFormData,
      dishes: [...inlineFormData.dishes, { name: "", photo: "", description: "", price: "", maxPortions: "" }]
    })
  }

  const handleInlineRemoveDish = (index) => {
    if (inlineFormData.dishes.length === 1) return
    setInlineFormData({
      ...inlineFormData,
      dishes: inlineFormData.dishes.filter((_, i) => i !== index)
    })
  }

  const handleInlineSelectPhoto = (index, url) => {
    handleInlineDishChange(index, "photo", url)
    setInlinePhotoPicker(null)
  }

  const handleInlineSubmit = async (menuId) => {
    const validationError = validateMenu(inlineFormData.dishes, inlineFormData.cutoffTime)
    if (validationError) return setError(validationError)

    setInlineLoading(true)
    try {
      const payload = {
        cutoffTime: inlineFormData.cutoffTime,
        dishes: inlineFormData.dishes.map(d => ({
          ...d,
          price: Number(d.price),
          maxPortions: Number(d.maxPortions)
        }))
      }
      await axiosInstance.put(`/menu/${menuId}`, payload)
      setSuccess("Menu updated successfully!")
      setInlineEditId(null)
      fetchMyMenus()
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setInlineLoading(false)
    }
  }

  const handleDeleteMenu = async () => {
    try {
      await axiosInstance.delete(`/menu/${confirmDeleteMenuId}`)
      setExistingMenus(existingMenus.filter((m) => m._id !== confirmDeleteMenuId))
      setSuccess("Menu deleted successfully!")
      setConfirmDeleteMenuId(null)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateMenu(dishes, cutoffTime);
    if (validationError) return setError(validationError);

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        mealType,
        cutoffTime,
        dishes: dishes.map((d) => ({
          ...d,
          price: Number(d.price),
          maxPortions: Number(d.maxPortions),
        })),
      };

      await axiosInstance.post("/menu", payload);
      setSuccess(`${mealType} menu posted successfully!`);
      fetchMyMenus();
      setDishes([{ name: "", photo: "", description: "", price: "", maxPortions: "" }]);
      setCutoffTime(mealType === "lunch" ? "10:00" : "16:00");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-wrap">
      <Navbar showBack backPath='/cook/dashboard' backLabel='Dashboard' />

      <div className="dashboard-content">
        <div className="dashboard-title">Post Today's Menu</div>
        <div className="dashboard-subtitle">Add dishes for lunch or dinner today</div>

        <Alert type="error" message={error} onClose={() => setError("")} />
        <Alert type="success" message={success} onClose={() => setSuccess("")} />

        {/* Today's Posted Menus */}
        {existingMenus.length > 0 && (
          <div className="table-card" style={{ marginBottom: "24px" }}>
            <div className="table-card-header">
              <div className="table-card-title">Today's Posted Menus</div>
              <div style={{ fontSize: '13px', color: 'var(--subtle)' }}>{existingMenus.length} menu{existingMenus.length !== 1 ? 's' : ''}</div>
            </div>
            <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {existingMenus.map((menu) => (
                <div key={menu._id} style={{ borderRadius: "10px", border: '1px solid var(--border)', overflow: 'hidden' }}>

                  {/* Menu Header Row */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px",
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)", textTransform: "capitalize" }}>
                          {menu.mealType} menu
                        </div>
                        {menu.isExpired ? (
                          <span style={{ fontSize: '11px', background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                            Expired
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                            Live
                          </span>
                        )}
                        {inlineEditId === menu._id && (
                          <span style={{ fontSize: '11px', background: 'var(--brand-light)', color: 'var(--brand)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                            Editing
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--subtle)", marginTop: "2px" }}>
                        {menu.dishes?.length} dishes · cutoff {menu.cutoffTime}
                      </div>
                      <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
                        {menu.dishes?.map((d, i) => (
                          <span key={i} className="cook-tag">{d.name} · ₹{d.price}</span>
                        ))}
                      </div>
                    </div>

                    {!menu.isExpired && (
                      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <button
                          onClick={() => inlineEditId === menu._id ? setInlineEditId(null) : handleInlineEdit(menu)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '7px 14px', borderRadius: '8px', border: '1.5px solid var(--brand)',
                            background: inlineEditId === menu._id ? 'var(--brand)' : 'white',
                            color: inlineEditId === menu._id ? 'white' : 'var(--brand)',
                            fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)'
                          }}
                        >
                          {inlineEditId === menu._id ? <><X size={13} /> Cancel</> : <><Pencil size={13} /> Edit</>}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteMenuId(menu._id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #FECACA',
                            background: '#FEF2F2', color: '#DC2626',
                            fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)'
                          }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Inline Edit Form */}
                  {inlineEditId === menu._id && (
                    <div style={{ padding: '20px', borderTop: '1px solid var(--border)', background: '#fff' }}>

                      {/* Cutoff Time */}
                      <div className="inp-wrap" style={{ marginBottom: '16px' }}>
                        <div className="inp-label">Cutoff Time (24hr)</div>
                        <input
                          className="inp-field"
                          type="time"
                          value={inlineFormData.cutoffTime}
                          onChange={(e) => setInlineFormData({ ...inlineFormData, cutoffTime: e.target.value })}
                          min={getCurrentTime()}
                          max={menu.mealType === 'lunch' ? '13:00' : '20:00'}
                          required
                        />
                      </div>

                      {/* Dishes */}
                      {inlineFormData.dishes?.map((dish, index) => (
                        <div key={index} className="dish-card">
                          <div className="dish-card-header">
                            <div className="dish-card-title">Dish {index + 1}</div>
                            {inlineFormData.dishes.length > 1 && (
                              <button type="button" className="dish-remove-btn" onClick={() => handleInlineRemoveDish(index)}>
                                Remove
                              </button>
                            )}
                          </div>

                          {/* Photo Picker */}
                          <div style={{ marginBottom: "14px" }}>
                            <div className="inp-label" style={{ marginBottom: "8px" }}>Photo</div>
                            {dish.photo ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <img src={dish.photo} alt="dish" style={{ width: "64px", height: "64px", borderRadius: "10px", objectFit: "cover" }} />
                                <button
                                  type="button"
                                  onClick={() => setInlinePhotoPicker(inlinePhotoPicker === index ? null : index)}
                                  style={{ fontSize: "12px", color: "var(--brand)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}
                                >
                                  Change Photo
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setInlinePhotoPicker(inlinePhotoPicker === index ? null : index)}
                                style={{ padding: "8px 16px", borderRadius: "8px", border: "1.5px dashed var(--border)", background: "#fafafa", fontSize: "13px", color: "var(--subtle)", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 500 }}
                              >
                                + Pick a photo
                              </button>
                            )}
                            {inlinePhotoPicker === index && (
                              <div style={{ marginTop: "12px" }}>
                                <div className="photo-picker-grid">
                                  {stockPhotos.map((p, pi) => (
                                    <div key={pi}>
                                      <div
                                        className={`photo-picker-item ${dish.photo === p.url ? "selected" : ""}`}
                                        onClick={() => handleInlineSelectPhoto(index, p.url)}
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
                            <input className="inp-field" type="text" value={dish.name}
                              onChange={(e) => handleInlineDishChange(index, "name", e.target.value)}
                              placeholder="e.g. Dal Tadka" required />
                          </div>

                          <div className="inp-wrap">
                            <div className="inp-label">Description <span style={{ textTransform: "none", fontWeight: 400 }}>(optional)</span></div>
                            <input className="inp-field" type="text" value={dish.description}
                              onChange={(e) => handleInlineDishChange(index, "description", e.target.value)}
                              placeholder="e.g. Homemade dal with tadka" />
                          </div>

                          <div className="inp-row">
                            <div className="inp-wrap">
                              <div className="inp-label">Price (₹)</div>
                              <input className="inp-field" type="number" value={dish.price}
                                onChange={(e) => handleInlineDishChange(index, "price", e.target.value)}
                                placeholder="80" required min="1" />
                            </div>
                            <div className="inp-wrap">
                              <div className="inp-label">Max Portions</div>
                              <input className="inp-field" type="number" value={dish.maxPortions}
                                onChange={(e) => handleInlineDishChange(index, "maxPortions", e.target.value)}
                                placeholder="10" required min="1" />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button type="button" className="add-dish-btn" onClick={handleInlineAddDish}>
                        + Add Another Dish
                      </button>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                        <button
                          onClick={() => handleInlineSubmit(menu._id)}
                          className="auth-btn"
                          disabled={inlineLoading}
                          style={{ flex: 1 }}
                        >
                          {inlineLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => setInlineEditId(null)}
                          style={{
                            padding: '12px 20px', borderRadius: '10px', border: '1.5px solid var(--border)',
                            background: 'white', color: 'var(--ink)', fontSize: '14px',
                            fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Post New Menu Form */}
        <form noValidate onSubmit={handleSubmit}>
          <div className="table-card" style={{ marginBottom: "20px" }}>
            <div className="table-card-header">
              <div className="table-card-title">Menu Details</div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div className="inp-row">
                <div style={{ flex: 1 }}>
                  <div className="inp-label" style={{ marginBottom: "8px" }}>Meal Type</div>
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
                          flex: 1, padding: "10px", borderRadius: "10px",
                          border: mealType === type ? "2px solid var(--brand)" : "1.5px solid var(--border)",
                          background: mealType === type ? "var(--brand-light)" : "var(--white)",
                          color: mealType === type ? "var(--brand)" : "var(--subtle)",
                          fontWeight: 600, fontSize: "13px", cursor: "pointer",
                          fontFamily: "var(--font-body)", textTransform: "capitalize",
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
                      min={getCurrentTime()}
                      max={mealType === 'lunch' ? '13:00' : '20:00'}
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
                      <button type="button" className="dish-remove-btn" onClick={() => handleRemoveDish(index)}>
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Photo Picker */}
                  <div style={{ marginBottom: "14px" }}>
                    <div className="inp-label" style={{ marginBottom: "8px" }}>Photo</div>
                    {dish.photo ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img src={dish.photo} alt="dish" style={{ width: "64px", height: "64px", borderRadius: "10px", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => setShowPhotoPicker(showPhotoPicker === index ? null : index)}
                          style={{ fontSize: "12px", color: "var(--brand)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}
                        >
                          Change Photo
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowPhotoPicker(showPhotoPicker === index ? null : index)}
                        style={{ padding: "8px 16px", borderRadius: "8px", border: "1.5px dashed var(--border)", background: "#fafafa", fontSize: "13px", color: "var(--subtle)", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 500 }}
                      >
                        + Pick a photo
                      </button>
                    )}
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
                    <input className="inp-field" type="text" value={dish.name}
                      onChange={(e) => handleDishChange(index, "name", e.target.value)}
                      placeholder="e.g. Dal Tadka" required />
                  </div>

                  <div className="inp-wrap">
                    <div className="inp-label">
                      Description <span style={{ textTransform: "none", fontWeight: 400 }}>(optional)</span>
                    </div>
                    <input className="inp-field" type="text" value={dish.description}
                      onChange={(e) => handleDishChange(index, "description", e.target.value)}
                      placeholder="e.g. Homemade dal with tadka" />
                  </div>

                  <div className="inp-row">
                    <div className="inp-wrap">
                      <div className="inp-label">Price (₹)</div>
                      <input className="inp-field" type="number" value={dish.price}
                        onChange={(e) => handleDishChange(index, "price", e.target.value)}
                        placeholder="80" required min="1" />
                    </div>
                    <div className="inp-wrap">
                      <div className="inp-label">Max Portions</div>
                      <input className="inp-field" type="number" value={dish.maxPortions}
                        onChange={(e) => handleDishChange(index, "maxPortions", e.target.value)}
                        placeholder="10" required min="1" />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" className="add-dish-btn" onClick={handleAddDish}>
                + Add Another Dish
              </button>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Saving..." : `Post ${mealType === "lunch" ? "Lunch" : "Dinner"} Menu`}
          </button>
        </form>
      </div>

      {confirmDeleteMenuId && (
        <ConfirmDialog
          message="Are you sure you want to delete this menu?"
          confirmLabel="Delete"
          confirmColor="#DC2626"
          onConfirm={handleDeleteMenu}
          onCancel={() => setConfirmDeleteMenuId(null)}
        />
      )}
    </div>
  );
}

export default PostMenu;