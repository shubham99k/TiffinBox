import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import Alert from '../../components/Alert'
import { validateCookProfile } from "../../utils/validate";


function CookProfileSetup() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    bio: "",
    cuisineType: "",
    city: user?.city || "",
    address: "",
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateCookProfile(formData);
    if (validationError) return setError(validationError);
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("bio", formData.bio);
      form.append("cuisineType", formData.cuisineType);
      form.append("city", formData.city);
      form.append("address", formData.address);
      if (photo) form.append("photo", photo);

      await axiosInstance.post("/cook/profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Profile submitted successfully!");
      setTimeout(() => navigate("/cook/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-wrap">
      <div className="setup-card">
        <div className="setup-title">Setup your profile <span style={{color: "#ee3434ff"}}>*</span></div>
        <div className="setup-sub">
          Tell customers about yourself and your cooking
        </div>

        <Alert type="error" message={error} onClose={() => setError("")} />
        <Alert type="success" message={success} onClose={() => setSuccess("")} />

        <form noValidate onSubmit={handleSubmit}>
          {/* Photo Upload */}
          <div style={{ marginBottom: "16px" }}>
            <div className="inp-label" style={{ marginBottom: "8px" }}>
              Profile Photo
            </div>
            <label htmlFor="photo" style={{ cursor: "pointer" }}>
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="photo-upload-preview"
                />
              ) : (
                <div className="photo-upload">
                  <div className="photo-upload-text">Click to upload photo</div>
                  <div className="photo-upload-hint">JPG, PNG up to 5MB</div>
                </div>
              )}
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              style={{ display: "none" }}
            />
          </div>

          <div className="inp-wrap">
            <div className="inp-label">Bio</div>
            <textarea
              className="inp-field"
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell customers about your cooking..."
              required
            />
          </div>

          <div className="inp-wrap">
            <div className="inp-label">Cuisine Type</div>
            <input
              className="inp-field"
              type="text"
              name="cuisineType"
              value={formData.cuisineType}
              onChange={handleChange}
              placeholder="e.g. Gujarati, Punjabi, South Indian"
              required
            />
          </div>

          <div className="inp-row">
            <div className="inp-wrap">
              <div className="inp-label">City</div>
              <input
                className="inp-field"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Surat"
                required
              />
            </div>
            <div className="inp-wrap">
              <div className="inp-label">Address</div>
              <input
                className="inp-field"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your full address"
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit for Approval"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CookProfileSetup;
