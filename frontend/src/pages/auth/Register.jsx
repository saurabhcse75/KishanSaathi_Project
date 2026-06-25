import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
 
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "farmer",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s]*$/.test(form.name)) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    if (!form.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(form.mobile)) {
      newErrors.mobile = "Mobile must be exactly 10 digits";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])/.test(form.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "mobile") {
      setForm({ ...form, [name]: value.replace(/\D/g, "") });
    } else {
      setForm({ ...form, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(form);
      const data = res.data;

      login(data);
      
      toast.success(`✅ Welcome ${form.name}! Registration successful.`);

      if (data.user.role === "farmer") {
        navigate("/farmer");
      } else {
        navigate("/buyer");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    background: "rgba(15, 23, 42, 0.85)",
    border: `1px solid ${hasError ? "rgba(239, 68, 68, 0.5)" : "rgba(34, 197, 94, 0.15)"}`,
    color: "#F8FAFC",
    fontSize: "14px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    outline: "none",
  });

  const handleInputFocus = (e, hasError) => {
    if (hasError) {
      e.target.style.borderColor = "rgba(239, 68, 68, 0.7)";
      e.target.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.15)";
    } else {
      e.target.style.borderColor = "#22C55E";
      e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.2), 0 0 15px rgba(34, 197, 94, 0.1)";
    }
  };

  const handleInputBlur = (e, hasError) => {
    e.target.style.borderColor = hasError ? "rgba(239, 68, 68, 0.5)" : "rgba(34, 197, 94, 0.15)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8" style={{ background: "#0F172A" }}>
      {/* Decorative background glow */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34, 197, 94, 0.04) 0%, transparent 70%)" }}
      />

      <div className="w-full max-w-md relative z-10 modern-card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(34,197,94,0.2)]">🌾</span>
            <span className="text-xl font-black text-white tracking-tight">
              Kishan <span style={{ color: "#22C55E" }}>Saathi</span>
            </span>
          </Link>
          <h2 className="text-3xl font-black mb-2" style={{ color: "#F8FAFC" }}>
            Create Account
          </h2>
          <p className="text-sm" style={{ color: "#64748b" }}>Join KishanSaathi today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: "#94a3b8" }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              style={inputStyle(errors.name)}
              value={form.name}
              onChange={handleChange}
              onFocus={(e) => handleInputFocus(e, errors.name)}
              onBlur={(e) => handleInputBlur(e, errors.name)}
            />
            {errors.name && <p className="text-xs mt-1.5 font-semibold" style={{ color: "#ef4444" }}>⚠️ {errors.name}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: "#94a3b8" }}>
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile"
              maxLength="10"
              placeholder="10-digit mobile number"
              style={inputStyle(errors.mobile)}
              value={form.mobile}
              onChange={handleChange}
              onFocus={(e) => handleInputFocus(e, errors.mobile)}
              onBlur={(e) => handleInputBlur(e, errors.mobile)}
            />
            {errors.mobile && <p className="text-xs mt-1.5 font-semibold" style={{ color: "#ef4444" }}>⚠️ {errors.mobile}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: "#94a3b8" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Min 6 chars with lowercase"
                style={inputStyle(errors.password)}
                value={form.password}
                onChange={handleChange}
                onFocus={(e) => handleInputFocus(e, errors.password)}
                onBlur={(e) => handleInputBlur(e, errors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                style={{ color: "#64748b" }}
                onMouseEnter={e => e.target.style.color = "#94a3b8"}
                onMouseLeave={e => e.target.style.color = "#64748b"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <p className="text-xs mt-1.5 font-semibold" style={{ color: "#ef4444" }}>⚠️ {errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: "#94a3b8" }}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter password"
                style={inputStyle(errors.confirmPassword)}
                value={form.confirmPassword}
                onChange={handleChange}
                onFocus={(e) => handleInputFocus(e, errors.confirmPassword)}
                onBlur={(e) => handleInputBlur(e, errors.confirmPassword)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                style={{ color: "#64748b" }}
                onMouseEnter={e => e.target.style.color = "#94a3b8"}
                onMouseLeave={e => e.target.style.color = "#64748b"}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs mt-1.5 font-semibold" style={{ color: "#ef4444" }}>⚠️ {errors.confirmPassword}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: "#94a3b8" }}>
              Select Your Role
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 cursor-pointer"
                style={{
                  background: form.role === "farmer" ? "rgba(34, 197, 94, 0.15)" : "rgba(15, 23, 42, 0.6)",
                  border: `1px solid ${form.role === "farmer" ? "#22C55E" : "rgba(34, 197, 94, 0.15)"}`,
                  color: form.role === "farmer" ? "#22C55E" : "#94a3b8",
                  boxShadow: form.role === "farmer" ? "0 0 15px rgba(34, 197, 94, 0.1)" : "none",
                }}
                onClick={() => setForm({ ...form, role: "farmer" })}
              >
                🚜 Farmer
              </button>

              <button
                type="button"
                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 cursor-pointer"
                style={{
                  background: form.role === "buyer" ? "rgba(34, 197, 94, 0.15)" : "rgba(15, 23, 42, 0.6)",
                  border: `1px solid ${form.role === "buyer" ? "#22C55E" : "rgba(34, 197, 94, 0.15)"}`,
                  color: form.role === "buyer" ? "#22C55E" : "#94a3b8",
                  boxShadow: form.role === "buyer" ? "0 0 15px rgba(34, 197, 94, 0.1)" : "none",
                }}
                onClick={() => setForm({ ...form, role: "buyer" })}
              >
                🛒 Buyer
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "#22C55E",
              color: "#0F172A",
              border: "1px solid #22C55E",
              boxShadow: "0 4px 14px rgba(34, 197, 94, 0.25)",
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.target.style.background = "#16A34A";
                e.target.style.boxShadow = "0 8px 24px rgba(34, 197, 94, 0.4)";
              }
            }}
            onMouseLeave={e => {
              e.target.style.background = "#22C55E";
              e.target.style.boxShadow = "0 4px 14px rgba(34, 197, 94, 0.25)";
            }}
          >
            {loading ? "Creating Account..." : "Register Now"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center mt-6 text-sm" style={{ color: "#94a3b8" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold transition-colors hover:underline"
            style={{ color: "#22C55E" }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;