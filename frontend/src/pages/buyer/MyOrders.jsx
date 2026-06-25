import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../services/api";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my");
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusConfig = {
    PENDING: { color: "#eab308", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)", dot: "#eab308" },
    ACCEPTED: { color: "#22C55E", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", dot: "#22C55E" },
    REJECTED: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", dot: "#ef4444" },
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-white">My Orders</h1>
        <p className="text-gray-400">Track all your placed orders</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-lg text-gray-400">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="modern-card p-8 text-center">
          <p className="text-gray-500 mb-2">No orders placed yet</p>
          <p className="text-sm text-gray-600">Start by exploring nearby pools to place orders.</p>
        </div>
      ) : (
        <>
          <p className="mb-6 text-gray-400">
            Total Orders: <span className="font-extrabold text-[#22C55E]">{orders.length}</span>
          </p>

          <div className="space-y-4">
            {orders.map((order) => {
              const sc = statusConfig[order.status] || statusConfig.PENDING;
              return (
                <div
                  key={order.id}
                  className="modern-card modern-card-hover group relative p-5 transition-all duration-300"
                  style={{
                    borderLeft: `4px solid ${sc.color}`,
                    borderColor: sc.border
                  }}
                >
                  {/* Top info row */}
                  <div className="grid md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-0.5">Crop</p>
                      <p className="text-lg font-bold text-white">{order.cropName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-0.5">Order Details</p>
                      <p className="text-sm text-white font-medium">Qty: <span className="font-extrabold text-white">{order.quantity} kg</span></p>
                      <p className="text-sm text-white font-medium">Rate: <span className="font-extrabold text-[#22C55E]">₹{order.price}/kg</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-0.5">Status</p>
                      <div className="mt-1">
                        <span
                          className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border inline-flex items-center gap-1.5"
                          style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold mt-1.5">
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {/* Divider line */}
                  <div className="my-4 border-t border-[#22C55E]/5" />

                  {/* Bottom info row */}
                  <div className="grid md:grid-cols-4 gap-6 items-center">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-0.5">Pool Owner</p>
                      <p className="font-bold text-white text-sm">{order.farmerName}</p>
                      <p className="text-xs text-gray-400 mt-1 font-semibold flex items-center gap-1">
                        <span>📞</span> {order.farmerMobile}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-0.5">Pickup Location</p>
                      <p className="text-xs text-gray-300 font-semibold flex items-center gap-1">
                        <span>📍</span> {order.pickupLocation || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-0.5">Total Contributors</p>
                      <p className="text-base font-extrabold text-white">{order.totalContributors} Farmers</p>
                    </div>

                    {order.status === "ACCEPTED" ? (
                      <div className="rounded-xl p-3 border border-[#22C55E]/15 bg-[#22C55E]/5">
                        <p className="text-[9px] font-extrabold uppercase tracking-wider text-gray-500 mb-0.5">Amount to Pay</p>
                        <p className="text-xl font-black text-[#22C55E]">₹{order.totalAmount.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{order.quantity} kg × ₹{order.price}</p>
                      </div>
                    ) : (
                      <div className="rounded-xl p-3 border border-[#22C55E]/5 bg-[#22C55E]/2 select-none">
                        <p className="text-[9px] font-extrabold uppercase tracking-wider text-gray-600 mb-0.5">Estimated Value</p>
                        <p className="text-xl font-black text-gray-400">₹{(order.quantity * order.price).toLocaleString()}</p>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">{order.quantity} kg × ₹{order.price}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Layout>
  );
};

export default MyOrders;