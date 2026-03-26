import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import {
  Search,
  ShoppingCart,
  Truck,
  Utensils,
  CookingPot,
  TrendingUp,
  Wallet,
} from 'lucide-react';

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrap">

      {/* ── Top Navigation Bar ── */}
      <nav className="dashboard-navbar">
        <div className="dashboard-navbar-brand"
        style={{ cursor: 'pointer'}}
        onClick={() => navigate("/")}>
          TiffinBox <span className="auth-brand-dot" style={{ display: 'inline-block' }}></span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-['Manrope'] font-semibold">
          <span onClick={() => navigate("/")} style={{ cursor: 'pointer', opacity: 0.7 }}>Home</span>
          <span onClick={() => navigate("/how-it-works")} style={{ cursor: 'pointer', opacity: 0.7, color: 'var(--primary-container)', textDecoration: 'underline', textUnderlineOffset: '8px' }}>How it works</span>
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

      <main>

        {/* ── Hero Section ── */}
        <section
          className="dashboard-content"
          style={{
            minHeight: 'calc(100vh - 64px)', // full screen minus navbar
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'var(--space-2xl) var(--space-md)'
          }}
        >
          <h1
            className="auth-right-headline"
            style={{ color: 'var(--on-surface)', fontSize: 'clamp(3rem, 8vw, 4.5rem)' }}
          >
            How TiffinBox<br />
            <span className="auth-right-headline" style={{ color: 'var(--primary)', fontSize: 'clamp(3rem, 8vw, 4.5rem)', fontWeight: 800 }}>Works</span>
          </h1>
          <p className="auth-page-sub" style={{ margin: '0 auto', maxWidth: '42rem' }}>
            Whether you're a food lover seeking authentic flavors or a home chef ready to share
            your passion, our platform bridges the gap between kitchen and table.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '2rem',
            }}
          >
            <a
              href="#customers"
              className="auth-btn"
              style={{
                width: 'auto',
                padding: '18px 36px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Utensils size={18} /> I'm a Customer
            </a>

            <a
              href="#cooks"
              className="auth-btn"
              style={{
                padding: '18px 36px',
                width: 'auto',
                background: 'var(--surface-container-low)',
                color: 'var(--on-surface)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <CookingPot size={18} /> I'm a Home Cook
            </a>
          </div>
        </section>

        {/* ── Customer Path ── */}
        <section
          id="customers"
          style={{
            background: 'var(--surface-container-low)',
            padding: 'var(--space-xl) 40px',
            marginTop: '15re',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

            {/* Section heading */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '3rem',
                paddingTop: '5rem',
                // paddingBottom: '5rem'
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'var(--outline-variant)' }}></div>
              <h2 className="auth-right-brand" style={{ color: 'var(--on-surface)', fontSize: '1.25rem' }}>
                For Customers
              </h2>
              <div style={{ flex: 1, height: '1px', background: 'var(--outline-variant)' }}></div>
            </div>

            {/* 3-step cards */}
            <div className="stats-grid">

              <div className="table-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div
                  style={{
                    width: '4rem', height: '4rem',
                    borderRadius: '50%',
                    background: 'var(--primary-fixed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <Search size={32} />
                </div>
                <h3 className="table-card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>
                  1. Browse Local Menus
                </h3>
                <p className="auth-right-body" style={{ color: 'var(--on-surface-variant)' }}>
                  Discover talented home cooks in your neighborhood. Filter by cuisine or dietary needs.
                </p>
              </div>

              <div className="table-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div
                  style={{
                    width: '4rem', height: '4rem',
                    borderRadius: '50%',
                    background: 'var(--secondary-fixed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--secondary)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <ShoppingCart size={32} />
                </div>
                <h3 className="table-card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>
                  2. Simple Ordering
                </h3>
                <p className="auth-right-body" style={{ color: 'var(--on-surface-variant)' }}>
                  Select your dishes, specify preferences, and checkout securely with one click.
                </p>
              </div>

              <div className="table-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div
                  style={{
                    width: '4rem', height: '4rem',
                    borderRadius: '50%',
                    background: 'var(--tertiary-fixed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--tertiary)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <Truck size={32} />
                </div>
                <h3 className="table-card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>
                  3. Track &amp; Enjoy
                </h3>
                <p className="auth-right-body" style={{ color: 'var(--on-surface-variant)' }}>
                  Receive real-time updates as your meal is prepared and delivered fresh to your doorstep.
                </p>
              </div>
            </div>

            {/* Visual detail card */}
            <div
              className="stat-card"
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                padding: 0,
                overflow: 'hidden',
                marginTop: '40px',
              }}
            >
              <div style={{ flex: '1 1 400px', minHeight: '300px' }}>
                <img
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
                  alt="Quality Food"
                />
              </div>
              <div style={{ flex: '1 1 400px', padding: '40px' }}>
                <span
                  className="auth-right-note"
                  style={{ color: 'var(--primary)', fontWeight: 800 }}
                >
                  Customer Experience
                </span>
                <h4
                  className="auth-page-title"
                  style={{ fontSize: '2.25rem', marginTop: '8px' }}
                >
                  Experience Quality Firsthand
                </h4>
                <p className="auth-page-sub">
                  Our rating system ensures every meal meets high standards. Read reviews from
                  neighbors and see photos of actual meals.
                </p>
                <div className="auth-features">
                  <div className="auth-feature-item">
                    <div className="auth-feature-dot"></div>
                    <span style={{ fontWeight: 700, color: 'var(--on-surface)' }}>Verified Home Cooks</span>
                  </div>
                  <div className="auth-feature-item">
                    <div className="auth-feature-dot"></div>
                    <span style={{ fontWeight: 700, color: 'var(--on-surface)' }}>Sustainable Packaging Options</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Home Cook Path ── */}
        <section
          className="dashboard-content"
          id="cooks"
          style={{ padding: 'var(--space-xl) 40px', paddingTop: '8rem' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '3rem',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'var(--primary-fixed)' }}></div>
            <h2 className="auth-right-brand" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>
              For Home Cooks
            </h2>
            <div style={{ flex: 1, height: '1px', background: 'var(--primary-fixed)' }}></div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
            }}
          >
            {/* Steps list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {[
                { id: 'A', title: 'Register Your Kitchen', desc: 'Submit credentials and safety verification. We help you with the paperwork.' },
                { id: 'B', title: 'Post Your Menu', desc: 'Upload photos, set prices, and availability. You are in full control.' },
                { id: 'C', title: 'Manage & Grow', desc: 'Receive orders via your dashboard. Track earnings and manage inventory.' },
              ].map((step) => (
                <div key={step.id} style={{ display: 'flex', gap: '24px' }}>
                  <div
                    className="otp-box filled"
                    style={{ width: '48px', height: '48px', fontSize: '1rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {step.id}
                  </div>
                  <div>
                    <h3 className="table-card-title" style={{ fontSize: '1.25rem', marginBottom: '4px' }}>
                      {step.title}
                    </h3>
                    <p className="auth-right-body" style={{ color: 'var(--on-surface-variant)' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => navigate("/register")}
                className="auth-btn"
                style={{ width: 'fit-content', padding: '16px 40px', marginTop: '12px' }}
              >
                Apply to Cook
              </button>
            </div>

            {/* Bento visuals */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <img
                  className="stat-card"
                  style={{ padding: 0, objectFit: 'cover', height: '240px', width: '100%' }}
                  src="https://media.istockphoto.com/id/1130934413/photo/close-up-of-the-hands-of-a-male-chef-on-a-black-background-pour-sauce-from-the-spoon-on-the.webp?a=1&b=1&s=612x612&w=0&k=20&c=6aVVhLsOJrgJOX-xuvjkdHC_KcJ-hSTuBfjKo27tIYw="
                  alt="Kitchen"
                />
                <div
                  className="stat-card"
                  style={{ background: 'var(--secondary-fixed)', textAlign: 'center' }}
                >
                  <TrendingUp
                    style={{ display: 'block', margin: '0 auto 8px' }}
                    color="var(--primary-container)"
                  />
                  <div className="auth-stat-label" style={{ color: 'var(--primary-container)' }}>
                    Real-time Analytics
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '32px' }}>
                <div
                  className="stat-card"
                  style={{ background: 'var(--primary-container)', textAlign: 'center' }}
                >
                  <Wallet
                    style={{ display: 'block', margin: '0 auto 8px' }}
                    color="var(--secondary-fixed)"
                  />
                  <div className="auth-stat-label" style={{ color: 'var(--secondary-fixed)' }}>
                    Instant Payouts
                  </div>
                </div>
                <img
                  className="stat-card"
                  style={{ padding: 0, objectFit: 'cover', height: '240px', width: '100%' }}
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400"
                  alt="Fresh"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        {/* ── CTA Section ── */}
        <section className="dashboard-content">
          <div
            className="auth-right"
            style={{
              borderRadius: 'var(--radius-lg)',
              position: 'relative',
              height: 'auto',
              minHeight: '400px', // Ensures enough space for the visual effect
              padding: 'var(--space-xl) var(--space-md)',
              display: 'flex', // Flex is required for alignItems to work
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2rem',
              textAlign: 'center',
              overflow: 'hidden', // Clips the ::after pseudo-element to the radius
            }}
          >
            {/* Content Wrapper to stay above the CSS ::after gradient */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 className="auth-right-headline" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
                Ready to start your journey?
              </h2>
              <p
                className="auth-right-body"
                style={{
                  maxWidth: '600px',
                  marginBottom: 'var(--space-lg)',
                  marginInline: 'auto',
                  color: 'rgba(255,255,255,0.8)' // Slightly brighter for readability
                }}
              >
                Join thousands of others transforming the way they experience food.
                Whether eating or cooking, there's a place for you.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-sm)',
                  justifyContent: 'center',
                }}
              >
                <button
                  className="auth-btn"
                  style={{
                    background: 'var(--surface-container-lowest)', // Level 2 White
                    color: 'var(--primary-container)',           // Anchor Green Text
                    width: 'auto',
                    padding: '16px 40px',
                    boxShadow: 'none',                           // Remove emerald glow for contrast
                  }}
                >
                  Start Browsing
                </button>
                <button
                  className="auth-btn"
                  style={{
                    padding: '18px 36px',
                    width: 'auto',
                    border: '2px solid var(--surface-container-high)',
                    background: 'transparent',
                    color: 'var(--tertiary-fixed)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  Open Your Kitchen
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
};

export default HowItWorks;