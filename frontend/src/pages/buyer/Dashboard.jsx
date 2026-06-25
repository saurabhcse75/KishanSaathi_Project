import { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";

const BuyerDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    rejectedOrders: 0,
    totalSpent: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get("/orders/my");
        const orders = res.data || [];

        const pending = orders.filter((o) => o.status === "PENDING");
        const accepted = orders.filter((o) => o.status === "ACCEPTED");
        const rejected = orders.filter((o) => o.status === "REJECTED");
        const totalSpent = accepted.reduce(
          (sum, o) => sum + o.quantity * o.price,
          0
        );

        setStats({
          totalOrders: orders.length,
          pendingOrders: pending.length,
          acceptedOrders: accepted.length,
          rejectedOrders: rejected.length,
          totalSpent,
        });

        setRecentOrders(orders.slice(0, 4));
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



  // Horizontal bar component for order breakdown
  const HorizontalBar = ({ label, value, total, color, icon }) => {
    const pct = total > 0 ? (value / total) * 100 : 0;
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-gray-400 flex items-center gap-2">
            <span className="text-base">{icon}</span> {label}
          </span>
          <span className="font-extrabold" style={{ color }}>
            {value} <span className="text-gray-600 font-normal">/ {total}</span>
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.08)" }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(pct, 100)}%`, background: color, boxShadow: `0 0 8px ${color}40` }}
          />
        </div>
      </div>
    );
  };

  const statusConfig = {
    PENDING: { color: "#eab308", bg: "rgba(234,179,8,0.10)", label: "Pending", icon: "⏳" },
    ACCEPTED: { color: "#22c55e", bg: "rgba(34,197,94,0.10)", label: "Accepted", icon: "✅" },
    REJECTED: { color: "#ef4444", bg: "rgba(239,68,68,0.10)", label: "Rejected", icon: "❌" },
  };

  return (
    <Layout>
      {/* ── HERO ── */}
      <div className="relative mb-8 overflow-hidden rounded-2xl p-6 md:py-6 md:px-8 border border-[#22C55E]/15" style={{ background: "linear-gradient(135deg, #090d16 0%, #0d2215 100%)" }}>
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
              {auth?.user?.name || "Buyer"}
              <span className="text-[#22C55E]">.</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md">
              Discover fresh produce from farmer pools and track your orders.
            </p>
          </div>
          <Link
            to="/buyer/nearby"
            className="self-start md:self-auto inline-flex items-center gap-2 text-[#0F172A] font-extrabold text-sm px-5 py-3 rounded-xl transition-all duration-300 active:scale-95 hover:shadow-lg cursor-pointer"
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", boxShadow: "0 4px 16px rgba(34,197,94,0.25)" }}
            onMouseEnter={e => e.target.style.filter = "brightness(1.1)"}
            onMouseLeave={e => e.target.style.filter = "brightness(1.0)"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            Find Pools
          </Link>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: "Total", value: stats.totalOrders, icon: "📦" },
          { label: "Pending", value: stats.pendingOrders, icon: "⏳" },
          { label: "Accepted", value: stats.acceptedOrders, icon: "✅" },
          { label: "Rejected", value: stats.rejectedOrders, icon: "❌" },
          { label: "Spent", value: `₹${stats.totalSpent.toLocaleString()}`, icon: "💰" },
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

      {/* ── ORDER BREAKDOWN BAR CHART ── */}
      {!loading && stats.totalOrders > 0 && (
        <div className="modern-card p-6 mb-10">
          <h3 className="text-sm font-extrabold text-white mb-5 flex items-center gap-2 uppercase tracking-wider">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">📊</span>
            Order Breakdown
          </h3>
          <div className="space-y-4">
            <HorizontalBar label="Pending" value={stats.pendingOrders} total={stats.totalOrders} color="#eab308" icon="⏳" />
            <HorizontalBar label="Accepted" value={stats.acceptedOrders} total={stats.totalOrders} color="#22c55e" icon="✅" />
            <HorizontalBar label="Rejected" value={stats.rejectedOrders} total={stats.totalOrders} color="#ef4444" icon="❌" />
          </div>
        </div>
      )}

      {/* ── QUICK ACTIONS ── */}
      <div className="mb-10">
        <h2 className="text-base font-extrabold text-white mb-5 flex items-center gap-3 uppercase tracking-wider">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">⚡</span>
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              to: "/buyer/nearby",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              ),
              title: "Discover Pools",
              desc: "Browse locked pools near you and order fresh produce directly from farmers.",
            },
            {
              to: "/buyer/orders",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                </svg>
              ),
              title: "My Orders",
              desc: "Track all your orders — pending, accepted, and rejected in one place.",
            },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="modern-card modern-card-hover group relative overflow-hidden p-6 cursor-pointer"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.04), transparent 60%)" }} />
              <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{ background: "linear-gradient(90deg, #22c55e, transparent)" }} />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}>
                  {a.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-1">{a.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{a.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#22C55E] opacity-75 group-hover:opacity-100 transition-all duration-300">
                  Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── RECENT ORDERS ── */}
      {!loading && recentOrders.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-extrabold text-white flex items-center gap-3 uppercase tracking-wider">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">🧾</span>
              Recent Orders
            </h2>
            <Link to="/buyer/orders" className="text-xs text-green-400 hover:text-[#22C55E] hover:underline font-bold transition-all">
              View All →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {recentOrders.map((order) => {
              const sc = statusConfig[order.status] || statusConfig.PENDING;
              const amount = order.quantity * order.price;
              return (
                <div
                  key={order.id}
                  className="modern-card modern-card-hover group relative p-5 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Top Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-extrabold text-white text-base group-hover:text-[#22C55E] transition-colors">{order.cropName}</h4>
                        <p className="text-[11px] text-gray-500 mt-1 font-semibold">
                          {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 border" style={{ background: sc.bg, color: sc.color, borderColor: `${sc.color}30` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.color }} />
                        {sc.label}
                      </span>
                    </div>

                    {/* Details metrics */}
                    <div className="grid grid-cols-3 gap-2.5 mb-4">
                      <div className="rounded-xl p-2.5 bg-[#22C55E]/5 border border-[#22C55E]/10">
                        <p className="text-[9px] text-gray-500 font-bold uppercase mb-0.5">Qty</p>
                        <p className="text-sm font-black text-white">{order.quantity} kg</p>
                      </div>
                      <div className="rounded-xl p-2.5 bg-[#22C55E]/5 border border-[#22C55E]/10">
                        <p className="text-[9px] text-gray-500 font-bold uppercase mb-0.5">Rate</p>
                        <p className="text-sm font-black text-white">₹{order.price}</p>
                      </div>
                      <div className="rounded-xl p-2.5 bg-[#22C55E]/10 border border-[#22C55E]/20">
                        <p className="text-[9px] text-gray-500 font-bold uppercase mb-0.5">Total</p>
                        <p className="text-sm font-black text-[#22C55E]">₹{amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Owner & Pickup details */}
                  <div className="pt-3 border-t border-[#22C55E]/10 space-y-2 mt-auto">
                    <div className="flex flex-wrap items-center justify-between text-xs gap-y-1">
                      {order.farmerName && (
                        <div className="flex items-center gap-1.5 text-gray-300 font-semibold">
                          <span className="text-sm">👨‍🌾</span>
                          <span>{order.farmerName}</span>
                        </div>
                      )}
                      {order.farmerMobile && (
                        <div className="flex items-center gap-1 text-gray-400 font-medium">
                          <span>📞</span>
                          <span>{order.farmerMobile}</span>
                        </div>
                      )}
                    </div>
                    {order.pickupLocation && (
                      <div className="text-xs text-gray-400 flex items-center gap-1.5 font-semibold bg-[#0F172A]/40 p-2 rounded-lg border border-[#22C55E]/5">
                        <span>📍</span>
                        <span className="truncate" title={order.pickupLocation}>{order.pickupLocation}</span>
                      </div>
                    )}
                  </div>
                </div>
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
            <h3 className="font-bold text-white mb-1 text-sm">How It Works</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Farmers create produce pools and lock them when ready.
              Use{" "}
              <Link to="/buyer/nearby" className="text-green-400 hover:text-[#22C55E] hover:underline font-bold">Discover Pools</Link>{" "}
              to browse, place orders, and track everything from{" "}
              <Link to="/buyer/orders" className="text-green-400 hover:text-[#22C55E] hover:underline font-bold">My Orders</Link>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuyerDashboard;