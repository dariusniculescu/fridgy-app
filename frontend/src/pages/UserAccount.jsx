import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/HomePage/navbar"; 
import Footer from "../components/HomePage/footer";
import { useNavigate, useParams } from "react-router-dom";

const UserAccount = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); 
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    if (!userId) {
        setError("No user ID provided in URL.");
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("User not found in database.");
        if (res.status === 403) throw new Error("Access denied.");
        throw new Error("Failed to fetch user data.");
      }

      const userData = await res.json();
      setUser(userData);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderRecipeList = (recipes) => {
    if (!recipes || recipes.length === 0) {
      return <div className="p-8 text-center text-gray-400 text-sm font-medium italic">No recipes found.</div>;
    }

    return (
      <ul className="space-y-3 p-1">
        {recipes.map((recipe, index) => {
          if (!recipe.id) return null;
          return (
            <motion.li 
              key={recipe.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center justify-between p-3 rounded-2xl bg-white/50 border border-white/60 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <div 
                onClick={() => navigate(`/recipes/${recipe.id}`)}
                className="flex items-center gap-3 overflow-hidden cursor-pointer flex-1 group/title"
              >
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-white border border-indigo-200 text-indigo-700 font-bold text-xs shadow-sm">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-800 truncate text-sm sm:text-base pr-2 group-hover/title:text-indigo-600 transition-colors">
                  {recipe.title}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                  title="View Recipe"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </motion.li>
          );
        })}
      </ul>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 font-medium">
      <p className="text-xl text-red-500 mb-4">Error: {error}</p>
      <button onClick={() => navigate("/dashboard")} className="px-6 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition">Back to Dashboard</button>
    </div>
  );

  if (!user) return null;

  return (
    <div className="relative w-full min-h-screen font-sans overflow-x-hidden bg-gray-50/30 pb-0">
      
      <Navbar />

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.3] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-[120px] mix-blend-multiply"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[120px] mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <button 
                onClick={() => navigate(-1)} 
                className="mb-2 text-sm font-bold text-gray-400 hover:text-purple-600 uppercase tracking-widest flex items-center gap-1 transition-colors"
            >
                ← Back
            </button>
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-1">
                Viewing Profile
            </h2>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                {user.name}'s Account
            </h1>
          </div>

          <div className="flex gap-4">
             <div className="px-5 py-3 rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col items-center min-w-[100px]">
                <span className="text-xs text-gray-400 font-bold uppercase">Role</span>
                <span className="text-lg font-bold text-indigo-600">{user.role}</span>
             </div>
             <div className="px-5 py-3 rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col items-center min-w-[100px]">
                <span className="text-xs text-gray-400 font-bold uppercase">Favorites</span>
                <span className="text-lg font-bold text-pink-500">{user.favoriteRecipes?.length || 0}</span>
             </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-8 rounded-[2.5rem] bg-white/70 backdrop-blur-xl border border-white shadow-sm flex items-center gap-6"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
             <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
             <p className="text-gray-500 font-medium">{user.email}</p>
          </div>
        </motion.div>

        {/* FAVORITE LIST*/}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white shadow-sm"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">❤️ Favorites</h3>
          <p className="text-xs text-gray-400 mb-5">
  *You can only view public recipes — only those the user added to favorites.*
</p>
          <div className="overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {renderRecipeList(user.favoriteRecipes)}
          </div>
        </motion.div>

      </div>

      <Footer />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(200, 200, 200, 0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.5); }
      `}</style>
    </div>
  );
};

export default UserAccount;
