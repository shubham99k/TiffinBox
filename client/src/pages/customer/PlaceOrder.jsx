import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Alert from "../../components/Alert";
import { validateOrder } from "../../utils/validate";
import { ArrowLeft, Banknote } from "lucide-react";

function PlaceOrder() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { menuId, dishIndex, dish } = state || {};

  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalAmount = dish?.price * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateOrder(deliveryAddress);
    if (validationError) return setError(validationError);
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/orders", {
        menuId,
        dishIndex,
        quantity,
        deliveryAddress,
      });
      setSuccess("Order placed successfully!");
      setTimeout(() => navigate("/orders/my"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-wrap">
      <div className="setup-card">
        <div className="auth-back" onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ArrowLeft size={16} /> Back
        </div>

        <div className="setup-title" style={{ marginTop: "12px" }}>
          Place Order
        </div>
        <div className="setup-sub">Review your order and confirm</div>

        {/* Order Summary */}
        <div
          style={{
            background: "#fafafa",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {dish?.photo && (
              <img
                src={dish.photo}
                alt={dish.name}
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "10px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            )}
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--ink)",
                }}
              >
                {dish?.name}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--brand)",
                  fontWeight: 600,
                  marginTop: "2px",
                }}
              >
                ₹{dish?.price} per portion
              </div>
            </div>
          </div>
        </div>

        <Alert type="error" message={error} onClose={() => setError("")} />
        <Alert type="success" message={success} onClose={() => setSuccess("")} />

        <form noValidate onSubmit={handleSubmit}>
          {/* Quantity */}
          <div style={{ marginBottom: "16px" }}>
            <div className="inp-label" style={{ marginBottom: "8px" }}>
              Quantity
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1.5px solid var(--border)",
                  background: "var(--white)",
                  fontSize: "18px",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                }}
              >
                -
              </button>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  minWidth: "24px",
                  textAlign: "center",
                }}
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1.5px solid var(--border)",
                  background: "var(--white)",
                  fontSize: "18px",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                }}
              >
                +
              </button>
              <span
                style={{
                  fontSize: "14px",
                  color: "var(--muted)",
                  marginLeft: "8px",
                }}
              >
                Total:{" "}
                <strong style={{ color: "var(--brand)" }}>
                  ₹{totalAmount}
                </strong>
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="inp-wrap">
            <div className="inp-label">Delivery Address</div>
            <input
              className="inp-field"
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your full delivery address"
              required
            />
          </div>

          {/* COD Note */}
          <div
            style={{
              background: "#FEF3C7",
              border: "1px solid #FDE68A",
              borderRadius: "10px",
              padding: "12px 14px",
              marginBottom: "16px",
              fontSize: "13px",
              color: "#92400E",
              fontWeight: 500,
            }}
          >
            <Banknote size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: '6px' }} /> Cash on Delivery — Pay when food arrives
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Placing order..." : `Place Order • ₹${totalAmount}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PlaceOrder;
