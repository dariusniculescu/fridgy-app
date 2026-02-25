import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/HomePage/navbar"; 
import Footer from "../components/HomePage/footer";
import { useNavigate, useParams } from "react-router-dom";
import Background from "../components/Background";

const MyAccount = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); 
  
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDeleteId, setRecipeToDeleteId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const endpoint = userId 
      ? `http://localhost:8080/api/users/${userId}`
      : "http://localhost:8080/api/users/me";

    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user data");

      const userData = await res.json();
      setUser(userData);
      if (userData.favoriteRecipes) {
        setFavorites(userData.favoriteRecipes.map(r => r.id));
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openDeleteModal = (recipeId) => {
    setRecipeToDeleteId(recipeId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setRecipeToDeleteId(null);
  };

  const toggleFavorite = async (recipeId) => {
    const isCurrentlyFavorite = favorites.includes(recipeId);
    const method = isCurrentlyFavorite ? "DELETE" : "POST";
    const endpoint = `http://localhost:8080/api/users/me/favorites/${recipeId}`;

    const recipeToToggle = user.recipes.find(r => r.id === recipeId) || 
                           user.favoriteRecipes.find(r => r.id === recipeId);

    if (!recipeToToggle) return;

    try {
      const res = await fetch(endpoint, {
        method: method,
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });

      if (!res.ok) throw new Error("Failed");

      setFavorites(prev => isCurrentlyFavorite ? prev.filter(id => id !== recipeId) : [...prev, recipeId]);

      setUser(prevUser => {
        let newFavoriteRecipes;
        if (isCurrentlyFavorite) {
          newFavoriteRecipes = prevUser.favoriteRecipes.filter(r => r.id !== recipeId);
        } else {
          newFavoriteRecipes = [...prevUser.favoriteRecipes, recipeToToggle];
        }
        return { ...prevUser, favoriteRecipes: newFavoriteRecipes };
      });

    } catch (err) {
      console.error("Favorite update failed:", err);
    }
  };

  const confirmDeleteRecipe = async () => {
    const recipeId = recipeToDeleteId;
    closeDeleteModal();
    if (!recipeId) return;

    try {
      const res = await fetch(`http://localhost:8080/api/recipes/delete/${recipeId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });

      if (!res.ok) throw new Error("Failed");

      setUser(prevUser => ({
        ...prevUser,
        recipes: prevUser.recipes.filter(r => r.id !== recipeId),
        favoriteRecipes: prevUser.favoriteRecipes.filter(r => r.id !== recipeId)
      }));
      setFavorites(prev => prev.filter(id => id !== recipeId));

    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting recipe.");
    }
  };

  const renderRecipeList = (recipes, canToggleFavorite = false, canDelete = false) => {
    if (!recipes || recipes.length === 0) {
      return <div className="p-8 text-center text-gray-400 text-sm font-medium italic">No recipes found.</div>;
    }

    return (
      <ul className="space-y-3 p-1">
        {recipes.slice().reverse().map((recipe, index) => {
          if (!recipe.id) return null;
          const isFav = favorites.includes(recipe.id);

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
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-white border border-purple-200 text-purple-700 font-bold text-xs shadow-sm">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-800 truncate text-sm sm:text-base pr-2 group-hover/title:text-purple-600 transition-colors">
                  {recipe.title}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                
                {/* EYE */}
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

                {canToggleFavorite && (
                  <button
                    onClick={() => toggleFavorite(recipe.id)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                      isFav 
                        ? "bg-pink-50 text-pink-500 hover:bg-pink-100 shadow-sm" 
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                    title={isFav ? "Remove from favorites" : "Add to favorites"}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                     </svg>
                  </button>
                )}

                {canDelete && (
                  <button
                    onClick={() => openDeleteModal(recipe.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Delete recipe"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </motion.li>
          );
        })}
      </ul>
    );
  };

  const DeleteModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={closeDeleteModal}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-5 shadow-inner">
            <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl leading-6 font-bold text-gray-900 mb-2">Delete Recipe?</h3>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            This action is permanent and cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              onClick={closeDeleteModal}
            >
              Cancel
            </button>
            <button
              className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all"
              onClick={confirmDeleteRecipe}
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">User not found.</div>
  );

  return (
    <div className="relative w-full min-h-screen font-sans overflow-x-hidden bg-gray-50/30 pb-0">
      
      <Navbar />
      <Background />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-1">
                {userId ? "User Profile" : "My Profile"}
            </h2>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                {userId ? user.name + "'s Account" : "My Account"}
            </h1>
        
          </div>
          
          <div className="flex gap-4">
             <div className="px-5 py-3 rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col items-center min-w-[100px]">
                <span className="text-xs text-gray-400 font-bold uppercase">Role</span>
                <span className="text-lg font-bold text-purple-600">{user.role}</span>
             </div>
             <div className="px-5 py-3 rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col items-center min-w-[100px]">
                <span className="text-xs text-gray-400 font-bold uppercase">Generated</span>
                <span className="text-lg font-bold text-gray-900">{user.recipes?.length || 0}</span>
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
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
             <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
             <p className="text-gray-500 font-medium">{user.email}</p>
               <div className="mt-2 flex justify-end">
    <button
      onClick={() => navigate('/change-password')}
      className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 shadow-md transition-colors"
    >
      Change Password
    </button>
  </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white shadow-sm h-full flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">✨ Generated Recipes</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
               {renderRecipeList(user.recipes, true, !userId)} 
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white shadow-sm h-full flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">❤️ Favorites</h3>
              <h5 className="text-xs  text-gray-700 " >Public Recipes</h5>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
               {renderRecipeList(user.favoriteRecipes, true, false)}
            </div>
          </motion.div>

        </div>
      </div>

      <AnimatePresence>
        {showDeleteModal && <DeleteModal />}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(200, 200, 200, 0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.5); }
      `}</style>

      <Footer />
    </div>
  );
};

export default MyAccount;