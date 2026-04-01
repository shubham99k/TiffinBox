import { useNavigate } from "react-router-dom";
import {
  Star,
  ArrowRight,
  ShieldCheck,
  Users,
  Utensils,
  Soup,
} from "lucide-react";
import Footer from "../../components/Footer";
import MiscNavbar from "../../components/MiscNavbar";

function Landing() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ── Top Navigation Bar ── */}
        <MiscNavbar activeItem='home' />
      <div className='dashboard-wrap bg-background'>


        <main>
          {/* ── Hero Section ── */}
          <section
            className='dashboard-content relative flex items-center overflow-hidden px-4 sm:px-6 md:px-8 lg:px-10'
            style={{ minHeight: "90vh" }}>
            <div className='max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center'>
              <div className='relative z-20 ml-4 mr-4'>
                <span className='inline-block py-1 px-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 sm:mb-6 rounded-sm'>
                  Crafted for Excellence
                </span>
                <h1
                  className='auth-right-headline'
                  style={{
                    color: "var(--on-surface)",
                    fontSize: "clamp(3.0rem, 10vw, 5rem)",
                    lineHeight: 1.05,
                    textAlign: "justify",
                  }}>
                  Mastery in <br />
                  Every{" "}
                  <span className='accent' style={{ color: "var(--primary)" }}>
                    Meal.
                  </span>
                </h1>
                <p
                  className='auth-page-sub'
                  style={{
                    fontSize: "clamp(1rem, 3.8vw, 1.25rem)",
                    marginTop: "16px",
                    maxWidth: "500px",
                    textAlign: "left",
                  }}>
                  Connect with local Home Cooks crafting fresh, home-cooked
                  dishes delivered to your door. Purely homemade, exceptionally
                  mastered.
                </p>
                <div className='grid grid-cols-2 gap-3 sm:gap-4 mt-8 sm:mt-10 w-full max-w-[36rem]'>
                  <button
                    onClick={() => navigate("/register")}
                    className='auth-btn'
                    style={{
                      width: "100%",
                      padding: "14px 24px",
                    }}>
                    Explore
                  </button>
                  <button
                    onClick={() => navigate("/how-it-works")}
                    className='auth-btn'
                    style={{
                      padding: "14px 24px",
                      width: "100%",
                      background: "var(--surface-container-low)",
                      color: "var(--on-surface)",
                    }}>
                    How it Works
                  </button>
                </div>
              </div>

              {/* Featured Cook Mockup from HTML */}
              <div className='relative mt-2 ml-4 mr-4 lg:mt-0'>
                <div
                  className='stat-card'
                  style={{
                    padding: "0",
                    overflow: "hidden",
                    position: "relative",
                  }}>
                  <img
                    src='https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9tZSUyMGNoZWZ8ZW58MHx8MHx8fDA%3D'
                    alt='Chef'
                    style={{
                      width: "100%",
                      height: "clamp(240px, 45vw, 400px)",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      padding: "16px",
                      background: "var(--surface-container-lowest)",
                    }}>
                    <div className='flex justify-between items-center'>
                      <h4
                        className='auth-page-title'
                        style={{
                          fontSize: "clamp(1.05rem, 4vw, 1.25rem)",
                          marginBottom: 0,
                        }}>
                        Marco Rossi
                      </h4>
                      <div className='badge badge-verified'>
                        <Star size={12} fill='currentColor' /> 4.9
                      </div>
                    </div>
                    <p
                      className='auth-right-note'
                      style={{ color: "var(--primary)", marginTop: "4px" }}>
                      Specialty: Handmade Tuscan Pasta
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Why Section (Bento Grid Style) ── */}
          <section
            style={{
              padding: "clamp(48px, 8vw, 80px) clamp(16px, 4vw, 40px)",
              background: "var(--surface-container-low)",
            }}>
            <div className='dashboard-content max-w-7xl mx-auto'>
              <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
                {/* Feature 1 */}
                <div
                  className='md:col-span-8 stat-card'
                  style={{
                    background: "var(--surface-container-lowest)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      background: "var(--primary-fixed)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "24px",
                    }}>
                    <Star className='text-primary' size={32} />
                  </div>
                  <h3
                    className='auth-page-title'
                    style={{ fontSize: "clamp(1.5rem, 6vw, 2rem)" }}>
                    Unmatched Quality
                  </h3>
                  <p className='auth-page-sub' style={{ maxWidth: "450px" }}>
                    Every dish is a masterpiece, prepared by vetted home chefs
                    who prioritize fresh ingredients and authentic techniques.
                  </p>
                </div>

                {/* Feature 2 */}
                <div
                  className='md:col-span-4 stat-card'
                  style={{
                    background: "var(--primary-container)",
                    color: "#fff",
                  }}>
                  <ShieldCheck
                    size={48}
                    style={{
                      color: "var(--secondary-fixed)",
                      marginBottom: "24px",
                    }}
                  />
                  <h3
                    className='auth-page-title'
                    style={{
                      color: "#fff",
                      fontSize: "clamp(1.25rem, 5vw, 1.75rem)",
                    }}>
                    Absolute Trust
                  </h3>
                  <p className='auth-right-body'>
                    Vigorously vetted alchemists and transparent kitchens ensure
                    your peace of mind.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className='md:col-span-4 stat-card'>
                  <Users
                    size={48}
                    style={{ color: "var(--primary)", marginBottom: "24px" }}
                  />
                  <h3 className='auth-page-title'>Strong Community</h3>
                  <p className='auth-page-sub'>
                    A network of food lovers supporting local talent and
                    preserving culinary heritage.
                  </p>
                </div>

                {/* Feature 4 */}
                <div
                  className='md:col-span-8 stat-card'
                  style={{
                    background: "var(--on-surface)",
                    color: "var(--surface-bright)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}>
                  <div style={{ maxWidth: "400px" }}>
                    <Soup
                      size={48}
                      style={{
                        color: "var( --secondary-fixed-dim)",
                        marginBottom: "24px",
                      }}
                    />
                    <h3
                      className='auth-page-title'
                      style={{ color: "#fff", fontSize: "2rem" }}>
                      Purely Homemade.
                    </h3>
                    <p className='auth-right-body'>
                      No industrial kitchens. No hidden additives. Just the
                      magic of real cooking from real homes.
                    </p>
                  </div>
                  <Utensils size={64} style={{ opacity: 0.12 }} />
                </div>
              </div>
            </div>
          </section>

          {/* ── Join the Network ── */}
          <section
            style={{
              padding: "clamp(56px, 9vw, 100px) clamp(16px, 4vw, 40px)",
            }}>
            <div
              className='dashboard-content max-w-7xl mx-auto'
              style={{
                background: "var(--primary-fixed)",
                borderRadius: "32px",
                overflow: "hidden",
                display: "flex",
                flexWrap: "wrap",
              }}>
              <div
                style={{
                  flex: "1 1 500px",
                  padding: "clamp(20px, 6vw, 60px)",
                }}>
                <h2
                  className='auth-right-headline'
                  style={{
                    color: "var(--primary-container)",
                    fontSize: "clamp(1.9rem, 8vw, 3rem)",
                    lineHeight: 1.08,
                  }}>
                  Turn your kitchen into a sanctuary of craft.
                </h2>
                <p
                  className='auth-page-sub'
                  style={{
                    color: "var(--on-surface-variant)",
                    fontSize: "1.15rem",
                  }}>
                  Join our network of elite home cooks. We provide the platform,
                  the audience, and the tools—you provide the magic.
                </p>
                <div className='flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8'>
                  <button
                    onClick={() => navigate("/register")}
                    className='auth-btn'
                    style={{ width: "100%", maxWidth: "20rem" }}>
                    Join as a Cook
                  </button>
                  <button
                    onClick={() => navigate("/how-it-works")}
                    className='auth-back'
                    style={{ marginLeft: "0", width: "fit-content" }}>
                    Learn about our vetting <ArrowRight size={16} />
                  </button>
                </div>
              </div>
              <div style={{ flex: "1 1 400px", minHeight: "260px" }}>
                <img
                  src='https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvb2tpbmd8ZW58MHx8MHx8fDA%3D'
                  alt='Cooking'
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "32px",
                  }}
                />
              </div>
            </div>
          </section>
        </main>

        {/* ── Footer ── */}
        <Footer />
      </div>
    </div>
  );
}

export default Landing;
