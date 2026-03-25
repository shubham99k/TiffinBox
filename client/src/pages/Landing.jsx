import { useNavigate } from "react-router-dom";
import { Star, ArrowRight, ShieldCheck, Users, Utensils } from "lucide-react";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrap bg-background">
      {/* ── Top Navigation Bar ── */}
      <nav className="dashboard-navbar">
        <div className="dashboard-navbar-brand">
          TiffinBox <span className="auth-brand-dot" style={{ display: 'inline-block' }}></span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-['Manrope'] font-semibold">
          <span onClick={() => navigate("/")} style={{ cursor: 'pointer', opacity: 0.7, color: 'var(--primary-container)', textDecoration: 'underline', textUnderlineOffset: '8px'}}>Home</span>
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

      <main>
        {/* ── Hero Section ── */}
        <section className="dashboard-content relative flex items-center overflow-hidden" style={{ minHeight: '90vh', padding: '0 40px' }}>
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-20">
              <span className="inline-block py-1 px-3 bg-secondary-fixed text-on-secondary-fixed text-xs font-bold tracking-widest uppercase mb-6 rounded-sm">
                Crafted for Excellence
              </span>
              <h1 className="auth-right-headline" style={{ color: "var(--on-surface)", fontSize: "clamp(3rem, 8vw, 5rem)", lineHeight: 1.05 }}>
                Mastery in <br />
                Every <span className="accent" style={{ color: "var(--primary)" }}>Meal.</span>
              </h1>
              <p className="auth-page-sub" style={{ fontSize: '1.25rem', marginTop: '24px', maxWidth: '500px' }}>
                Connect with local alchemists crafting fresh, home-cooked dishes delivered to your door. Purely homemade, exceptionally mastered.
              </p>
              <div className="flex flex-wrap gap-4 mt-10">
                <button onClick={() => navigate("/register")} className="auth-btn" style={{ width: 'auto', padding: '18px 36px' }}>
                  Explore Marketplace
                </button>
                <button onClick={() => navigate("/how-it-works")} className="auth-btn" style={{ padding: '18px 36px', width: 'auto', background: 'var(--surface-container-low)', color: 'var(--on-surface)' }}>
                  How it Works
                </button>
              </div>
            </div>

            {/* Featured Cook Mockup from HTML */}
            <div className="relative">
              <div className="stat-card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9tZSUyMGNoZWZ8ZW58MHx8MHx8fDA%3D"
                  alt="Chef"
                  style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                />
                <div style={{ padding: '20px', background: 'var(--surface-container-lowest)' }}>
                  <div className="flex justify-between items-center">
                    <h4 className="auth-page-title" style={{ fontSize: '1.25rem', marginBottom: 0 }}>Marco Rossi</h4>
                    <div className="badge badge-verified"><Star size={12} fill="currentColor" /> 4.9</div>
                  </div>
                  <p className="auth-right-note" style={{ color: 'var(--primary)', marginTop: '4px' }}>Specialty: Handmade Tuscan Pasta</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Section (Bento Grid Style) ── */}
        <section style={{ padding: '80px 40px', background: 'var(--surface-container-low)'}}>
          <div className="dashboard-content max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Feature 1 */}
              <div className="md:col-span-8 stat-card" style={{ background: 'var(--surface-container-lowest)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: 'var(--primary-fixed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <Star className="text-primary" size={32} />
                </div>
                <h3 className="auth-page-title" style={{ fontSize: '2rem' }}>Unmatched Quality</h3>
                <p className="auth-page-sub" style={{ maxWidth: '450px' }}>Every dish is a masterpiece, prepared by vetted home chefs who prioritize fresh ingredients and authentic techniques.</p>
              </div>

              {/* Feature 2 */}
              <div className="md:col-span-4 stat-card" style={{ background: 'var(--primary-container)', color: '#fff' }}>
                <ShieldCheck size={48} style={{ color: 'var(--secondary-fixed)', marginBottom: '24px' }} />
                <h3 className="auth-page-title" style={{ color: '#fff' }}>Absolute Trust</h3>
                <p className="auth-right-body">Vigorously vetted alchemists and transparent kitchens ensure your peace of mind.</p>
              </div>

              {/* Feature 3 */}
              <div className="md:col-span-4 stat-card">
                <Users size={48} style={{ color: 'var(--primary)', marginBottom: '24px' }} />
                <h3 className="auth-page-title">Strong Community</h3>
                <p className="auth-page-sub">A network of food lovers supporting local talent and preserving culinary heritage.</p>
              </div>

              {/* Feature 4 */}
              <div className="md:col-span-8 stat-card" style={{ background: 'var(--on-surface)', color: 'var(--surface-bright)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ maxWidth: '400px' }}>
                  <h3 className="auth-page-title" style={{ color: '#fff', fontSize: '2rem' }}>Purely Homemade.</h3>
                  <p className="auth-right-body">No industrial kitchens. No hidden additives. Just the magic of real cooking from real homes.</p>
                </div>
                <Utensils size={80} style={{ opacity: 0.1 }} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Join the Network ── */}
        <section style={{ padding: '100px 40px' }}>
          <div className="dashboard-content max-w-7xl mx-auto" style={{ background: 'var(--primary-fixed)', borderRadius: '32px', overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 500px', padding: '60px' }}>
              <h2 className="auth-right-headline" style={{ color: 'var(--primary-container)', fontSize: '3rem' }}>
                Turn your kitchen into a sanctuary of craft.
              </h2>
              <p className="auth-page-sub" style={{ color: 'var(--on-surface-variant)', fontSize: '1.15rem' }}>
                Join our network of elite home cooks. We provide the platform, the audience, and the tools—you provide the magic.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <button onClick={() => navigate("/register")} className="auth-btn" style={{ width: '  30rem' }}>
                  Join as a Cook
                </button>
                <button onClick={() => navigate("/how-it-works")} className="auth-back" style={{ marginLeft: '0.5rem' }}>
                  Learn about our vetting <ArrowRight size={16} />
                </button>
              </div>
            </div>
            <div style={{ flex: '1 1 400px', minHeight: '400px' }}>
              <img
                src="https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvb2tpbmd8ZW58MHx8MHx8fDA%3D"
                alt="Cooking"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
          <footer
        style={{
          background: 'var(--surface-container-low)',
          padding: 'var(--space-lg) 40px',
          borderTop: '1px solid var(--outline-variant)',
          width: '100%',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* Left: Brand */}
          <div className="dashboard-navbar-brand" style={{ margin: 0 }}>
            TiffinBox <span className="auth-brand-dot" style={{ display: 'inline-block' }}></span>
          </div>

          {/* Center: Links */}
          <div
            style={{
              display: 'flex',
              gap: '2rem',
              color: 'var(--on-surface-variant)',
              textTransform: 'uppercase',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <a href="#" className="auth-back" style={{ textDecoration: 'none', margin: 0, fontSize: '0.75rem' }}>Privacy</a>
            <a href="#" className="auth-back" style={{ textDecoration: 'none', margin: 0, fontSize: '0.75rem' }}>Terms</a>
            <a href="#" className="auth-back" style={{ textDecoration: 'none', margin: 0, fontSize: '0.75rem' }}>Support</a>
          </div>

          {/* Right: Copyright */}
          <div className="auth-right-note" style={{ color: 'var(--outline)', margin: 0 }}>
            © 2026 TiffinBox. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;