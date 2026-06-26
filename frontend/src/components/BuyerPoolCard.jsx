import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const BuyerPoolCard = ({ pool, onOrderPlaced }) => {
  const [qty, setQty] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    if (!qty || qty <= 0) return toast.error("Enter valid quantity");
    if (Number(qty) > Number(pool.remaining)) return toast.error("Exceeds available quantity");

    try {
      setLoading(true);
      await API.post("/orders", { poolId: pool.id, quantity: Number(qty) });
      toast.success("Order Requested");
      setQty("");
      if (onOrderPlaced) onOrderPlaced();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error placing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modern-card modern-card-hover group relative p-5 flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold group-hover:text-[#22C55E] text-[#F8FAFC] transition-colors">
            {pool.cropName}
          </h3>
          {pool.remaining === 0 && (
            <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full border border-red-500/20 bg-red-500/10 text-red-500">Sold Out</span>
          )}
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="rounded-xl p-2.5 bg-[#22C55E]/5 border border-[#22C55E]/10">
            <p className="text-[9px] font-bold uppercase text-gray-500 mb-0.5">Price</p>
            <p className="text-sm font-black text-[#22C55E]">₹{pool.price}</p>
          </div>
          <div className="rounded-xl p-2.5 bg-[#22C55E]/5 border border-[#22C55E]/10">
            <p className="text-[9px] font-bold uppercase text-gray-500 mb-0.5">Available</p>
            <p className="text-sm font-black text-white">{pool.remaining} kg</p>
          </div>
          <div className="rounded-xl p-2.5 bg-[#22C55E]/5 border border-[#22C55E]/10">
            <p className="text-[9px] font-bold uppercase text-gray-500 mb-0.5">Distance</p>
            <p className="text-sm font-black text-gray-300">
              {pool.distance ? `${pool.distance.toFixed(1)} km` : "N/A"}
            </p>
          </div>
        </div>

        {/* Owner Info Block */}
        <div className="mb-3 p-3 rounded-xl border border-[#22C55E]/10 bg-[#22C55E]/5 flex flex-col gap-2.5">
          <div>
            <p className="text-[9px] font-bold uppercase text-gray-500 leading-none mb-1">Pool Owner</p>
            <p className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
              <span>👨‍🌾</span> {pool.ownerName || "Farmer"}
            </p>
          </div>
          {pool.ownerMobile && (
            <div>
              <p className="text-[9px] font-bold uppercase text-gray-500 leading-none mb-1">Mobile</p>
              <p className="text-xs text-gray-400 font-semibold flex items-center gap-1.5 leading-none">
                <span>📞</span> {pool.ownerMobile}
              </p>
            </div>
          )}
        </div>

        {/* Pickup Location */}
        {pool.pickupLocation && (
          <div className="mb-4 p-3 rounded-xl border border-[#22C55E]/10 bg-[#0F172A]/40">
            <p className="text-[9px] font-bold uppercase text-gray-500 mb-1">Pickup Location</p>
            <p className="text-xs text-gray-300 flex items-center gap-1.5 font-semibold">
              <span>📍</span> {pool.pickupLocation}
            </p>
          </div>
        )}
      </div>

      {pool.remaining === 0 ? (
        <div className="py-3 rounded-xl text-center border border-red-500/15 bg-red-500/5">
          <p className="text-sm font-bold text-red-400">Sold Out</p>
        </div>
      ) : (
        <div>
          <input
            type="number"
            placeholder="Enter quantity (kg)"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-white placeholder-slate-600 mb-3 bg-[#0F172A]/80 border border-[#22C55E]/15 focus:outline-none focus:border-[#22C55E] focus:shadow-[0_0_10px_rgba(34,197,94,0.15)] transition-all duration-300"
            min="1"
            max={pool.remaining}
          />

          {qty && qty > 0 && (
            <div className="mb-3 p-3 rounded-xl border border-[#22C55E]/15 bg-[#22C55E]/5">
              <p className="text-[9px] uppercase font-bold tracking-wider text-gray-500 mb-0.5">Total Amount</p>
              <p className="text-xl font-black text-[#22C55E]">₹{(Number(qty) * pool.price).toLocaleString()}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">{qty} kg × ₹{pool.price}/kg</p>
            </div>
          )}

          <button
            onClick={handleOrder}
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 disabled:opacity-40 cursor-pointer text-[#0F172A]"
            style={{ background: "#22C55E", boxShadow: "0 4px 12px rgba(34,197,94,0.2)" }}
            onMouseEnter={e => { if (!loading) e.target.style.background = "#16A34A"; }}
            onMouseLeave={e => e.target.style.background = "#22C55E"}
          >
            {loading ? "Processing..." : "Request Order"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyerPoolCard;