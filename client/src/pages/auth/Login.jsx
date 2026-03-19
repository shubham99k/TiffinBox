import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import axiosInstance from "../../utils/axiosInstance";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.post("/auth/login", formData);
      dispatch(setCredentials({ token: data.token, user: data.user }));

      if (data.user.role === "admin") navigate("/admin/dashboard");

      else if (data.user.role === "cook") navigate("/cook/dashboard");

      else navigate("/home");
      
    } catch (err) {
      if (err.response?.data?.isVerified === false) {
        localStorage.setItem("verifyEmail", err.response.data.email);
        navigate("/verify-otp");
        return
      }
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
          <div className="auth-brand">
            <span className="auth-brand-dot" />
            TiffinBox
          </div>

          <div className="auth-page-title">
            Welcome
            <br />
            back.
          </div>

          <p className="auth-page-sub">Login to your TiffinBox account.</p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
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

            <div className="inp-wrap">
              <div className="inp-label">Password</div>
              <input
                className="inp-field"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="auth-forgot">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="auth-right">
        <div className="auth-right-content">
          <div className="auth-right-brand">
            <div className="auth-right-brand-text">
              <span className="auth-right-brand-name">TiffinBox</span>
            </div>
          </div>

          <div>
            <div className="auth-right-headline">
              Taste the
              <br />
              home
              <br />
              <span className="accent">you miss.</span>
            </div>
            <p className="auth-right-body">
              Fresh homemade meals from verified home cooks in your city.
              Pre-order before cutoff and eat like home.
            </p>
          </div>

          <div className="auth-stats">
            {[
              ["2K+", "Home Cooks"],
              ["50K+", "Meals Served"],
              ["4.8★", "Avg Rating"],
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

export default Login;
