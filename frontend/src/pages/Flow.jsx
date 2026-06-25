import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SocialIcons from "../components/SocialIcons";

const Flow = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const flowSteps = [
    {
      step: 1,
      role: "Farmer",
      title: "Create a Pool",
      description: "Set up a new agricultural pool with your crop details, target quantity, price, and pickup location.",
      icon: "🌾",
      details: [
        "Enter crop name",
        "Set target quantity (kg)",
        "Fix price per kg",
        "Provide pickup location",
        "Wait for buyers to join"
      ]
    },
    {
      step: 2,
      role: "Farmer",
      title: "Monitor & Manage",
      description: "Track contributions from other farmers and see how many buyers are interested in your pool.",
      icon: "📊",
      details: [
        "View current contributions",
        "See joining farmers",
        "Monitor pool status",
        "Lock pool when target reached",
        "Receive buyer confirmations"
      ]
    },
    {
      step: 3,
      role: "Buyer",
      title: "Discover Pools",
      description: "Browse available pools near your location with filters for crop, price range, and radius.",
      icon: "🔍",
      details: [
        "Search by crop name",
        "Filter by price range",
        "View distance from location",
        "See pool details",
        "Check real-time availability"
      ]
    },
    {
      step: 4,
      role: "Buyer",
      title: "Place Order",
      description: "Select a pool, enter desired quantity, and place your order for direct purchase.",
      icon: "🛒",
      details: [
        "Choose quantity to buy",
        "View price calculation",
        "Order automatically joins pool",
        "Receive order confirmation",
        "Order status: PENDING"
      ]
    },
    {
      step: 5,
      role: "Farmer",
      title: "Approve Orders",
      description: "Review pending orders from buyers and accept them to confirm the transaction.",
      icon: "✅",
      details: [
        "View pending orders",
        "Check buyer details",
        "Accept or reject orders",
        "Update pool status",
        "Confirm transaction amount"
      ]
    },
    {
      step: 6,
      role: "Buyer",
      title: "Complete Purchase",
      description: "After pool is locked and orders are accepted, proceed with payment and collect your produce.",
      icon: "💰",
      details: [
        "View accepted order status",
        "See total amount to pay",
        "Farmer name & contact",
        "Number of contributors",
        "Arrange pickup/delivery"
      ]
    }
  ];

  const timelinePhases = [
    { phase: "Creation", description: "Farmers create pools with crop details and pricing", icon: "🌱" },
    { phase: "Discovery", description: "Buyers search and find pools near their location", icon: "🔍" },
    { phase: "Ordering", description: "Buyers place orders and join the pool", icon: "📝" },
    { phase: "Approval", description: "Farmers review and approve buyer orders", icon: "✅" },
    { phase: "Completion", description: "Transaction completes and payment is settled", icon: "🎉" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0F172A" }}>

      {/* ── HEADER ── */}
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
      <section className="text-center py-16 px-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: "radial-gradient(circle, #22C55E 0%, transparent 70%)" }}
        />

        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-6"
            style={{
              background: "rgba(34, 197, 94, 0.08)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              color: "#22C55E",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22C55E" }} />
            Platform Guide
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ color: "#F8FAFC" }}>
            How Kishan Saathi <span className="text-gradient-green">Works</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg" style={{ color: "#94a3b8" }}>
            Understand the complete flow of our platform — from farmer pool creation to buyer purchase completion.
          </p>
        </div>
      </section>

      {/* ── FLOW STEPS SECTION ── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {flowSteps.map((item, index) => (
            <div
              key={index}
              className="relative"
            >
              {/* Connector Line */}
              {index < flowSteps.length - 1 && (
                <div
                  className="absolute left-[80px] top-full w-[2px] h-6 z-0"
                  style={{ background: "linear-gradient(to bottom, rgba(34, 197, 94, 0.3), transparent)" }}
                />
              )}

              <div className={`flex gap-6 md:gap-8 ${index % 2 === 0 ? "flex-row" : "md:flex-row-reverse flex-row"}`}>
                {/* Step Icon */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-24 h-24 md:w-36 md:h-36 rounded-full flex items-center justify-center text-4xl md:text-6xl font-bold relative z-10"
                    style={{
                      background: item.role === "Farmer"
                        ? "rgba(34, 197, 94, 0.12)"
                        : "rgba(34, 197, 94, 0.08)",
                      border: `2px solid ${item.role === "Farmer" ? "rgba(34, 197, 94, 0.3)" : "rgba(34, 197, 94, 0.2)"}`,
                      boxShadow: `0 0 30px ${item.role === "Farmer" ? "rgba(34, 197, 94, 0.08)" : "rgba(34, 197, 94, 0.05)"}`,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    className="mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                    style={{
                      background: item.role === "Farmer" ? "rgba(34, 197, 94, 0.1)" : "rgba(34, 197, 94, 0.06)",
                      color: "#22C55E",
                      border: "1px solid rgba(34, 197, 94, 0.2)",
                    }}
                  >
                    {item.role}
                  </span>
                </div>

                {/* Step Content */}
                <div className="flex-1 modern-card modern-card-hover p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl md:text-5xl font-black" style={{ color: "rgba(34, 197, 94, 0.2)" }}>
                      {String(item.step).padStart(2, '0')}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#F8FAFC" }}>{item.title}</h2>
                  </div>

                  <p className="mb-6 text-base md:text-lg" style={{ color: "#94a3b8" }}>{item.description}</p>

                  <div className="grid md:grid-cols-2 gap-3">
                    {item.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 px-3 py-2 rounded-lg transition-colors"
                        style={{ background: "rgba(34, 197, 94, 0.03)" }}
                      >
                        <span className="font-bold mt-0.5 flex-shrink-0" style={{ color: "#22C55E" }}>✓</span>
                        <p className="text-sm" style={{ color: "#94a3b8" }}>{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE PHASES ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] mb-3" style={{ color: "#22C55E" }}>Timeline</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: "#F8FAFC" }}>
            Complete Transaction Timeline
          </h2>
          <div className="w-12 h-0.5 rounded-full mt-4 mx-auto" style={{ background: "linear-gradient(90deg, #22C55E, transparent)" }} />
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          {timelinePhases.map((phase, index) => (
            <div key={index} className="relative group">
              {/* Connector */}
              {index < timelinePhases.length - 1 && (
                <div
                  className="hidden md:block absolute top-1/2 -right-2 w-4 h-[2px]"
                  style={{ background: "rgba(34, 197, 94, 0.15)" }}
                />
              )}

              <div className="modern-card modern-card-hover p-6 text-center h-full">
                <div className="text-3xl mb-3">{phase.icon}</div>
                <div
                  className="text-3xl font-black mb-2"
                  style={{ color: "rgba(34, 197, 94, 0.2)" }}
                >
                  {index + 1}
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: "#22C55E" }}>
                  {phase.phase}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── KEY FEATURES ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] mb-3" style={{ color: "#22C55E" }}>Advantages</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: "#F8FAFC" }}>
            Why Choose Kishan Saathi?
          </h2>
          <div className="w-12 h-0.5 rounded-full mt-4 mx-auto" style={{ background: "linear-gradient(90deg, #22C55E, transparent)" }} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🔗",
              title: "Direct Connection",
              description: "Connect farmers directly with buyers, eliminating middlemen and increasing profits for everyone.",
            },
            {
              icon: "💡",
              title: "Bulk Advantages",
              description: "Pool resources together to achieve bulk selling, negotiate better prices, and improve market competitiveness.",
            },
            {
              icon: "🔒",
              title: "Secure & Transparent",
              description: "Built with database transactions and row-level locking to ensure safe, reliable, and transparent transactions.",
            },
          ].map((feature, index) => (
            <div key={index} className="modern-card modern-card-hover p-8 group cursor-default">
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

      {/* ── CTA SECTION ── */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="modern-card p-10 md:p-14 relative overflow-hidden">
          {/* Decorative glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(34, 197, 94, 0.06) 0%, transparent 70%)" }}
          />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: "#F8FAFC" }}>
              Ready to Transform Your{" "}
              <span className="text-gradient-green">Farming Business?</span>
            </h2>
            <p className="mb-8 text-lg" style={{ color: "#94a3b8" }}>
              Join thousands of farmers and buyers already benefiting from direct transactions.
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
                Get Started Today
              </Link>
              <Link
                to="/"
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
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-6 border-t" style={{ background: "rgba(15, 23, 42, 0.95)", borderColor: "rgba(34, 197, 94, 0.1)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-extrabold" style={{ color: "#22C55E" }}>Kishan Saathi</p>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>© 2026. Empowering farmers through technology.</p>
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

export default Flow;
