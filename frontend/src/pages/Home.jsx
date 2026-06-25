import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SocialIcons from "../components/SocialIcons";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: "🔗",
      title: "Create Pools",
      description: "Farmers can combine produce together to sell in bulk and negotiate better prices.",
      accent: "#22C55E",
    },
    {
      icon: "🤝",
      title: "Direct Buying",
      description: "Buyers purchase directly from pools without middlemen, ensuring fair pricing for both parties.",
      accent: "#22C55E",
    },
    {
      icon: "🔒",
      title: "Secure System",
      description: "Transparent and reliable transaction flow with row-level locking and database transactions.",
      accent: "#22C55E",
    },
  ];

  const stats = [
    { value: "500+", label: "Active Farmers", icon: "🚜" },
    { value: "1000+", label: "Registered Buyers", icon: "🛒" },
    { value: "₹50Cr+", label: "Total Transactions", icon: "💰" },
    { value: "98%", label: "Satisfaction Rate", icon: "⭐" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0F172A" }}>

      {/* ── NAVBAR ── */}
      <nav
        className="sticky top-0 z-50 px-6 py-4 backdrop-blur-xl border-b transition-all duration-300"
        style={{
          background: scrolled ? "rgba(15, 23, 42, 0.95)" : "rgba(15, 23, 42, 0.85)",
          borderColor: "rgba(34, 197, 94, 0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(34,197,94,0.2)]">🌾</span>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Kishan <span style={{ color: "#22C55E" }}>Saathi</span>
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "#64748b" }}>Connected Agriculture</p>
            </div>
          </Link>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95"
              style={{
                background: "rgba(34, 197, 94, 0.08)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                color: "#22C55E",
              }}
              onMouseEnter={e => {
                e.target.style.background = "rgba(34, 197, 94, 0.15)";
                e.target.style.borderColor = "#22C55E";
                e.target.style.color = "#F8FAFC";
              }}
              onMouseLeave={e => {
                e.target.style.background = "rgba(34, 197, 94, 0.08)";
                e.target.style.borderColor = "rgba(34, 197, 94, 0.2)";
                e.target.style.color = "#22C55E";
              }}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95"
              style={{
                background: "#22C55E",
                color: "#0F172A",
                border: "1px solid #22C55E",
                boxShadow: "0 4px 14px rgba(34, 197, 94, 0.25)",
              }}
              onMouseEnter={e => {
                e.target.style.background = "#16A34A";
                e.target.style.boxShadow = "0 8px 24px rgba(34, 197, 94, 0.4)";
              }}
              onMouseLeave={e => {
                e.target.style.background = "#22C55E";
                e.target.style.boxShadow = "0 4px 14px rgba(34, 197, 94, 0.25)";
              }}
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="flex flex-col items-center justify-center text-center flex-grow px-6 py-24 relative overflow-hidden">
        {/* Decorative background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: "radial-gradient(circle, #22C55E 0%, transparent 70%)" }}
        />

        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-8"
            style={{
              background: "rgba(34, 197, 94, 0.08)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              color: "#22C55E",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22C55E" }} />
            Empowering Indian Agriculture
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight" style={{ color: "#F8FAFC" }}>
            Empowering Farmers,{" "}
            <br className="hidden md:block" />
            <span className="text-gradient-green">Connecting Markets</span>
          </h1>

          <p className="max-w-2xl mb-10 text-lg leading-relaxed" style={{ color: "#94a3b8" }}>
            Connect farmers and buyers directly. Create agricultural pools, sell crops in bulk,
            and grow your business efficiently without middlemen.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 active:scale-95"
              style={{
                background: "#22C55E",
                color: "#0F172A",
                border: "1px solid #22C55E",
                boxShadow: "0 4px 14px rgba(34, 197, 94, 0.25)",
              }}
              onMouseEnter={e => {
                e.target.style.background = "#16A34A";
                e.target.style.boxShadow = "0 8px 24px rgba(34, 197, 94, 0.4)";
              }}
              onMouseLeave={e => {
                e.target.style.background = "#22C55E";
                e.target.style.boxShadow = "0 4px 14px rgba(34, 197, 94, 0.25)";
              }}
            >
              Get Started Now
            </Link>
            <Link
              to="/flow"
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 active:scale-95"
              style={{
                background: "rgba(34, 197, 94, 0.08)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                color: "#22C55E",
              }}
              onMouseEnter={e => {
                e.target.style.background = "rgba(34, 197, 94, 0.15)";
                e.target.style.borderColor = "#22C55E";
                e.target.style.color = "#F8FAFC";
              }}
              onMouseLeave={e => {
                e.target.style.background = "rgba(34, 197, 94, 0.08)";
                e.target.style.borderColor = "rgba(34, 197, 94, 0.2)";
                e.target.style.color = "#22C55E";
              }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="max-w-6xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] mb-3" style={{ color: "#22C55E" }}>Features</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: "#F8FAFC" }}>
            Everything You Need
          </h2>
          <div className="w-12 h-0.5 rounded-full mt-4 mx-auto" style={{ background: "linear-gradient(90deg, #22C55E, transparent)" }} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="modern-card modern-card-hover p-8 group cursor-default"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                }}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#F8FAFC" }}>
                {feature.title}
              </h3>
              <p className="leading-relaxed text-sm" style={{ color: "#94a3b8" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="max-w-6xl mx-auto w-full px-6 py-16">
        <div className="grid md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="modern-card p-6 text-center group transition-all duration-300 hover:border-[rgba(34,197,94,0.35)]"
            >
              <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">
                {stat.icon}
              </div>
              <div className="text-3xl font-black mb-1" style={{ color: "#22C55E" }}>
                {stat.value}
              </div>
              <p className="text-sm font-semibold" style={{ color: "#94a3b8" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-auto px-6 py-6 border-t" style={{ background: "rgba(15, 23, 42, 0.95)", borderColor: "rgba(34, 197, 94, 0.1)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-extrabold" style={{ color: "#22C55E" }}>Kishan Saathi</p>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>© 2026. Connecting farmers and buyers directly.</p>
          </div>

          <SocialIcons />

          <div className="text-[11px] font-semibold text-center md:text-right" style={{ color: "#94A3B8" }}>
            <Link to="#" className="hover:underline hover:text-white transition-colors">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link to="#" className="hover:underline hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;