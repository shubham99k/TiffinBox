import { useState } from "react";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";


const sections = [
  { id: "definitions", label: "Definitions" },
  { id: "obligations", label: "User Obligations" },
  { id: "payments", label: "Payments" },
  { id: "cancellations", label: "Cancellations" },
  { id: "liability", label: "Limitation of Liability" },
];

function TermsAndConditions() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("definitions");

  const handleNavClick = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ background: "var(--surface)", minHeight: "100vh", color: "var(--on-surface)" }}>

      {/* ── NAVBAR ── */}
      {/* ── Top Navigation Bar ── */}
      <nav className="dashboard-navbar">
        <div className="dashboard-navbar-brand" style={{ cursor: 'pointer' }}
          onClick={() => navigate("/")}>
          TiffinBox <span className="auth-brand-dot" style={{ display: 'inline-block' }}></span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-['Manrope'] font-semibold">
          <span onClick={() => navigate("/")} style={{ cursor: 'pointer', opacity: 0.7 }}>Home</span>
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
      <main style={{ paddingTop: "128px", paddingBottom: "96px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px" }}>

          {/* ── HEADER ── */}
          <header style={{
            marginBottom: "64px",
            paddingBottom: "48px",
            borderBottom: "1px solid var(--surface-container-high)",
          }}>
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

            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>gavel</span>
              Transparency in T&C
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
                fontWeight: 900,
                color: "var(--primary-container)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: 0,
              }}>
                Terms and Conditions
              </h1>
            </div>
            <p style={{
              color: "var(--on-surface-variant)",
              fontSize: "1rem",
              lineHeight: 1.75,
              maxWidth: "600px",
            }}>
              Last Updated: June 15, 2024. These terms govern your use of TiffinBox's platform and services. Please read them carefully.
            </p>
          </header>

          {/* ── GRID ── */}
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "48px", alignItems: "start" }}>

            {/* ── SIDEBAR ── */}
            <aside style={{ position: "sticky", top: "96px" }}>
              <div style={{ position: "sticky", top: "96px" }}>
                <p className="inp-label" style={{ marginBottom: "16px" }}>Contents</p>

                {/* Left border track */}
                <nav style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  borderLeft: "2px solid var(--surface-container-high)",
                }}>
                  {sections.map(({ id, label }) => {
                    const isActive = activeSection === id;
                    return (
                      <button
                        key={id}
                        onClick={() => handleNavClick(id)}
                        style={{
                          paddingLeft: "16px",
                          paddingTop: "8px",
                          paddingBottom: "8px",
                          border: "none",
                          borderLeft: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                          marginLeft: "-2px",
                          background: "transparent",
                          cursor: "pointer",
                          fontFamily: "var(--font-body)",
                          fontSize: "0.875rem",
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "var(--primary)" : "var(--on-surface-variant)",
                          textAlign: "left",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "var(--primary)"; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "var(--on-surface-variant)"; }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* ── DOCUMENT BODY ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>

              {/* 1. Definitions */}
              <section id="definitions" style={{ scrollMarginTop: "96px" }}>
                <SectionHeading icon="description" number="1." title="Definitions" />
                <div className="table-card" style={{ padding: "32px" }}>
                  <p style={{ color: "var(--on-surface-variant)", lineHeight: 1.75, marginBottom: "24px", fontSize: "0.9375rem" }}>
                    In these Terms and Conditions, the following words have specific meanings:
                  </p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "20px", listStyle: "none", padding: 0 }}>
                    {[
                      { term: '"Company"', def: 'Refers to TiffinBox, its subsidiaries, and affiliates.' },
                      { term: '"Service"', def: 'Refers to the platform, website, and digital products provided by the Company.' },
                      { term: '"User"', def: 'Any individual or entity who accesses or uses the Service.' },
                    ].map(({ term, def }) => (
                      <li key={term} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                        <strong style={{
                          minWidth: "110px",
                          color: "var(--primary-container)",
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "0.875rem",
                          flexShrink: 0,
                          paddingTop: "1px",
                        }}>
                          {term}
                        </strong>
                        <span style={{ color: "var(--on-surface-variant)", fontSize: "0.9375rem", lineHeight: 1.65 }}>
                          {def}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* 2. User Obligations */}
              <section id="obligations" style={{ scrollMarginTop: "96px" }}>
                <SectionHeading icon="person_check" number="2." title="User Obligations" />
                <p style={{ color: "var(--on-surface-variant)", fontSize: "0.9375rem", lineHeight: 1.75, marginBottom: "20px" }}>
                  By using the Service, you agree to:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[
                    { title: "Account Security", body: "Maintain the confidentiality of your account credentials and notify us immediately of any breach." },
                    { title: "Lawful Use", body: "Use the service only for lawful purposes and in accordance with all local and international laws." },
                    { title: "Content Integrity", body: "Ensure all information provided is accurate, current, and does not infringe on third-party rights." },
                    { title: "Prohibited Conduct", body: "Refrain from any activities that could damage, disable, or overburden the digital infrastructure." },
                  ].map(({ title, body }) => (
                    <div
                      key={title}
                      style={{
                        padding: "20px 22px",
                        background: "var(--surface-container-lowest)",
                        borderRadius: "var(--radius-lg)",
                        borderTop: "3px solid var(--primary-fixed-dim)",
                        boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                      }}
                    >
                      <h4 style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        color: "var(--primary-container)",
                        marginBottom: "8px",
                        fontSize: "0.9rem",
                      }}>
                        {title}
                      </h4>
                      <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.65 }}>
                        {body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. Payments */}
              <section id="payments" style={{ scrollMarginTop: "96px" }}>
                <SectionHeading icon="payments" number="3." title="Payments" />
                {/* Left accent bar card — per DESIGN.md: 4px vertical bar instead of lines */}
                <div style={{
                  background: "var(--surface-container-lowest)",
                  borderLeft: "4px solid var(--primary)",
                  borderRadius: "0 var(--radius-lg) var(--radius-lg) 0",
                  padding: "32px",
                  boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                }}>
                  <p style={{ color: "var(--on-surface-variant)", lineHeight: 1.75, fontSize: "0.9375rem", marginBottom: "24px" }}>
                    Access to certain features of the Service requires the payment of fees. You agree to pay all fees in accordance with the pricing and payment terms presented to you at the time of purchase.
                  </p>
                  {/* Info callout */}
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    padding: "20px",
                    background: "var(--surface-container-low)",
                    borderRadius: "var(--radius-lg)",
                  }}>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "22px", color: "var(--primary)", flexShrink: 0, marginTop: "2px" }}
                    >
                      verified
                    </span>
                    <div>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--on-surface)", marginBottom: "4px", fontSize: "0.9375rem" }}>
                        Automatic Renewals
                      </p>
                      <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.65 }}>
                        Subscriptions auto-renew at the end of each billing cycle unless cancelled at least 24 hours prior.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Cancellations */}
              <section id="cancellations" style={{ scrollMarginTop: "96px" }}>
                <SectionHeading icon="event_busy" number="4." title="Cancellations" />
                <div className="table-card" style={{ padding: "32px" }}>
                  <p style={{ color: "var(--on-surface-variant)", lineHeight: 1.75, fontSize: "0.9375rem", marginBottom: "28px" }}>
                    Users may cancel their subscriptions at any time via the Account Settings dashboard. Upon cancellation, access to premium features will continue until the end of the current billing period.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div style={{
                      padding: "24px",
                      background: "var(--surface-container-lowest)",
                      borderRadius: "var(--radius-lg)",
                      borderTop: "3px solid var(--error)",
                      boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                    }}>
                      <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--error)", marginBottom: "8px", fontSize: "0.9rem" }}>
                        Refund Policy
                      </h4>
                      <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.65 }}>
                        Refunds are granted on a case-by-case basis and only within the first 7 days of the initial purchase.
                      </p>
                    </div>
                    <div style={{
                      padding: "24px",
                      background: "var(--surface-container-lowest)",
                      borderRadius: "var(--radius-lg)",
                      borderTop: "3px solid var(--surface-container-high)",
                      boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                    }}>
                      <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--on-surface)", marginBottom: "8px", fontSize: "0.9rem" }}>
                        Termination
                      </h4>
                      <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.65 }}>
                        The Company reserves the right to terminate accounts that violate these Terms without prior notice.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Limitation of Liability */}
              <section id="liability" style={{ scrollMarginTop: "96px" }}>
                <SectionHeading icon="security" number="5." title="Limitation of Liability" />
                {/* Dark disclaimer block */}
                <div style={{
                  background: "var(--on-surface)",
                  color: "var(--surface)",
                  padding: "40px",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "0 8px 32px rgba(20,27,43,0.18)",
                }}>
                  <p style={{
                    fontSize: "0.6875rem",
                    fontFamily: "monospace",
                    opacity: 0.55,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "20px",
                  }}>
                    Legal Disclaimer
                  </p>
                  <p style={{ lineHeight: 1.8, fontStyle: "italic", marginBottom: "20px", fontSize: "0.9375rem", opacity: 0.88 }}>
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, TIFFINBOX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
                  </p>
                  <p style={{ lineHeight: 1.8, fontSize: "0.9375rem", opacity: 0.75 }}>
                    Our total liability for any claim arising out of these terms shall not exceed the amount paid by you to the Company in the twelve months preceding the event giving rise to the claim.
                  </p>
                </div>
              </section>

              {/* ── CONTACT CTA ── */}
              <div style={{
                background: "var(--surface-container-high)",
                padding: "40px",
                borderRadius: "var(--radius-lg)",
                textAlign: "center",
                borderTop: "4px solid var(--primary)",
              }}>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  color: "var(--on-surface)",
                  letterSpacing: "-0.02em",
                  marginBottom: "10px",
                }}>
                  Questions about our Terms?
                </h3>
                <p style={{ color: "var(--on-surface-variant)", fontSize: "0.9375rem", lineHeight: 1.65, marginBottom: "28px" }}>
                  Our legal team is here to help you understand your rights and obligations.
                </p>
                <a
                  href="mailto:legal@tiffinbox.in"
                  className="auth-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "auto",
                    padding: "12px 32px",
                    margin: 0,
                    textDecoration: "none",
                    fontSize: "0.9375rem",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>mail</span>
                  Contact Legal Team
                </a>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <Footer />

    </div>
  );
}

/* ── Section heading with icon badge ── */
function SectionHeading({ icon, number, title }) {
  return (
    <h2 style={{
      fontFamily: "var(--font-display)",
      fontSize: "1.5rem",
      fontWeight: 900,
      color: "var(--on-surface)",
      letterSpacing: "-0.02em",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "24px",
    }}>
      {/* Icon badge */}
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        background: "var(--primary)",
        borderRadius: "var(--radius-md)",
        flexShrink: 0,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--primary-fixed)" }}>
          {icon}
        </span>
      </span>
      <span style={{ color: "var(--on-surface-variant)", fontWeight: 400, marginRight: "4px" }}>{number}</span>
      {title}
    </h2>
  );
}

export default TermsAndConditions;