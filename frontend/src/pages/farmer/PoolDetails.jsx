import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import Layout from "../../components/Layout";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const PoolDetails = () => {
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const res = await API.get(`/pools/${id}`);
      setPool(res.data);
    } catch (err) {
      toast.error("Failed to load pool");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, auth?.user?.id]);

  const handleLock = async () => {
    try {
      await API.put(`/pools/${id}/lock`);
      toast.success("Pool Locked 🔒");
      fetchDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to lock pool");
    }
  };

  // Circular progress ring helper with glowing gradient
  const Ring = ({ pct, size = 80, stroke = 6 }) => {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    return (
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90 filter drop-shadow-[0_0_4px_rgba(34,197,94,0.25)]">
          <defs>
            <linearGradient id="poolDetailsProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(34, 197, 94, 0.08)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#poolDetailsProgressGrad)" strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c - (Math.min(pct, 100) / 100) * c} className="transition-all duration-1000" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-[#22C55E]">{pct.toFixed(0)}%</span>
      </div>
    );
  };

  if (loading) return <Layout><p className="text-gray-400 text-center py-12">Loading details...</p></Layout>;
  if (!pool) return <Layout><p className="text-gray-400 text-center py-12">No pool details found.</p></Layout>;

  const isOwner = auth?.user?.id === pool.createdBy;
  const phase = (pool.phase || "").toLowerCase();
  const status = (pool.status || "").toUpperCase();
  const isCollectionPhase = phase === "collection" || status === "OPEN";
  const displayPhase = status === "OPEN" ? "COLLECTION" : status;
  const percent = pool.percent || 0;
  const soldPct = pool.currentQuantity > 0 ? ((pool.soldQuantity || 0) / pool.currentQuantity) * 100 : 0;

  const statusColors = {
    OPEN: { color: "#22C55E", bg: "rgba(34,197,94,0.08)" },
    LOCKED: { color: "#eab308", bg: "rgba(234,179,8,0.08)" },
    SELLING: { color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
    SOLD: { color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  };
  const sc = statusColors[status] || statusColors.OPEN;

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white">{pool.cropName}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border" style={{ background: sc.bg, color: sc.color, borderColor: `${sc.color}30` }}>
              {displayPhase}
            </span>
            <span className="text-xs text-gray-500 font-semibold">Pool ID: #{pool.id}</span>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="text-3xl font-black text-[#22C55E]">₹{pool.price}</p>
          <p className="text-xs text-gray-500 font-semibold">price per kg</p>
        </div>
      </div>

      {/* Main Stats Card */}
      <div className="modern-card p-6 md:p-8 mb-8">
        {isCollectionPhase ? (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Ring pct={percent} size={100} stroke={8} />
            <div className="flex-1 w-full">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#22C55E] mb-4">Collection Progress</h3>
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-5">
                <div className="rounded-xl p-3 bg-[#22C55E]/5 border border-[#22C55E]/10">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Target</p>
                  <p className="text-lg font-black text-white">{pool.targetQuantity} kg</p>
                </div>
                <div className="rounded-xl p-3 bg-[#22C55E]/5 border border-[#22C55E]/10">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Current</p>
                  <p className="text-lg font-black text-[#22C55E]">{pool.currentQuantity} kg</p>
                </div>
                <div className="rounded-xl p-3 bg-[#eab308]/5 border border-[#eab308]/10">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Remaining</p>
                  <p className="text-lg font-black text-[#eab308]">{pool.remaining} kg</p>
                </div>
              </div>
              

            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Ring pct={soldPct} size={100} stroke={8} />
            <div className="flex-1 w-full">
              <h3 className="text-sm font-extrabold uppercase tracking-widest mb-4" style={{ color: sc.color }}>Sales Progress</h3>
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-5">
                <div className="rounded-xl p-3 bg-[#22C55E]/5 border border-[#22C55E]/10">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Stock</p>
                  <p className="text-lg font-black text-white">{pool.currentQuantity} kg</p>
                </div>
                <div className="rounded-xl p-3 bg-[#22C55E]/5 border border-[#22C55E]/10">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Sold</p>
                  <p className="text-lg font-black text-[#22C55E]">{pool.soldQuantity || 0} kg</p>
                </div>
                <div className="rounded-xl p-3 bg-[#eab308]/5 border border-[#eab308]/10">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Remaining</p>
                  <p className="text-lg font-black text-[#eab308]">{pool.remaining} kg</p>
                </div>
              </div>
              

            </div>
          </div>
        )}

        {/* Lock button */}
        {isOwner && isCollectionPhase && (
          <button
            onClick={handleLock}
            className="mt-6 w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 border border-[#eab308]/20 bg-[#eab308]/10 text-[#eab308] cursor-pointer hover:bg-[#eab308] hover:text-[#0F172A] hover:border-[#eab308]"
          >
            🔒 Lock Pool
          </button>
        )}
      </div>

      {/* Contributors Table */}
      <div className="mb-10">
        <h2 className="text-lg font-extrabold text-white mb-5 flex items-center gap-3 uppercase tracking-wider">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">👨‍🌾</span>
          Pool Contributors
        </h2>

        {!pool.contributors || pool.contributors.length === 0 ? (
          <div className="modern-card p-6 text-center">
            <p className="text-gray-500">No contributors yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#22C55E]/10 bg-[#0F172A]/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#22C55E]/10 bg-[#22C55E]/5">
                  <th className="px-5 py-3.5 text-left font-extrabold text-xs uppercase tracking-wider text-gray-400">Farmer</th>
                  <th className="px-5 py-3.5 text-left font-extrabold text-xs uppercase tracking-wider text-gray-400">Mobile</th>
                  <th className="px-5 py-3.5 text-right font-extrabold text-xs uppercase tracking-wider text-gray-400">Qty (kg)</th>
                  <th className="px-5 py-3.5 text-right font-extrabold text-xs uppercase tracking-wider text-gray-400">Rate</th>
                  <th className="px-5 py-3.5 text-right font-extrabold text-xs uppercase tracking-wider text-gray-400">Profit</th>
                </tr>
              </thead>
              <tbody>
                {pool.contributors.map((c, idx) => (
                  <tr
                    key={c.id}
                    className="transition-colors border-b border-[#22C55E]/5"
                    style={{
                      background: idx % 2 === 0 ? "rgba(15,23,42,0.4)" : "transparent"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "rgba(15,23,42,0.4)" : "transparent"}
                  >
                    <td className="px-5 py-3.5 font-semibold text-white">{c.farmerName}</td>
                    <td className="px-5 py-3.5 text-gray-400">{c.mobile}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-white">{c.quantity}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-[#22C55E]">₹{c.price}</td>
                    <td className="px-5 py-3.5 text-right font-black text-[#22C55E]">₹{(c.quantity * c.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#22C55E]/20 bg-[#22C55E]/5">
                  <td colSpan="2" className="px-5 py-4 font-bold text-white">Total: {pool.contributors.length} farmers</td>
                  <td className="px-5 py-4 text-right font-black text-white">{pool.contributors.reduce((s, c) => s + c.quantity, 0)} kg</td>
                  <td className="px-5 py-4 text-right text-gray-500">-</td>
                  <td className="px-5 py-4 text-right font-black text-[#22C55E]">₹{pool.contributors.reduce((s, c) => s + c.quantity * c.price, 0).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/my-pools")}
        className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border border-[#22C55E]/15 bg-[#22C55E]/5 text-gray-400 hover:text-white hover:border-[#22C55E] active:scale-95 cursor-pointer"
      >
        ← Back to My Pools
      </button>
    </Layout>
  );
};

export default PoolDetails;
