import { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({ created: 0, joined: 0, openPools: 0, lockedPools: 0, pendingOrders: 0 });
  const [recentPools, setRecentPools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [poolsRes, ordersRes] = await Promise.all([
          API.get("/pools/my"),
          API.get("/orders/farmer").catch(() => ({ data: [] })),
        ]);

        const created = poolsRes.data.created || [];
        const joined = poolsRes.data.joined || [];
        const orders = ordersRes.data || [];

        setStats({
          created: created.length,
          joined: joined.length,
          openPools: created.filter((p) => p.status === "OPEN").length,
          lockedPools: created.filter((p) => p.status === "LOCKED").length,
          pendingOrders: orders.filter((o) => o.status === "PENDING").length,
        });

        setRecentPools(created.slice(0, 3));
      } catch (err) {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Circular progress ring SVG helper with glowing gradient
  const CircleProgress = ({ percent, size = 56, stroke = 5 }) => {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(percent, 100) / 100) * circumference;
    return (
      <svg width={size} height={size} className="transform -rotate-90 filter drop-shadow-[0_0_3px_rgba(34,197,94,0.2)]">
        <defs>
          <linearGradient id="farmerProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(34, 197, 94, 0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="url(#farmerProgressGrad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
    );
  };

  return (
    <Layout>
      {/* ── HERO ── */}
      <div className="relative mb-8 overflow-hidden rounded-2xl p-6 md:py-6 md:px-8 border border-[#22C55E]/15" style={{ background: "linear-gradient(135deg, #090d16 0%, #0d2215 100%)" }}>
        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #22c55e 0%, transparent 70%)" }} />
        <div className="absolute -bottom-20 -left-20 w-32 h-32 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #16a34a 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full px-3 py-1 mb-2.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-extrabold text-green-400 tracking-wider uppercase">{greeting()}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-1">
              {auth?.user?.name || "Farmer"}
              <span className="text-[#22C55E]">.</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md">
              Manage your pools, track contributions, and handle buyer orders.
            </p>
          </div>
          <Link
            to="/create-pool"
            className="self-start md:self-auto inline-flex items-center gap-2 text-[#0F172A] font-extrabold text-sm px-5 py-3 rounded-xl transition-all duration-300 active:scale-95 hover:shadow-lg cursor-pointer"
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", boxShadow: "0 4px 16px rgba(34,197,94,0.25)" }}
            onMouseEnter={e => e.target.style.filter = "brightness(1.1)"}
            onMouseLeave={e => e.target.style.filter = "brightness(1.0)"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Pool
          </Link>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: "Created", value: stats.created, icon: "🌾" },
          { label: "Joined", value: stats.joined, icon: "🤝" },
          { label: "Open", value: stats.openPools, icon: "🟢" },
          { label: "Locked", value: stats.lockedPools, icon: "🔒" },
          { label: "Orders", value: stats.pendingOrders, icon: "📋" },
        ].map((s) => (
          <div
            key={s.label}
            className="modern-card modern-card-hover relative p-5 cursor-default overflow-hidden group"
          >
            {/* Corner accent glow */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle at top right, rgba(34,197,94,0.12), transparent 70%)" }} />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] mb-4">{s.icon}</div>
              <div>
                <p className="text-3xl font-black text-white mb-0.5 tabular-nums">
                  {loading ? <span className="inline-block w-8 h-8 bg-green-950/20 rounded-lg animate-pulse" /> : s.value}
                </p>
                <p className="text-[10px] text-green-500/70 font-extrabold uppercase tracking-[0.15em] mb-0">
                  {s.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="mb-10">
        <h2 className="text-base font-extrabold text-white mb-5 flex items-center gap-3 uppercase tracking-wider">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">⚡</span>
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              to: "/create-pool",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              ),
              title: "Create Pool",
              desc: "Start a new pool and invite nearby farmers to contribute.",
            },
            {
              to: "/nearby-pools",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              ),
              title: "Nearby Pools",
              desc: "Discover and join active pools in your area.",
            },
            {
              to: "/my-pools",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                </svg>
              ),
              title: "My Pools",
              desc: "View and manage your created and joined pools.",
            },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="modern-card modern-card-hover group relative overflow-hidden p-6 cursor-pointer"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.04), transparent 60%)" }} />

              {/* Green line top */}
              <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{ background: "linear-gradient(90deg, #22c55e, transparent)" }} />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}>
                  {a.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-1">{a.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{a.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#22C55E] opacity-75 group-hover:opacity-100 transition-all duration-300">
                  Open <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── RECENT POOLS ── */}
      {!loading && recentPools.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-extrabold text-white flex items-center gap-3 uppercase tracking-wider">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">📊</span>
              Recent Pools
            </h2>
            <Link to="/my-pools" className="text-xs text-green-400 hover:text-[#22C55E] hover:underline font-bold transition-all">
              View All →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {recentPools.map((pool) => {
              const currentQty = pool.currentQuantity || pool.current_quantity || 0;
              const targetQty = pool.targetQuantity || pool.target_quantity || 0;
              const percent = targetQty > 0 ? (currentQty / targetQty) * 100 : 0;
              const statusMap = {
                OPEN: { label: "Open", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
                LOCKED: { label: "Locked", color: "#eab308", bg: "rgba(234,179,8,0.12)" },
                SELLING: { label: "Selling", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
              };
              const st = statusMap[pool.status] || statusMap.OPEN;

              return (
                <Link
                  key={pool.id}
                  to={`/pool/${pool.id}`}
                  className="modern-card modern-card-hover group relative p-5 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">
                          {pool.cropName || pool.crop_name}
                        </h3>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xl font-black text-[#22C55E]">₹{pool.price}</span>
                          <span className="text-[10px] text-gray-500">/kg</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border" style={{ background: st.bg, color: st.color, borderColor: `${st.color}33` }}>
                        {st.label}
                      </span>
                    </div>

                    {/* Circular progress + details */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative flex-shrink-0">
                        <CircleProgress percent={percent} size={64} stroke={4.5} />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-green-400">
                          {percent.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex-grow space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Collected</span>
                          <span className="font-bold text-green-400">{currentQty} kg</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Target</span>
                          <span className="font-bold text-gray-200">{targetQty} kg</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Remaining</span>
                          <span className="font-bold text-yellow-500">{Math.max(targetQty - currentQty, 0)} kg</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Linear progress bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.08)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min(percent, 100)}%`,
                        background: "linear-gradient(90deg, #16a34a, #22c55e)",
                        boxShadow: "0 0 10px rgba(34,197,94,0.35)",
                      }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TIP BANNER ── */}
      <div className="relative overflow-hidden rounded-2xl p-6 border border-[#22C55E]/10" style={{ background: "linear-gradient(135deg, #090d16 0%, #0c1a11 100%)" }}>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #22c55e, transparent 70%)" }} />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border border-[#22C55E]/15 bg-[#22C55E]/5 text-[#22C55E]">
            💡
          </div>
          <div>
            <h3 className="font-bold text-white mb-1 text-sm">Pro Tip</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Create pools with nearby farmers to combine quantities. Once locked, buyers discover your pool.
              Manage requests in the{" "}
              <Link to="/farmer/orders" className="text-green-400 hover:text-[#22C55E] hover:underline font-bold">Orders</Link> tab.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
