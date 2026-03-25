import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { validateRegister } from "../../utils/validate";
import { ArrowLeft, ShoppingBag, ChefHat, Star } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    city: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateRegister(formData);
    if (validationError) return setError(validationError);
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.post("/auth/register", formData);
      localStorage.setItem("verifyEmail", data.email);
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      {/* ── LEFT ── */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <span className="auth-back" onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ArrowLeft size={16} /> Back to website
          </span>

          <div className="auth-page-title">
            Create your
            <br />
            <span>TiffinBox</span>
            <br />
            account.
          </div>
          <p className="auth-page-sub">Join thousands of food lovers today.</p>

          {/* Role Selector */}
          <div style={{ marginBottom: "20px" }}>
            <div className="inp-label" style={{ marginBottom: "10px" }}>
              I want to
            </div>
            <div className="role-cards">
              {/* Customer */}
              <div
                className={`role-card ${formData.role === "customer" ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, role: "customer" })}
              >
                <div className="role-card-icon customer"><ShoppingBag size={24} /></div>
                <div className="role-card-text">
                  <div className="role-card-title">Order Food</div>
                  <div className="role-card-desc">
                    Browse home cooks and pre-order fresh meals.
                  </div>
                </div>
                <div className="role-card-radio">
                  {formData.role === "customer" && (
                    <div className="role-card-radio-dot" />
                  )}
                </div>
              </div>

              {/* Cook */}
              <div
                className={`role-card ${formData.role === "cook" ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, role: "cook" })}
              >
                <div className="role-card-icon cook"><ChefHat size={24} /></div>
                <div className="role-card-text">
                  <div className="role-card-title">Sell Food</div>
                  <div className="role-card-desc">
                    Post your daily menu and earn from your kitchen.
                  </div>
                </div>
                <div className="role-card-radio">
                  {formData.role === "cook" && (
                    <div className="role-card-radio-dot" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {error && <div className="error-box">{error}</div>}

          <form noValidate onSubmit={handleSubmit}>
            <div className="inp-row">
              <div className="inp-wrap">
                <div className="inp-label">Full Name</div>
                <input
                  className="inp-field"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="inp-wrap">
                <div className="inp-label">City</div>
                <input
                  className="inp-field"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Vadodara"
                  required
                />
              </div>
            </div>

            <div className="inp-wrap">
              <div className="inp-label">Email Address</div>
              <input
                className="inp-field"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@gmail.com"
                required
              />
            </div>

            <div className="inp-wrap" style={{ position: "relative" }}>
              <div className="inp-label">Password</div>
              <input
                className="inp-field"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
                style={{ paddingRight: "36px" }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#9CA3AF",
                  userSelect: "none",
                }}
              >
                {showPassword ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </span>
            </div>

            <div className="inp-wrap">
              <div className="inp-label">
                Mobile Number{" "}
                <span
                  style={{
                    fontWeight: 400,
                    textTransform: "none",
                    fontSize: "10px",
                  }}
                >
                  (optional)
                </span>
              </div>
              <input
                className="inp-field"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0123456789"
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Login here</Link>
          </div>

          <div className="auth-terms">
            By creating an account you confirm you have read and accepted
            TiffinBox's <span>Terms of Service</span> and{" "}
            <span>Privacy Policy</span>.
          </div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="auth-right">
        <div className="auth-right-noise" />
        <div className="auth-right-content">
          <div className="auth-right-brand">
            <div className="auth-right-brand-text">
              <span className="auth-right-brand-name">TiffinBox</span>
            </div>
          </div>

          <div>
            <div className="auth-right-headline">
              Miss mom's
              <br />
              cooking?
              <br />
              <span className="accent">We got you.</span>
            </div>
            <p className="auth-right-body">
              Pre-order fresh homemade meals from verified home cooks in your
              city. Skip the mess, eat like home.
            </p>
          </div>

          <div className="auth-features">
            {[
              "Order 2–3 hours before mealtime",
              "Fresh food, zero wastage",
              "Home cooks earn from their kitchen",
            ].map((f, i) => (
              <div key={i} className="auth-feature-item">
                <div className="auth-feature-dot" />
                {f}
              </div>
            ))}
          </div>

          <div className="auth-stats">
            {[
              ["2K+", "Home Cooks"],
              ["50K+", "Meals Served"],
              [<span key="rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>4.8<Star size={24} fill="currentColor" /></span>, "Avg Rating"],
            ].map(([num, label], i) => (
              <div key={i}>
                <div className="auth-stat-num">{num}</div>
                <div className="auth-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
