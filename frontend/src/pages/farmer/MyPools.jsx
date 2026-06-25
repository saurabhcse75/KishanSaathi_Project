import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../services/api";
import Layout from "../../components/Layout";
import { toast } from "react-toastify";
import Section from "../../components/Section";

const MyPools = () => {
  const [created, setCreated] = useState([]);
  const [joined, setJoined] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "created";
  const setActiveTab = (tab) => setSearchParams({ tab });

  const fetchPools = async () => {
    try {
      const res = await API.get("/pools/my");
      setCreated(res.data.created || []);
      setJoined(res.data.joined || []);
    } catch (err) {
      toast.error("Failed to fetch pools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#F8FAFC" }}>My Pools</h1>
        <p style={{ color: "#64748b" }}>Manage your pool operations</p>
      </div>

      {/* TABS */}
      <div className="mb-8" style={{ borderBottom: "1px solid rgba(34,197,94,0.1)" }}>
        <div className="flex gap-6">
          {activeTab === "created" && (
            <button
              onClick={() => setActiveTab("created")}
              className="pb-3 px-2 font-semibold transition relative"
              style={{ color: "#22C55E" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🌾</span>
                <span>Created Pools</span>
                <span className="badge badge-success text-xs">{created.length}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full" style={{ background: "#22C55E" }} />
            </button>
          )}

          {activeTab === "joined" && (
            <button
              onClick={() => setActiveTab("joined")}
              className="pb-3 px-2 font-semibold transition relative"
              style={{ color: "#22C55E" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">👥</span>
                <span>Joined Pools</span>
                <span className="badge badge-success text-xs">{joined.length}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full" style={{ background: "#22C55E" }} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-lg" style={{ color: "#64748b" }}>Loading your pools...</p>
        </div>
      ) : (
        <>
          {activeTab === "created" && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold" style={{ color: "#F8FAFC" }}>🌾 Created Pools</h2>
              </div>
              {created.length === 0 ? (
                <div className="card text-center">
                  <p style={{ color: "#64748b" }} className="mb-2">No created pools yet</p>
                  <p className="text-sm" style={{ color: "#475569" }}>Create a new pool to start selling your crops</p>
                </div>
              ) : (
                <Section title="" data={created} type="created" hideTitle={true} />
              )}
            </div>
          )}

          {activeTab === "joined" && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold" style={{ color: "#F8FAFC" }}>👥 Joined Pools (You Contributed)</h2>
              </div>
              {joined.length === 0 ? (
                <div className="card text-center">
                  <p style={{ color: "#64748b" }} className="mb-2">You haven't joined any pools yet</p>
                  <p className="text-sm" style={{ color: "#475569" }}>Explore nearby pools to contribute your produce</p>
                </div>
              ) : (
                <Section title="" data={joined} type="joined" hideTitle={true} />
              )}
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default MyPools;