import { useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

const JoinButton = ({ poolId, onJoined }) => {
  const [qty, setQty] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!qty || Number(qty) <= 0) return toast.error("Enter valid quantity");
    try {
      setLoading(true);
      const res = await API.post("/pools/join", { poolId, quantity: Number(qty) });
      if (res.data?.autoLocked) {
        toast.success("🎉 Pool joined & automatically locked! Target reached! 🔒", { autoClose: 5000 });
      } else {
        toast.success("Joined Pool ✅");
      }
      setQty("");
      if (onJoined) onJoined();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error joining pool");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="number"
        placeholder="Enter quantity (kg)"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl text-white placeholder-slate-500"
        style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(34,197,94,0.15)" }}
        min="1"
        disabled={loading}
      />
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 disabled:opacity-40"
        style={{ background: "#22C55E", color: "#0F172A" }}
        onMouseEnter={e => { if (!loading) e.target.style.background = "#16A34A"; }}
        onMouseLeave={e => e.target.style.background = "#22C55E"}
      >
        {loading ? "Joining..." : "Join Pool"}
      </button>
    </div>
  );
};

export default JoinButton;