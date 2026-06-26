import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { toast } from "react-toastify";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Mobile must be 10 digits";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handling Login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ mobile, password });
      const data = res.data;

      login(data);
      toast.success("Login Successful!");

      if (data.user.role === "farmer") {
        navigate("/farmer");
      } else {
        navigate("/buyer");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
    <div className="flex items-center justify-center min-h-screen px-4" style={{ background: "#0F172A" }}>
      {/* Decorative background glow */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34, 197, 94, 0.04) 0%, transparent 70%)" }}
      />

      <div
        className="w-full max-w-md relative z-10 modern-card p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(34,197,94,0.2)]">🌾</span>
            <span className="text-xl font-black text-white tracking-tight">
              Kishan <span style={{ color: "#22C55E" }}>Saathi</span>
            </span>
          </Link>
          <h2 className="text-3xl font-black mb-2" style={{ color: "#F8FAFC" }}>
            Welcome Back
          </h2>
          <p className="text-sm" style={{ color: "#64748b" }}>Login to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: "#94a3b8" }}>
              Mobile Number
            </label>
            <input
              type="tel"
              maxLength="10"
              style={inputStyle(errors.mobile)}
              placeholder="10-digit mobile number"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value.replace(/\D/g, ""));
                if (errors.mobile) setErrors({ ...errors, mobile: "" });
              }}
              onFocus={(e) => handleInputFocus(e, errors.mobile)}
              onBlur={(e) => handleInputBlur(e, errors.mobile)}
            />
            {errors.mobile && (
              <p className="text-xs mt-1.5 font-semibold" style={{ color: "#ef4444" }}>⚠️ {errors.mobile}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: "#94a3b8" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                style={inputStyle(errors.password)}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
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
            {errors.password && (
              <p className="text-xs mt-1.5 font-semibold" style={{ color: "#ef4444" }}>⚠️ {errors.password}</p>
            )}
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center mt-6 text-sm" style={{ color: "#94a3b8" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold transition-colors hover:underline"
            style={{ color: "#22C55E" }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;