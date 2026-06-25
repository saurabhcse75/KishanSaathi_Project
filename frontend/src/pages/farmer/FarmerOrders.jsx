import { useEffect, useState, useContext } from "react";
import API from "../../services/api";
import Layout from "../../components/Layout";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const FarmerOrders = () => {
  const { auth } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      if (auth?.user?.id) {
        const res = await API.get("/orders/farmer");
        setOrders(res.data);
      }
    } catch (err) {
      toast.error("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [auth?.user?.id]);

  const handleAccept = async (orderId) => {
    try {
      await API.put(`/orders/${orderId}/accept`);
      toast.success("Order Accepted ✅");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error accepting order");
    }
  };

  const handleReject = async (orderId) => {
    try {
      await API.put(`/orders/${orderId}/reject`);
      toast.success("Order Rejected ❌");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error rejecting order");
    }
  };

  const statusConfig = {
    PENDING: { color: "#eab308", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)", dot: "#eab308" },
    ACCEPTED: { color: "#22C55E", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", dot: "#22C55E" },
    REJECTED: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", dot: "#ef4444" },
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-white">My Pool Orders</h1>
        <p className="text-gray-400">Manage all buyer requests for your created pools</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-lg text-gray-400">Loading your orders...</p>
        </div>
      ) : (
        <div className="mb-6">
          {orders.length === 0 ? (
            <div className="modern-card p-8 text-center">
              <p className="text-gray-500 mb-2">No buyer orders yet</p>
              <p className="text-sm text-gray-600">When buyers place orders on your locked pools, they will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const sc = statusConfig[order.status] || statusConfig.PENDING;
                return (
                  <div
                    key={order.id}
                    className="modern-card modern-card-hover relative p-5 transition-all duration-300"
                    style={{
                      borderLeft: `4px solid ${sc.color}`,
                      borderColor: sc.border
                    }}
                  >
                    <div className="grid md:grid-cols-5 gap-6 items-center">
                      {/* Pool details */}
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-0.5">Pool Details</p>
                        <p className="font-extrabold text-lg text-white leading-tight">{order.cropName}</p>
                        <p className="text-xs text-gray-400 mt-1 font-semibold">Pool Status: {order.poolStatus}</p>
                      </div>

                      {/* Buyer details */}
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-0.5">Buyer</p>
                        <p className="font-bold text-white text-base leading-tight">{order.buyerName}</p>
                        <p className="text-xs text-gray-400 mt-1 font-semibold flex items-center gap-1">
                          <span>📞</span> {order.buyerMobile}
                        </p>
                      </div>

                      {/* Quantity details */}
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-0.5">Quantity</p>
                        <p className="text-2xl font-black text-white tracking-tight">
                          {order.quantity.toLocaleString()} kg
                        </p>
                        <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                          Rate: ₹{order.poolPrice}/kg
                        </p>
                      </div>
                      
                      {/* Amount details */}
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-0.5">Total Amount</p>
                        <p className="text-2xl font-black text-[#22C55E] tracking-tight">
                          ₹{(order.quantity * order.poolPrice).toLocaleString()}
                        </p>
                      </div>

                      {/* Status and Action Buttons */}
                      <div className="md:text-right flex flex-col md:items-end justify-between h-full gap-3">
                        <div>
                          <span
                            className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border inline-flex items-center gap-1.5"
                            style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                            {order.status}
                          </span>
                        </div>

                        {order.status === "PENDING" && (
                          <div className="flex gap-2 w-full md:w-auto justify-start md:justify-end">
                            <button
                              onClick={() => handleAccept(order.id)}
                              className="px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer active:scale-95 border border-[#22C55E]/20 bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E] hover:text-[#0F172A] hover:border-[#22C55E]"
                            >
                              ✓ Accept
                            </button>
                            <button
                              onClick={() => handleReject(order.id)}
                              className="px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer active:scale-95 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500"
                            >
                              ✕ Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default FarmerOrders;
