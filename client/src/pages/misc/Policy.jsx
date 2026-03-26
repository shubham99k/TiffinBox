import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

const sections = [
  { id: "introduction", icon: "auto_awesome", label: "Introduction" },
  { id: "data-collection", icon: "inventory_2", label: "Data Collection" },
  { id: "how-we-use-data", icon: "monitoring", label: "How We Use Data" },
  { id: "security", icon: "shield_lock", label: "Security" },
  { id: "contact", icon: "alternate_email", label: "Contact" },
];

function Policy() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("introduction");

  const handleNavClick = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ background: "var(--surface)", minHeight: "100vh", color: "var(--on-surface)" }}>

      {/* ── NAVBAR ── */}
      {/* ── Top Navigation Bar ── */}
      <nav className="dashboard-navbar">
        <div className="dashboard-navbar-brand"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate("/")}>
          TiffinBox <span className="auth-brand-dot" style={{ display: 'inline-block' }}></span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-['Manrope'] font-semibold">
          <span onClick={() => navigate("/")} style={{ cursor: 'pointer', opacity: 0.7, textUnderlineOffset: '8px' }}>Home</span>
          <span onClick={() => navigate("/how-it-works")} style={{ cursor: 'pointer', opacity: 0.7 }}>How it works</span>
          <span onClick={() => navigate("/register")} style={{ cursor: 'pointer', opacity: 0.7 }}>Join as Cook</span>
        </div>
        <div className="dashboard-navbar-right">
          <button onClick={() => navigate("/login")} className="dashboard-navbar-user" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            Login
          </button>
          <button onClick={() => navigate("/register")} className="dashboard-navbar-btn">
            Sign Up
          </button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ paddingTop: "50px", paddingBottom: "80px", maxWidth: "1100px", margin: "0 auto", padding: "112px 40px 80px" }}>

        {/* ── HEADER ── */}
        <header style={{ marginBottom: "64px" }}>
          {/* Legal chip */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 14px",
            borderRadius: "var(--radius-pill)",
            background: "var(--primary-fixed)",
            color: "var(--primary-container)",
            fontSize: "0.6875rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            marginBottom: "16px",
            marginTop: "16px",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>verified_user</span>
            Legal Transparency
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
            fontWeight: 900,
            color: "var(--primary-container)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            marginBottom: "16px",
          }}>
            Privacy Policy
          </h1>
          <p style={{ color: "var(--on-surface-variant)", maxWidth: "600px", fontSize: "1rem", lineHeight: 1.75 }}>
            Last updated: March 25, 2026. At TiffinBox, your privacy is our most precious asset. We transmute complex data handling into clear, simple promises.
          </p>
        </header>

        {/* ── GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "48px", alignItems: "start" }}>

          {/* ── SIDEBAR ── */}
          <aside style={{ position: 'sticky', top: '96px' }}>
            <div style={{ position: "sticky", top: "96px" }}>
              <p className="inp-label" style={{ marginBottom: "16px", paddingLeft: "16px" }}>Sections</p>

              <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {sections.map(({ id, icon, label }) => {
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleNavClick(id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        borderRadius: "var(--radius-lg)",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.875rem",
                        fontWeight: isActive ? 700 : 500,
                        textAlign: "left",
                        transition: "all 0.2s",
                        color: isActive ? "var(--primary-container)" : "var(--on-surface-variant)",
                        background: isActive ? "var(--primary-fixed)" : "transparent",
                        borderLeft: isActive ? "3px solid var(--primary)" : "3px solid transparent",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{icon}</span>
                      {label}
                    </button>
                  );
                })}
              </nav>

              {/* Help card */}
              <div style={{
                marginTop: "32px",
                padding: "24px",
                borderRadius: "var(--radius-lg)",
                background: "var(--primary-fixed-dim)",
                color: "var(--primary-container)",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9375rem", marginBottom: "8px" }}>
                    Need Clarity?
                  </p>
                  <p style={{ fontSize: "0.8125rem", lineHeight: 1.65, opacity: 0.85 }}>
                    Our legal team is available to explain any of these terms in plain English.
                  </p>
                  <button style={{
                    marginTop: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: "var(--primary-container)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "var(--font-display)",
                  }}>
                    Learn more
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                  </button>
                </div>
                {/* decorative bg icon */}
                <span className="material-symbols-outlined" style={{
                  position: "absolute",
                  right: "-12px",
                  bottom: "-12px",
                  fontSize: "80px",
                  opacity: 0.1,
                  pointerEvents: "none",
                }}>
                  gavel
                </span>
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>

            {/* SECTION HEADER HELPER */}
            {/* Introduction */}
            <section id="introduction" style={{ scrollMarginTop: "96px" }}>
              <SectionHeader icon="auto_awesome" title="Introduction" />
              <div style={{ color: "var(--on-surface-variant)", lineHeight: 1.75, fontSize: "1rem" }}>
                <p style={{ marginBottom: "16px" }}>
                  Welcome to <strong style={{ color: "var(--on-surface)", fontWeight: 700 }}>TiffinBox</strong>. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our platform. We are committed to protecting your personal data and your right to privacy.
                </p>
                <p style={{ marginBottom: "24px" }}>
                  If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us. When you visit our website and more generally, use any of our services, we appreciate that you are trusting us with your personal information.
                </p>
                {/* Quote block */}
                <div style={{
                  background: "var(--surface-container-lowest)",
                  padding: "24px 28px",
                  borderRadius: "var(--radius-lg)",
                  borderLeft: "4px solid var(--primary)",
                  fontStyle: "italic",
                  fontSize: "0.9375rem",
                  color: "var(--on-surface-variant)",
                  boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                }}>
                  "We view data as the raw material for insight, never for exploitation. Our alchemy respects the source."
                </div>
              </div>
            </section>

            {/* Data Collection */}
            <section id="data-collection" style={{ scrollMarginTop: "96px" }}>
              <SectionHeader icon="inventory_2" title="Data Collection" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
                <DataCard
                  icon="person"
                  title="Direct Information"
                  description="Information you provide directly to us through forms, registration, and communication channels."
                  items={["Name and Contact Details", "Payment Credentials", "User Communications"]}
                />
                <DataCard
                  icon="bolt"
                  title="Automated Data"
                  description="Information collected automatically through cookies and similar tracking technologies."
                  items={["IP Addresses & Log Data", "Device Fingerprinting", "Usage Patterns"]}
                />
              </div>
            </section>

            {/* Visual Break */}
            <section style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", height: "240px", position: "relative" }}>
              <img
                src="https://plus.unsplash.com/premium_photo-1669244777314-682992ab3619?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHdvcmxkJTIwbWFwfGVufDB8fDB8fHww"
                alt="Data security visual"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(60%)" }}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(6,78,59,0.85), rgba(0,100,122,0.6))",
                display: "flex",
                alignItems: "center",
                padding: "0 48px",
              }}>
                <div style={{ maxWidth: "400px" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "1.5rem", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "8px" }}>
                    Transmuting Trust
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                    Every byte of data we collect is encrypted using military-grade standards before it even leaves your device.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Data */}
            <section id="how-we-use-data" style={{ scrollMarginTop: "96px" }}>
              <SectionHeader icon="psychology" title="How We Use Data" />
              <div className="table-card" style={{ padding: "32px" }}>
                {[
                  { num: "01", title: "Service Provision", desc: "To facilitate account creation and the logon process, and to manage user accounts efficiently across our digital ecosystem." },
                  { num: "02", title: "Personalization", desc: "To deliver personalized content and recommendations that match your preferences and previous interactions." },
                  { num: "03", title: "Analytics & Improvement", desc: "To monitor usage patterns and improve our platform's user experience through iterative testing and feedback loops." },
                ].map(({ num, title, desc }, i, arr) => (
                  <div
                    key={num}
                    style={{
                      display: "flex",
                      gap: "24px",
                      paddingBottom: i < arr.length - 1 ? "24px" : 0,
                      marginBottom: i < arr.length - 1 ? "24px" : 0,
                      borderBottom: i < arr.length - 1 ? "1px solid var(--surface-container-high)" : "none",
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "var(--primary-fixed-dim)",
                      lineHeight: 1,
                      flexShrink: 0,
                      width: "48px",
                    }}>
                      {num}
                    </span>
                    <div>
                      <h5 style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--on-surface)", marginBottom: "6px", fontSize: "0.9375rem" }}>
                        {title}
                      </h5>
                      <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.7 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Security */}
            <section id="security" style={{ scrollMarginTop: "96px" }}>
              <SectionHeader icon="shield_lock" title="Security" />
              <p style={{ color: "var(--on-surface-variant)", lineHeight: 1.75, marginBottom: "32px", fontSize: "1rem" }}>
                We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                {[
                  { icon: "enhanced_encryption", label: "AES-256 Bit Encryption" },
                  { icon: "admin_panel_settings", label: "ISO 27001 Certified" },
                  { icon: "fact_check", label: "Regular Audits" },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="stat-card"
                    style={{ textAlign: "center", borderBottom: "3px solid var(--primary)", padding: "24px 16px" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "var(--primary)", display: "block", marginBottom: "10px" }}>
                      {icon}
                    </span>
                    <p className="stat-card-label" style={{ margin: 0 }}>{label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section id="contact" style={{ scrollMarginTop: "96px" }}>
              <SectionHeader icon="alternate_email" title="Contact" />
              <div style={{
                padding: "40px",
                borderRadius: "var(--radius-lg)",
                background: "var(--cta-gradient)",
                display: "flex",
                flexWrap: "wrap",
                gap: "32px",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div style={{ maxWidth: "420px" }}>
                  <h4 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "1.5rem", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "10px" }}>
                    Still have questions?
                  </h4>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                    Our dedicated privacy officer is ready to assist you with any inquiries regarding your personal data and rights.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
                  <a
                    href="mailto:privacy@tiffinbox.in"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "#fff",
                      color: "var(--primary-container)",
                      padding: "12px 28px",
                      borderRadius: "var(--radius-lg)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "0.9375rem",
                      textDecoration: "none",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>send</span>
                    Email Our DPO
                  </a>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", textAlign: "center" }}>
                    Response time: within 48 hours
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <Footer />

    </div>
  );
}

/* ── Reusable section header ── */
function SectionHeader({ icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface-container-high)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--primary)",
        flexShrink: 0,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>{icon}</span>
      </div>
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.75rem",
        fontWeight: 900,
        color: "var(--on-surface)",
        letterSpacing: "-0.02em",
        margin: 0,
      }}>
        {title}
      </h2>
    </div>
  );
}

/* ── Data collection card ── */
function DataCard({ icon, title, description, items }) {
  return (
    <div className="stat-card" style={{ padding: "28px" }}>
      <h4 style={{
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        color: "var(--primary-container)",
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "0.9375rem",
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--primary)" }}>{icon}</span>
        {title}
      </h4>
      <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.65, marginBottom: "16px" }}>
        {description}
      </p>
      <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.875rem", color: "var(--on-surface-variant)" }}>
            {/* 4px accent bar as list bullet — per DESIGN.md */}
            <span style={{ width: "4px", height: "16px", borderRadius: "var(--radius-pill)", background: "var(--primary)", flexShrink: 0 }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Policy;