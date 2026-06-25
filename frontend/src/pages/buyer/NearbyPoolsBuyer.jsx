import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../services/api";
import { toast } from "react-toastify";
import BuyerPoolCard from "../../components/BuyerPoolCard";

const NearbyPoolsBuyer = () => {
  const [pools, setPools] = useState([]);
  const [filteredPools, setFilteredPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [searchCrop, setSearchCrop] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [radius, setRadius] = useState("50");
  const [sortBy, setSortBy] = useState("distance");

  const fetchPools = (rad = radius) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });
          const res = await API.get(`/pools/buyer/nearby?lat=${latitude}&lng=${longitude}&radius=${rad}`);
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
    fetchPools();
  }, []);

  useEffect(() => {
    let result = [...pools];
    if (searchCrop.trim()) result = result.filter(p => p.cropName.toLowerCase().includes(searchCrop.toLowerCase()));
    if (minPrice) result = result.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= parseFloat(maxPrice));
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "distance") result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    else if (sortBy === "quantity") result.sort((a, b) => b.remaining - a.remaining);
    setFilteredPools(result);
  }, [searchCrop, minPrice, maxPrice, sortBy, pools]);

  const handleRadiusChange = (r) => {
    setRadius(r);
    fetchPools(r);
  };

  const handleClearFilters = () => {
    setSearchCrop("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("distance");
    setRadius("50");
    fetchPools("50");
  };

  const handleOrderPlaced = () => fetchPools();

  const inputStyle = {
    background: "rgba(15, 23, 42, 0.85)",
    border: "1px solid rgba(34, 197, 94, 0.15)",
    color: "#F8FAFC"
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-white">🔍 Discover Pools</h1>
        <p className="text-gray-400">
          {location ? `Showing pools near (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})` : "Accessing location..."}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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
                <label className="block text-sm font-semibold mb-2 text-gray-300">₹ Min Price</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full p-3 rounded-xl placeholder-slate-600 focus:outline-none transition-all duration-300 border focus:border-[#22C55E]"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">₹ Max Price</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full p-3 rounded-xl placeholder-slate-600 focus:outline-none transition-all duration-300 border focus:border-[#22C55E]"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">📍 Radius</label>
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
                  <option value="price-low">Price: Low→High</option>
                  <option value="price-high">Price: High→Low</option>
                  <option value="quantity">Qty Available</option>
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
              <p className="text-gray-500 mb-4">
                {pools.length === 0 ? "No locked pools available near you" : "Try adjusting your search or filter criteria"}
              </p>
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
              <div className="mb-6">
                <p className="text-gray-400">Found <span className="font-bold text-[#22C55E]">{filteredPools.length}</span> of {pools.length} available pools</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPools.map(pool => (
                  <BuyerPoolCard key={pool.id} pool={pool} onOrderPlaced={handleOrderPlaced} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default NearbyPoolsBuyer;