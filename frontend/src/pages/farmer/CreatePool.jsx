import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import API from "../../services/api";
import { toast } from "react-toastify";
import { validateCreatePool } from "../../utils/validation";
import { useNavigate } from "react-router-dom";

const CreatePool = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cropName: "", targetQuantity: "", price: "", pickupLocation: "",
    latitude: "", longitude: "", initialQuantity: ""
  });
  const [errorField, setErrorField] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationFetched, setLocationFetched] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({ ...prev, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
        setLocationFetched(true);
        toast.success("Location fetched successfully");
      },
      () => toast.error("Location access denied")
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleSubmit = async () => {
    const error = validateCreatePool(form);
    if (error) {
      setErrorField(error.field);
      setErrorMsg(error.message);
      return toast.error(error.message);
    }
    setErrorField("");
    setErrorMsg("");
    try {
      setLoading(true);
      const pool_id = await API.post("/pools", form);
      toast.success("✅ Pool Created Successfully!");
      navigate(`/pool/${pool_id.data.poolId}`);
      setForm({ cropName: "", targetQuantity: "", price: "", pickupLocation: "", latitude: "", longitude: "", initialQuantity: "" });
      setLocationFetched(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating pool");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    background: "rgba(15, 23, 42, 0.85)",
    border: `1px solid ${errorField === field ? "#ef4444" : "rgba(34, 197, 94, 0.15)"}`,
    color: "#F8FAFC",
  });

  // Progress bar calculation for summary
  const pct = form.targetQuantity && form.initialQuantity
    ? Math.min((Number(form.initialQuantity) / Number(form.targetQuantity)) * 100, 100) : 0;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">🌾 Create New Pool</h1>
          <p className="text-gray-400">Start a new agricultural pool and invite other farmers to contribute</p>
        </div>

        <div className="modern-card p-6 md:p-8 shadow-xl">
          {/* Pool Info Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#F8FAFC]">
              <span className="text-xl text-[#22C55E]">📋</span> Pool Information
            </h2>
            <div className="space-y-5">
              {[
                { name: "cropName", label: "Crop Name *", placeholder: "e.g., Wheat, Rice, Corn", type: "text" },
                { name: "targetQuantity", label: "Target Quantity (kg) *", placeholder: "e.g., 1000", type: "number", hint: "Total quantity you want to collect from all farmers" },
                { name: "initialQuantity", label: "Your Contribution (kg) *", placeholder: "e.g., 200", type: "number", hint: "How much you're contributing to your own pool" },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">{f.label}</label>
                  <input
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    onChange={handleChange}
                    value={form[f.name]}
                    className="w-full px-4 py-3 rounded-xl placeholder-slate-600 focus:outline-none transition-all duration-300"
                    style={inputStyle(f.name)}
                    onFocus={e => e.target.style.borderColor = "#22C55E"}
                    onBlur={e => e.target.style.borderColor = errorField === f.name ? "#ef4444" : "rgba(34, 197, 94, 0.15)"}
                  />
                  {errorField === f.name && <p className="text-sm mt-1.5 text-red-400">⚠️ {errorMsg}</p>}
                  {f.hint && <p className="text-[11px] mt-1 text-gray-500 font-medium">{f.hint}</p>}
                </div>
              ))}

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Price per kg (₹) *</label>
                <div className="flex items-center">
                  <span className="text-xl mr-3 font-bold text-[#22C55E]">₹</span>
                  <input
                    name="price"
                    type="number"
                    placeholder="e.g., 50"
                    onChange={handleChange}
                    value={form.price}
                    className="flex-grow px-4 py-3 rounded-xl placeholder-slate-600 focus:outline-none transition-all duration-300"
                    style={inputStyle("price")}
                    onFocus={e => e.target.style.borderColor = "#22C55E"}
                    onBlur={e => e.target.style.borderColor = errorField === "price" ? "#ef4444" : "rgba(34, 197, 94, 0.15)"}
                  />
                </div>
                {errorField === "price" && <p className="text-sm mt-1.5 text-red-400">⚠️ {errorMsg}</p>}
                <p className="text-[11px] mt-1 text-gray-500 font-medium">Price that buyers will pay per kg</p>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-8 pt-8 border-t border-[#22C55E]/10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#F8FAFC]">
              <span className="text-xl text-[#22C55E]">📍</span> Pickup Location
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Pickup Address *</label>
                <input
                  name="pickupLocation"
                  placeholder="e.g., Village Name, District, State"
                  onChange={handleChange}
                  value={form.pickupLocation}
                  className="w-full px-4 py-3 rounded-xl placeholder-slate-600 focus:outline-none transition-all duration-300"
                  style={inputStyle("pickupLocation")}
                  onFocus={e => e.target.style.borderColor = "#22C55E"}
                  onBlur={e => e.target.style.borderColor = errorField === "pickupLocation" ? "#ef4444" : "rgba(34, 197, 94, 0.15)"}
                />
                {errorField === "pickupLocation" && <p className="text-sm mt-1.5 text-red-400">⚠️ {errorMsg}</p>}
              </div>
              
              <button
                onClick={getLocation}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 border border-[#22C55E]/20 bg-[#22C55E]/5 text-[#22C55E] cursor-pointer hover:bg-[#22C55E]/10"
              >
                📍 {locationFetched ? "✓ Location Coordinates Saved" : "Use My Current Location"}
              </button>
              {locationFetched && <p className="text-xs font-semibold text-[#22C55E]">✓ Your GPS coordinates have been captured</p>}
            </div>
          </div>

          {/* Summary Card with Bar */}
          {form.cropName && form.targetQuantity && form.price && form.initialQuantity && (
            <div className="mb-8 p-5 rounded-2xl border border-[#22C55E]/15 bg-[#22C55E]/5">
              <h3 className="font-bold mb-4 text-[#22C55E] flex items-center gap-2">
                <span>📊</span> Pool Summary
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                {[
                  { label: "Crop", value: form.cropName },
                  { label: "Total Target", value: `${form.targetQuantity} kg` },
                  { label: "Your Contribution", value: `${form.initialQuantity} kg` },
                  { label: "Price per kg", value: `₹${form.price}/kg` },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-gray-500 font-semibold text-xs">{item.label}</p>
                    <p className="font-bold text-white text-base mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              
              {/* Contribution percentage preview */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-bold">
                  <span className="text-gray-400">Your contribution vs target</span>
                  <span className="text-[#22C55E]">{pct.toFixed(0)}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: "linear-gradient(90deg, #16A34A, #22C55E)",
                      boxShadow: "0 0 10px rgba(34,197,94,0.35)",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-6 border-t border-[#22C55E]/10">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-extrabold text-lg transition-all duration-300 active:scale-95 disabled:opacity-40 cursor-pointer text-[#0F172A]"
              style={{
                background: "#22C55E",
                boxShadow: "0 8px 24px rgba(34,197,94,0.25)"
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = "#16A34A"; }}
              onMouseLeave={e => e.target.style.background = "#22C55E"}
            >
              {loading ? "Creating..." : "🌱 Create Pool"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePool;