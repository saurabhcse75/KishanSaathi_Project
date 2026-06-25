import { useEffect, useState, useContext } from "react";
import Layout from "../../components/Layout";
import API from "../../services/api";
import { toast } from "react-toastify";
import JoinButton from "./JoinButton";
import { AuthContext } from "../../context/AuthContext";

const NearbyPools = () => {
  const { auth } = useContext(AuthContext);
  const [pools, setPools] = useState([]);
  const [filteredPools, setFilteredPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [searchCrop, setSearchCrop] = useState("");
  const [maxDistance, setMaxDistance] = useState("50");
  const [sortBy, setSortBy] = useState("distance");
  const [radius, setRadius] = useState("50");

  const fetchPools = (rad = radius) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });
          const res = await API.get(`/pools/nearby?lat=${latitude}&lng=${longitude}&radius=${rad}`);
          setPools(res.data || []);
          setFilteredPools(res.data || []);
        } catch (err) {
          toast.error("Failed to fetch pools");
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.error("Please enable location access");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    let result = [...pools];
    if (searchCrop.trim()) result = result.filter(p => p.cropName.toLowerCase().includes(searchCrop.toLowerCase()));
    if (maxDistance) result = result.filter(p => p.distance <= parseFloat(maxDistance));
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "distance") result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    else if (sortBy === "remaining") result.sort((a, b) => (b.targetQuantity - b.currentQuantity) - (a.targetQuantity - a.currentQuantity));
    else if (sortBy === "progress") result.sort((a, b) => (b.currentQuantity / b.targetQuantity) - (a.currentQuantity / a.targetQuantity));
    setFilteredPools(result);
  }, [searchCrop, maxDistance, sortBy, pools]);

  useEffect(() => {
    fetchPools();
  }, []);

  const handleRadiusChange = (r) => {
    setRadius(r);
    setMaxDistance(r);
    fetchPools(r);
  };

  const handleClearFilters = () => {
    setSearchCrop("");
    setSortBy("distance");
    setMaxDistance("50");
    setRadius("50");
    fetchPools("50");
  };

  const handlePoolJoined = () => fetchPools();

  // Circular progress ring helper with glowing gradient
  const Ring = ({ pct, size = 52, stroke = 4 }) => {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    return (
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90 filter drop-shadow-[0_0_3px_rgba(34,197,94,0.2)]">
          <defs>
            <linearGradient id="nearbyPoolsProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(34, 197, 94, 0.08)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#nearbyPoolsProgressGrad)" strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c - (Math.min(pct, 100) / 100) * c} className="transition-all duration-1000" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#22C55E]">{pct.toFixed(0)}%</span>
      </div>
    );
  };

  const inputStyle = {
    background: "rgba(15, 23, 42, 0.85)",
    border: "1px solid rgba(34, 197, 94, 0.15)",
    color: "#F8FAFC"
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-white">🌾 Join Open Pools</h1>
        <p className="text-gray-400">
          {location ? `Showing pools near (${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)})` : "Accessing location..."}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-lg text-gray-400">Loading nearby pools...</p>
        </div>
      ) : (
        <>
          {/* Filters Card */}
          <div className="modern-card p-6 mb-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">🌾 Crop Name</label>
                <input
                  type="text"
                  placeholder="Search crop..."
                  value={searchCrop}
                  onChange={(e) => setSearchCrop(e.target.value)}
                  className="w-full p-3 rounded-xl placeholder-slate-600 focus:outline-none transition-all duration-300 border focus:border-[#22C55E]"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">📍 Radius (km)</label>
                <select
                  value={radius}
                  onChange={(e) => handleRadiusChange(e.target.value)}
                  className="w-full p-3 rounded-xl focus:outline-none transition-all duration-300 border focus:border-[#22C55E]"
                  style={inputStyle}
                >
                  <option value="10">10 km</option>
                  <option value="25">25 km</option>
                  <option value="50">50 km</option>
                  <option value="100">100 km</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">📊 Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 rounded-xl focus:outline-none transition-all duration-300 border focus:border-[#22C55E]"
                  style={inputStyle}
                >
                  <option value="distance">Distance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="remaining">Most Needed</option>
                  <option value="progress">Nearly Complete</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer border border-[#22C55E]/15 bg-[#22C55E]/5 text-gray-400 hover:text-white hover:border-[#22C55E]"
              >
                ✕ Clear Filters
              </button>
            </div>
          </div>

          {filteredPools.length === 0 ? (
            <div className="modern-card p-8 text-center flex flex-col items-center">
              <p className="text-2xl mb-2 text-white">🔍 No pools found</p>
              <p className="text-gray-500 mb-4">{pools.length === 0 ? "No open pools available near you" : "Try adjusting your search or filter criteria"}</p>
              {pools.length > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="mt-2 px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer text-[#0F172A]"
                  style={{ background: "#22C55E" }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-400">Found <span className="font-bold text-[#22C55E]">{filteredPools.length}</span> of {pools.length} available pools</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPools.map((pool) => {
                  const remaining = pool.targetQuantity - pool.currentQuantity;
                  const pct = (pool.currentQuantity / pool.targetQuantity) * 100;
                  const isOwner = auth?.user?.id === pool.createdBy;

                  return (
                    <div
                      key={pool.id}
                      className="modern-card modern-card-hover group relative p-5 flex flex-col justify-between overflow-hidden"
                    >
                      <div>
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-[#22C55E] transition-colors">{pool.cropName}</h3>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-green-500 text-[#0F172A] font-black tracking-wider shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                                {pool.status || "OPEN"}
                              </span>
                              <span className="text-[10px] text-gray-500 font-semibold">{isOwner ? "(Your Pool)" : ""}</span>
                            </div>
                          </div>
                          {pct >= 75 && (
                            <span className="text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-500">Almost Full</span>
                          )}
                        </div>

                        {/* Creator Info */}
                        <div className="mb-4 p-3 rounded-xl border border-[#22C55E]/10 bg-[#22C55E]/5 flex flex-col gap-2.5">
                          <div>
                            <p className="text-[9px] font-bold uppercase text-gray-500 leading-none mb-1">Pool Creator</p>
                            <p className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                              <span className="text-xs">👨‍🌾</span> {pool.creatorName || "Farmer"}
                            </p>
                          </div>
                          {pool.creatorMobile && (
                            <div>
                              <p className="text-[9px] font-bold uppercase text-gray-500 leading-none mb-1">Mobile</p>
                              <p className="text-xs text-gray-400 font-semibold flex items-center gap-1.5 leading-none">
                                <span className="text-xs">📞</span> {pool.creatorMobile}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-2xl font-black text-[#22C55E]">₹{pool.price}</span>
                          <span className="text-xs text-[#64748b]">/kg</span>
                        </div>

                        {/* Progress Ring + Info */}
                        <div className="flex items-center gap-4 mb-4">
                          <Ring pct={pct} />
                          <div className="flex-grow space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Current</span>
                              <span className="font-bold text-[#22C55E]">{pool.currentQuantity} kg</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Target</span>
                              <span className="font-bold text-white">{pool.targetQuantity} kg</span>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full overflow-hidden mb-4" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.08)" }}>
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              background: "linear-gradient(90deg, #16A34A, #22C55E)",
                              boxShadow: "0 0 10px rgba(34,197,94,0.35)",
                            }}
                          />
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="rounded-xl p-2.5 bg-[#22C55E]/5 border border-[#22C55E]/10">
                            <p className="text-[9px] font-bold uppercase text-gray-500">Needed</p>
                            <p className="text-sm font-black text-[#22C55E]">{remaining} kg</p>
                          </div>
                          <div className="rounded-xl p-2.5 bg-[#22C55E]/5 border border-[#22C55E]/10">
                            <p className="text-[9px] font-bold uppercase text-gray-500">Distance</p>
                            <p className="text-sm font-black text-gray-300">{pool.distance ? `${pool.distance.toFixed(1)} km` : "N/A"}</p>
                          </div>
                        </div>
                      </div>

                      {isOwner ? (
                        <div className="w-full py-2.5 rounded-xl text-center font-bold text-xs border border-[#22C55E]/10 bg-[#22C55E]/5 text-gray-400">
                          👤 You Created This Pool
                        </div>
                      ) : (
                        <JoinButton poolId={pool.id} onJoined={handlePoolJoined} />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default NearbyPools;
