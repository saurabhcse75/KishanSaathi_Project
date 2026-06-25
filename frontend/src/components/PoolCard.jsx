import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const PoolCard = ({ pool, type }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const remaining = pool.remaining || 0;
  const currentQty = pool.currentQuantity || pool.current_quantity || 0;
  const targetQty = pool.targetQuantity || pool.target_quantity || 0;
  const soldQty = pool.soldQuantity || 0;

  let percent = 0;
  if (pool.status === "OPEN") {
    percent = targetQty > 0 ? (currentQty / targetQty) * 100 : 0;
  } else if (pool.status === "LOCKED" || pool.status === "SELLING" || pool.status === "SOLD") {
    percent = currentQty > 0 ? (soldQty / currentQty) * 100 : 0;
  }

  // Circular progress ring configuration
  const size = 52, stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference;

  const handleClick = () => navigate(`/pool/${pool.id}`);

  const handleLock = async (e) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await API.put(`/pools/${pool.id}/lock`);
      toast.success("Pool locked successfully! 🔒");
      navigate(`/pool/${pool.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to lock pool");
    } finally {
      setLoading(false);
    }
  };

  const isOwner = auth?.user?.id === pool.created_by;
  const isCreated = type === "created";
  const isJoined = type === "joined";

  const statusColors = {
    OPEN: { color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
    LOCKED: { color: "#eab308", bg: "rgba(234,179,8,0.1)" },
    SELLING: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
    SOLD: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  };
  const sc = statusColors[pool.status] || statusColors.OPEN;

  return (
    <div
      onClick={handleClick}
      className="modern-card modern-card-hover group relative p-5 cursor-pointer flex flex-col justify-between"
      style={{
        border: `1px solid ${isCreated ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.12)"}`,
      }}
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold group-hover:text-[#22C55E] text-[#F8FAFC] transition-colors">
              {pool.cropName || pool.crop_name}
            </h3>
            <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1.5 inline-block" style={{ background: isCreated ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.06)", color: isCreated ? "#22C55E" : "#4ade80" }}>
              {isCreated ? "Created" : "Joined"}
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border" style={{ background: sc.bg, color: sc.color, borderColor: `${sc.color}30` }}>
            {pool.status}
          </span>
        </div>

        {/* Price Tag */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-black text-[#22C55E]">₹{pool.price}</span>
          <span className="text-xs text-[#64748b]">/kg</span>
        </div>

        {/* Progress Grid */}
        <div className="flex items-center gap-4 mb-4">
          {/* Ring */}
          <div className="relative flex-shrink-0">
            <svg width={size} height={size} className="transform -rotate-90 filter drop-shadow-[0_0_3px_rgba(34,197,94,0.2)]">
              <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(34,197,94,0.08)" strokeWidth={stroke} />
              <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#22C55E" strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#22C55E]">
              {percent.toFixed(0)}%
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-1">
            {pool.status === "OPEN" ? (
              <>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748b]">Current</span>
                  <span className="font-bold text-[#22C55E]">{currentQty} kg</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748b]">Target</span>
                  <span className="font-bold text-[#F8FAFC]">{targetQty} kg</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748b]">Remaining</span>
                  <span className="font-bold text-[#eab308]">{remaining} kg</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748b]">Stock</span>
                  <span className="font-bold text-[#F8FAFC]">{currentQty} kg</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748b]">Sold</span>
                  <span className="font-bold text-[#22C55E]">{soldQty} kg</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748b]">Remaining</span>
                  <span className="font-bold text-[#eab308]">{currentQty - soldQty} kg</span>
                </div>
              </>
            )}
          </div>
        </div>



        {/* Joined contribution details */}
        {isJoined && (
          <div className="space-y-2 mt-3">
            <div className="p-2.5 rounded-xl border border-[#22C55E]/10 bg-[#22C55E]/5">
              <p className="text-xs text-[#22C55E]">
                ✓ Your Contribution: <span className="font-bold">{pool.contributed_quantity || pool.quantity}</span> kg
              </p>
            </div>
            {(pool.status === "SELLING" || pool.status === "SOLD") && soldQty > 0 && (
              <div className="p-2.5 rounded-xl border border-[#22C55E]/20 bg-[#22C55E]/10">
                <p className="text-xs font-bold text-[#22C55E]">
                  💰 Profit: ₹{((pool.contributed_quantity || pool.quantity) * pool.price).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {isCreated && pool.status === "OPEN" && isOwner && (
        <button
          onClick={handleLock}
          disabled={loading}
          className="w-full mt-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 border border-[#eab308]/20 bg-[#eab308]/10 text-[#eab308] cursor-pointer hover:bg-[#eab308] hover:text-[#0F172A] hover:border-[#eab308]"
        >
          {loading ? "Locking..." : "🔒 Lock Pool"}
        </button>
      )}

      {isCreated && pool.status !== "OPEN" && isOwner && (
        <div className="mt-4 p-2.5 rounded-xl text-center border border-[#22C55E]/10 bg-[#22C55E]/5">
          <p className="text-xs font-bold text-[#22C55E]">✓ Pool is {pool.status}</p>
        </div>
      )}
    </div>
  );
};

export default PoolCard;