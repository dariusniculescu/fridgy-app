import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/HomePage/navbar";
import Footer from "../components/HomePage/footer";
import Background from "../components/Background";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [pendingRequests, setPendingRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);

  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter((u) => {
    const name = (u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const query = search.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  const loadIngredientsRequests = async () => {
    try {
      const [pendingRes, allRes] = await Promise.all([
        fetch("http://localhost:8080/ingredient-request/pending", {
          headers: { Authorization: "Bearer " + token },
        }),
        fetch("http://localhost:8080/ingredient-request/all", {
          headers: { Authorization: "Bearer " + token },
        }),
      ]);

      if (pendingRes.ok) setPendingRequests(await pendingRes.json());
      if (allRes.ok) setAllRequests(await allRes.json());
    } catch (e) {
      console.error("Failed to load request ingredients");
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    const fetchAllIngredients = async () => {
      try {
        const res = await fetch("http://localhost:8080/ingredients", {
          headers: { Authorization: "Bearer " + token },
        });
        if (res.ok) {
          const data = await res.json();
          setStats((prevStats) => ({ ...prevStats, allIngredients: data }));
        }
      } catch (e) {
        console.error("Failed to load all ingredients");
      }
    };

    const loadDashboardStats = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch("http://localhost:8080/api/admin/stats", {
            headers: { Authorization: "Bearer " + token },
          }),
          fetch("http://localhost:8080/api/users/all", {
            headers: { Authorization: "Bearer " + token },
          }),
        ]);

        if (statsRes.ok) {
           const statsData = await statsRes.json();
           setStats(prev => ({...prev, ...statsData}));
        }
        if (usersRes.ok) setUsers(await usersRes.json());
      } catch (e) {
        setError("Server unavailable");
      }
    };

    loadDashboardStats();
    fetchAllIngredients(); 
    loadIngredientsRequests();
  }, [token]);

  async function approve(id, adminMessage) {
    try {
      const res = await fetch(
        `http://localhost:8080/ingredient-request/${id}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adminMessage),
        }
      );
      if (!res.ok) throw new Error("Failed");
      await loadIngredientsRequests();

      const req = allRequests.find((r) => r.id === id);
      if (req?.name)
        window.dispatchEvent(
          new CustomEvent("ingredientDeleted", { detail: { name: req.name } })
        );
    } catch (err) {
      console.error(err);
    }
  }

  async function reject(id, adminMessage) {
    try {
      const res = await fetch(
        `http://localhost:8080/ingredient-request/${id}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adminMessage),
        }
      );
      if (!res.ok) throw new Error("Failed");
      await loadIngredientsRequests();
    } catch (err) {
      console.error(err);
    }
  }

  async function removeRequest(id) {
    setDeletingIds((prev) => [...prev, id]);
    try {
      const res = await fetch(
        `http://localhost:8080/ingredient-request/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (res.ok) {
        setAllRequests((prev) => prev.filter((r) => r.id !== id));
        setPendingRequests((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingIds((prev) => prev.filter((x) => x !== id));
    }
  }

  const maxRecipeCount = stats?.topRecipeCreators?.length
    ? Math.max(...stats.topRecipeCreators.map((item) => item[1]))
    : 1;

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved")
      return (
        <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-[10px] font-bold border border-green-200 uppercase">
          Approved
        </span>
      );
    if (s === "rejected")
      return (
        <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-[10px] font-bold border border-red-200 uppercase">
          Rejected
        </span>
      );
    return (
      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-[10px] font-bold border border-yellow-200 uppercase animate-pulse">
        Pending
      </span>
    );
  };

  return (
    <div className="relative w-full min-h-screen font-sans overflow-x-hidden bg-gray-50/50 pb-0">
      <Navbar />
      <Background/>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-10">
          <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-1">
            Admin Panel
          </h2>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Dashboard & Moderation
          </h1>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {/*STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Total Users",
              value: stats?.totalUsers,
              icon: "👥",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Recipes Created",
              value: stats?.totalRecipes,
              icon: "🍳",
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
            {
              label: "Ingredients",
              value: stats?.totalIngredients,
              icon: "🥕",
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Total Favorites",
              value: stats?.totalFavorites,
              icon: "❤️",
              color: "text-pink-600",
              bg: "bg-pink-50",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center text-2xl`}
                >
                  {stat.icon}
                </div>
                <span className={`text-2xl font-black ${stat.color}`}>
                  {stat.value ?? 0}
                </span>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* USERS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Top Contributors */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white shadow-sm"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                🏆 Top Contributors
              </h3>
            </div>
            <div className="space-y-6">
              {stats?.topRecipeCreators?.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                    <span>{item[0]}</span>
                    <span>{item[1]} recipes</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(item[1] / maxRecipeCount) * 100}%`,
                      }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full shadow-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/*TRENDING INGREDIENTS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white shadow-sm"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                🔥 Trending Ingredients
              </h3>
            </div>
            <ul className="space-y-4">
              {stats?.allIngredients && Array.isArray(stats.allIngredients) ? (
                stats.allIngredients
                  .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)) 
                  .slice(0, 5) 
                  .map((ingredient, idx) => (
                    <li
                      key={ingredient.id || idx}
                      className="flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-sm">
                          #{idx + 1}
                        </span>
                        <div className="flex flex-col">
                           <span className="font-medium text-gray-700 truncate">
                             {ingredient.name}
                           </span>
                           <span className="text-[10px] text-gray-400">
                             Used {ingredient.usageCount} times
                           </span>
                        </div>
                      </div>
                    </li>
                  ))
              ) : (
                <p className="text-sm text-gray-400 italic">No ingredient data available.</p>
              )}
            </ul>
          </motion.div>
        </div>

    
        <div className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">🥦</span> Ingredient Moderation
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/*Pending */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[2.5rem] bg-white/70 backdrop-blur-xl border border-white shadow-sm flex flex-col h-full"
            >
              <div className="mb-6 flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>{" "}
                  Pending Review
                </h3>
                <span className="text-xs font-bold bg-white px-3 py-1 rounded-full text-gray-500 border border-gray-100 shadow-sm">
                  {pendingRequests.length}
                </span>
              </div>

              {pendingRequests.length === 0 ? (
                <p className="text-gray-400 italic text-center py-8">
                  All caught up!
                </p>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-white/60 border border-white/50 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-2xl border border-gray-200">
                            {req.symbol}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">
                              {req.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              By: {req.requestedBy?.email}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(req.status)}
                      </div>
                      <textarea
                        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 mb-3 resize-none"
                        placeholder="Message..."
                        rows="1"
                        onChange={(e) => (req.adminMessage = e.target.value)}
                      ></textarea>
                      <div className="flex gap-3">
                        <button
                          onClick={() => approve(req.id, req.adminMessage)}
                          className="flex-1 py-2 rounded-lg bg-green-50 text-green-700 font-bold text-xs hover:bg-green-100 border border-green-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => reject(req.id, req.adminMessage)}
                          className="flex-1 py-2 rounded-lg bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 border border-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/*History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white shadow-sm flex flex-col h-full"
            >
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-400"></span>{" "}
                  History
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar space-y-3">
                {allRequests
                  .filter((r) => r.status !== "Pending")
                  .map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-2xl bg-white/40 border border-white/60 flex justify-between items-center hover:bg-white transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-xl">{r.symbol}</span>
                        <div>
                          <p className="font-semibold text-gray-800 truncate max-w-[120px]">
                            {r.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {getStatusBadge(r.status)}
                            {r.adminMessage && (
                              <span className="text-[11px] text-gray-400 italic truncate max-w-[100px] border-l border-gray-300 pl-2">
                                {r.adminMessage}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeRequest(r.id)}
                        disabled={deletingIds.includes(r.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        {deletingIds.includes(r.id) ? "..." : "✕"}
                      </button>
                    </div>
                  ))}
                {allRequests.filter((r) => r.status !== "Pending").length ===
                  0 && (
                  <p className="text-gray-400 italic text-center py-4">
                    No history.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* USER MANAGEMENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[2.5rem] bg-white/80 backdrop-blur-2xl border border-white shadow-sm"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h3 className="text-xl font-bold text-gray-900">User Database</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-gray-400 uppercase border-b border-gray-100">
                  <th className="pb-4 pl-2">User</th>
                  <th className="pb-4">Email</th>
                  <th className="pb-4">Role</th>
                  <th className="pb-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.length ? (
                  filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="group hover:bg-purple-50/50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                            {u.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-500 font-medium">
                        {u.email}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            u.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 text-right pr-6">
                        <div className="flex justify-end">
                          <button
                            onClick={() => navigate(`/users/${u.id}`)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors border border-blue-100"
                            title={`View ${u.name}'s Profile`}
                          >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <Footer />
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(200, 200, 200, 0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.5); }
      `}</style>
    </div>
  );
};

export default Dashboard;