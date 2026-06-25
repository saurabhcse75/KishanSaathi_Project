import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SocialIcons from "./SocialIcons";

const Layout = ({ children }) => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const [poolsMenuOpen, setPoolsMenuOpen] = useState(() => {
    return location.pathname === "/my-pools";
  });

  useEffect(() => {
    if (location.pathname === "/my-pools") {
      setPoolsMenuOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-4 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center gap-3 border ${
      isActive(path)
        ? "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20 shadow-[0_0_15px_rgba(34,197,94,0.06)]"
        : "text-[#94a3b8] hover:text-[#F8FAFC] hover:bg-[#22C55E]/5 hover:border-[#22C55E]/10 border-transparent"
    }`;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#0F172A" }}>

      <header className="sticky top-0 z-50 px-6 py-4 backdrop-blur-xl border-b border-[#22C55E]/10" style={{ background: "rgba(15, 23, 42, 0.85)" }}>
        <div className="flex justify-between items-center w-full">
          
          {/* Left: Sidebar Toggle & App Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 font-bold text-lg active:scale-95 cursor-pointer"
              title={sidebarOpen ? "Collapse Navigation" : "Expand Navigation"}
              style={{
                background: "#22C55E",
                color: "#0F172A",
                boxShadow: "0 4px 14px rgba(34,197,94,0.25)"
              }}
              onMouseEnter={e => e.target.style.background = "#16A34A"}
              onMouseLeave={e => e.target.style.background = "#22C55E"}
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>

            <Link to={auth?.user?.role === "farmer" ? "/farmer" : "/buyer"} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(34,197,94,0.2)]">🌾</span>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Kishan <span className="text-[#22C55E]">Saathi</span>
                </h1>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#64748b]">Connected Agriculture</p>
              </div>
            </Link>
          </div>

          {/* Right: User Profile & Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl border border-[#22C55E]/10 bg-[#22C55E]/5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] font-bold text-xs uppercase">
                {auth?.user?.name ? auth.user.name.charAt(0) : "U"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#F8FAFC] leading-none mb-0.5">{auth?.user?.name}</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#22C55E] leading-none">{auth?.user?.role}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border border-red-500/20 bg-red-500/10 text-red-400 active:scale-95 cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-1">

        {/* ── SIDEBAR NAVIGATION ── */}
        <aside
          className={`${
            sidebarOpen ? "w-64 p-6 border-r border-[#22C55E]/10" : "w-0 p-0 overflow-hidden"
          } hidden md:flex flex-col transition-all duration-300 bg-[#0F172A]/40 backdrop-blur-md`}
        >
          <div className="mb-6">
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#64748b]">Menu</h2>
            <div className="w-8 h-0.5 rounded-full mt-1.5" style={{ background: "linear-gradient(90deg, #22C55E, transparent)" }} />
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            {auth?.user?.role === "farmer" && (
              <>
                <Link to="/farmer" className={navLinkClass("/farmer")}>
                  <span className="text-base">📊</span>
                  <span>Dashboard</span>
                </Link>
                <Link to="/nearby-pools" className={navLinkClass("/nearby-pools")}>
                  <span className="text-base">🔍</span>
                  <span>Nearby Pools</span>
                </Link>
                <Link to="/create-pool" className={navLinkClass("/create-pool")}>
                  <span className="text-base">➕</span>
                  <span>Create Pool</span>
                </Link>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setPoolsMenuOpen(!poolsMenuOpen)}
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-between border cursor-pointer ${
                      location.pathname === "/my-pools"
                        ? "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20 shadow-[0_0_15px_rgba(34,197,94,0.06)]"
                        : "text-[#94a3b8] hover:text-[#F8FAFC] hover:bg-[#22C55E]/5 hover:border-[#22C55E]/10 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">💼</span>
                      <span>Manage Pools</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`w-4 h-4 transition-transform duration-300 ${poolsMenuOpen ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  <div
                    className={`transition-all duration-300 overflow-hidden flex flex-col gap-1 pl-4 ${
                      poolsMenuOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <Link
                      to="/my-pools?tab=created"
                      className={`px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold flex items-center gap-3 text-sm border ${
                        location.pathname === "/my-pools" && (location.search === "" || location.search.includes("tab=created"))
                          ? "text-[#22C55E] bg-[#22C55E]/5 border-[#22C55E]/10 shadow-[0_0_15px_rgba(34,197,94,0.03)]"
                          : "text-[#94a3b8] hover:text-[#F8FAFC] hover:bg-[#22C55E]/5 hover:border-[#22C55E]/10 border-transparent"
                      }`}
                    >
                      <span className="text-base">🌾</span>
                      <span>Created Pools</span>
                    </Link>
                    <Link
                      to="/my-pools?tab=joined"
                      className={`px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold flex items-center gap-3 text-sm border ${
                        location.pathname === "/my-pools" && location.search.includes("tab=joined")
                          ? "text-[#22C55E] bg-[#22C55E]/5 border-[#22C55E]/10 shadow-[0_0_15px_rgba(34,197,94,0.03)]"
                          : "text-[#94a3b8] hover:text-[#F8FAFC] hover:bg-[#22C55E]/5 hover:border-[#22C55E]/10 border-transparent"
                      }`}
                    >
                      <span className="text-base">👥</span>
                      <span>Joined Pools</span>
                    </Link>
                  </div>
                </div>
                <Link to="/farmer/orders" className={navLinkClass("/farmer/orders")}>
                  <span className="text-base">📋</span>
                  <span>Orders</span>
                </Link>
              </>
            )}

            {auth?.user?.role === "buyer" && (
              <>
                <Link to="/buyer" className={navLinkClass("/buyer")}>
                  <span className="text-base">📊</span>
                  <span>Dashboard</span>
                </Link>
                <Link to="/buyer/nearby" className={navLinkClass("/buyer/nearby")}>
                  <span className="text-base">🔍</span>
                  <span>Discover Pools</span>
                </Link>
                <Link to="/buyer/orders" className={navLinkClass("/buyer/orders")}>
                  <span className="text-base">📋</span>
                  <span>My Orders</span>
                </Link>
              </>
            )}
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-auto pt-6 border-t border-[#22C55E]/10">
            <p className="text-[10px] text-center font-bold tracking-widest text-[#64748B] uppercase">Kishan Saathi v1.1</p>
          </div>
        </aside>

        {/* ── CENTRAL APP VIEW ── */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            <div className="rounded-2xl p-6 md:p-8 border border-[#22C55E]/5 bg-[#1e293b]/10 shadow-inner">
              {children}
            </div>
          </div>
        </main>

      </div>

      {/* ── APP FOOTER ── */}
      <footer className="px-6 py-6 border-t border-[#22C55E]/10" style={{ background: "rgba(15, 23, 42, 0.95)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-extrabold text-[#22C55E]">Kishan Saathi</p>
            <p className="text-xs text-[#94A3B8] mt-0.5">© 2026. Connecting farmers and buyers directly.</p>
          </div>
          
          
          <SocialIcons />

          <div className="text-[11px] font-semibold text-[#94A3B8] text-center md:text-right hover:text-white transition-colors">
            <Link to="#" className="hover:underline">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link to="#" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;