import { useNavigate } from "react-router-dom";
import { CheckCircle2, Search, ShoppingCart, Utensils, ClipboardList, Wallet, Clock, Star } from "lucide-react";

function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        fontFamily: "Geist, sans-serif",
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      {/* ── Navbar ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #F3F4F6",
          padding: "0 40px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: "25px",
            fontWeight: 800,
            color: "#000000ff",
            letterSpacing: "-1px",
            lineHeight: "1.0",
            fontFamily: "Geist"
          }}
        >
          TiffinBox
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "1.5px solid #E5E7EB",
              background: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Geist, sans-serif",
              color: "#0d0d0d",
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#7C3AED",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Geist, sans-serif",
              color: "#fff",
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          padding: "80px 40px",
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "60px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#F5F3FF",
              border: "1px solid #DDD6FE",
              borderRadius: "99px",
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#7C3AED",
              marginBottom: "24px",
            }}
          >
            <CheckCircle2 size={14} /> Now live across India
          </div>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "#0d0d0d",
              letterSpacing: "-3px",
              lineHeight: 1.0,
              marginBottom: "20px",
            }}
          >
            Taste the
            <br />
            home you
            <br />
            <span style={{ color: "#7C3AED" }}>miss.</span>
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#6B7280",
              lineHeight: 1.8,
              marginBottom: "32px",
              maxWidth: "440px",
            }}
          >
            Pre-order fresh homemade meals from verified home cooks near you.
            Skip the mess, eat like home — every single day.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "14px 32px",
                borderRadius: "10px",
                border: "none",
                background: "#7C3AED",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Geist, sans-serif",
                color: "#fff",
              }}
            >
              Order Food Now
            </button>
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "14px 32px",
                borderRadius: "10px",
                border: "1.5px solid #E5E7EB",
                background: "#fff",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Geist, sans-serif",
                color: "#0d0d0d",
              }}
            >
              Start Selling Food →
            </button>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "48px",
              flexWrap: "wrap",
            }}
          >
            {[
              ["2K+", "Home Cooks"],
              ["50K+", "Meals Served"],
              [<span key="rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>4.8<Star size={24} fill="currentColor" /></span>, "Avg Rating"],
            ].map(([num, label]) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 900,
                    color: "#0d0d0d",
                    letterSpacing: "-1px",
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#9CA3AF",
                    marginTop: "2px",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual */}
        <div
          style={{
            flex: 1,
            minWidth: "280px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "340px",
              background: "#F5F3FF",
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid #DDD6FE",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#7C3AED",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Today's Menu
            </div>
            {[
              {
                name: "Dal Tadka + Rice",
                price: 80,
                portions: 8,
                cook: "Rekha Ben",
              },
              {
                name: "Paneer Butter Masala",
                price: 120,
                portions: 5,
                cook: "Sunita Devi",
              },
              {
                name: "Chole Bhature",
                price: 90,
                portions: 3,
                cook: "Priya Shah",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#0d0d0d",
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9CA3AF",
                      marginTop: "2px",
                    }}
                  >
                    by {item.cook} · {item.portions} left
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "#7C3AED",
                    }}
                  >
                    ₹{item.price}
                  </div>
                  <div
                    style={{
                      background: "#7C3AED",
                      color: "#fff",
                      borderRadius: "6px",
                      padding: "3px 10px",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    Order
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: "#9CA3AF",
                marginTop: "8px",
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Order before 10:00 AM for lunch</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ background: "#F9FAFB", padding: "80px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <h2
              style={{
                fontSize: "40px",
                fontWeight: 900,
                color: "#0d0d0d",
                letterSpacing: "-1.5px",
                marginBottom: "12px",
              }}
            >
              How it works
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "#6B7280",
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              Fresh homemade food in 3 simple steps
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              {
                step: "01",
                icon: <Search size={36} color="#7C3AED" />,
                title: "Browse home cooks",
                desc: "Discover verified home cooks near you and explore their daily menus",
              },
              {
                step: "02",
                icon: <ShoppingCart size={36} color="#7C3AED" />,
                title: "Pre-order your meal",
                desc: "Select your dish and place your order 2-3 hours before mealtime",
              },
              {
                step: "03",
                icon: <Utensils size={36} color="#7C3AED" />,
                title: "Enjoy fresh food",
                desc: "Get fresh homemade food delivered to your door — pay on delivery",
              },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "28px 24px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#7C3AED",
                    letterSpacing: "1px",
                    marginBottom: "12px",
                  }}
                >
                  STEP {item.step}
                </div>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                  {item.icon}
                </div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: 800,
                    color: "#0d0d0d",
                    letterSpacing: "-0.3px",
                    marginBottom: "8px",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#6B7280",
                    lineHeight: 1.7,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Cooks ── */}
      <section style={{ padding: "80px 40px", background: "#7C3AED" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            gap: "60px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "280px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "1px",
                marginBottom: "16px",
                textTransform: "uppercase",
              }}
            >
              For Home Cooks
            </div>
            <h2
              style={{
                fontSize: "44px",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-2px",
                lineHeight: 1.1,
                marginBottom: "16px",
              }}
            >
              Turn your kitchen
              <br />
              into <span style={{ color: "#FCD34D" }}>income.</span>
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.8,
                marginBottom: "28px",
              }}
            >
              Cook what you already cook — just make a few extra portions. Post
              your daily menu, accept orders and earn from the comfort of your
              home.
            </p>
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "14px 32px",
                borderRadius: "10px",
                border: "none",
                background: "#FCD34D",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Geist, sans-serif",
                color: "#0d0d0d",
              }}
            >
              Start Cooking for Others
            </button>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: "280px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {[
              {
                icon: <ClipboardList size={24} color="#FCD34D" />,
                title: "Post daily menu",
                desc: "Takes less than 2 minutes every morning",
              },
              {
                icon: <Wallet size={24} color="#FCD34D" />,
                title: "Earn daily income",
                desc: "Get paid for every meal you deliver",
              },
              {
                icon: <Clock size={24} color="#FCD34D" />,
                title: "You control the schedule",
                desc: "Set your own cutoff time and portion limits",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <div style={{ fontSize: "24px", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: "4px",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: "80px 40px", background: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <h2
              style={{
                fontSize: "40px",
                fontWeight: 900,
                color: "#0d0d0d",
                letterSpacing: "-1.5px",
                marginBottom: "12px",
              }}
            >
              What people say
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {[
              {
                name: "Rahul Mehta",
                role: "Software Engineer, Pune",
                review:
                  "Finally found ghar ka khana in Pune! The dal tadka from Rekha Ben tastes exactly like my mom makes it. Order every single day now.",
                rating: 5,
              },
              {
                name: "Priya Sharma",
                role: "Home Cook, Surat",
                review:
                  "I was skeptical at first but TiffinBox changed my life. I earn ₹8,000 extra every month just by cooking a few extra portions!",
                rating: 5,
              },
              {
                name: "Arjun Patel",
                role: "College Student, Ahmedabad",
                review:
                  "Way better than mess food and way cheaper than Zomato. Fresh homemade food for ₹80 is unbeatable. Highly recommend!",
                rating: 5,
              },
            ].map((item) => (
              <div
                key={item.name}
                style={{
                  background: "#F9FAFB",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div style={{ display: "flex", gap: "2px", marginBottom: "16px" }}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={16} color="#FCD34D" fill="#FCD34D" />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                    lineHeight: 1.7,
                    marginBottom: "16px",
                    fontStyle: "italic",
                  }}
                >
                  "{item.review}"
                </p>
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#0d0d0d",
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#9CA3AF",
                      marginTop: "2px",
                    }}
                  >
                    {item.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "80px 40px",
          background: "#F5F3FF",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "44px",
              fontWeight: 900,
              color: "#0d0d0d",
              letterSpacing: "-2px",
              marginBottom: "16px",
            }}
          >
            Ready to eat like
            <br />
            <span style={{ color: "#7C3AED" }}>home?</span>
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#6B7280",
              marginBottom: "32px",
              lineHeight: 1.7,
            }}
          >
            Join thousands of food lovers and home cooks already on TiffinBox.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "14px 36px",
                borderRadius: "10px",
                border: "none",
                background: "#7C3AED",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Geist, sans-serif",
                color: "#fff",
              }}
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "14px 36px",
                borderRadius: "10px",
                border: "1.5px solid #DDD6FE",
                background: "#fff",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Geist, sans-serif",
                color: "#7C3AED",
              }}
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          background: "#0d0d0d",
          padding: "32px 40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: 900,
            color: "#7C3AED",
            marginBottom: "8px",
          }}
        >
          TiffinBox
        </div>
        <div style={{ fontSize: "13px", color: "#6B7280" }}>
          © 2026 TiffinBox · Taste the home you miss.
        </div>
      </footer>
    </div>
  );
}

export default Landing;
