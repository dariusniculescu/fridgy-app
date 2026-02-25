import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/HomePage/navbar"; 
import { useNavigate } from "react-router-dom";
import Footer from "../components/HomePage/footer.jsx";

const Explore = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [ingredientsMap, setIngredientsMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipesRes = await fetch("http://localhost:8080/api/explore", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const ingredientsRes = await fetch("http://localhost:8080/ingredients", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!recipesRes.ok || !ingredientsRes.ok) throw new Error();

        const recipesData = await recipesRes.json();
        const ingredientsData = await ingredientsRes.json();

        setRecipes(recipesData);

        const map = new Map();
        ingredientsData.forEach(i => map.set(i.name.toLowerCase(), i.symbol));
        setIngredientsMap(map);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatIngredients = (list) => {
    if (!list || list.length === 0) return [];
    return list.map(item => {
      if (typeof item === "object" && item !== null) {
        return { name: item.name, emoji: item.symbol || "🥘" };
      }
      return { name: item, emoji: ingredientsMap.get(item.toLowerCase()) || "🥘" };
    });
  };

  const filteredRecipes = recipes.filter(recipe => {
    const currentIngredients = recipe.ingredientList || recipe.ingredients || [];
    const matchesTitle = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIngredient = currentIngredients.some(ing => {
      const name = typeof ing === "object" ? ing.name : ing;
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return matchesTitle || matchesIngredient;
  });

  return (
    <div className="relative w-full min-h-screen font-sans overflow-x-hidden bg-gray-50/50 pb-20">
      <Navbar />

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.5]" style={{
          backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
                            linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-300/20 rounded-full blur-[120px] mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-pink-200/20 rounded-full blur-[90px] mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 w-full px-6 pt-28">
        <div className="text-center max-w-4xl mx-auto mb-12 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900">
            Explore 
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent ml-3">
              Recipes
            </span>
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-xl mx-auto">
            Discover culinary masterpieces
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300/50 transition-all text-lg font-medium"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600 mb-6"></div>
            <p className="text-gray-500 font-semibold">Cooking up the feed...</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 font-medium">No recipes found matching your taste.</p>
            <button onClick={() => setSearchTerm("")} className="mt-2 text-purple-600 font-bold hover:underline">Clear search filters</button>
          </div>
        ) : (
          <div className="max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredRecipes.slice().reverse().map((recipe, index) => {
                const currentIngredients = recipe.ingredientList || recipe.ingredients || [];
                const enriched = formatIngredients(currentIngredients);
                const recipeId = recipe.id || recipe._id;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative flex flex-col p-6 rounded-[2rem] bg-white/70 backdrop-blur-2xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)] hover:-translate-y-2 transition-all duration-300 h-full overflow-hidden"
                  >
                    <div className="mb-4">
                      <h2 
                        onClick={() => navigate(`/recipes/${recipeId}`)}
                        className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-purple-700 transition-colors h-[3.5rem] cursor-pointer"
                      >
                        {recipe.title}
                      </h2>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-white uppercase">
                           {recipe.authorName ? recipe.authorName.charAt(0) : "C"}
                        </div>
                        <span className="text-xs font-semibold text-gray-400">
                          by <span className="text-gray-600">{recipe.authorName || "Chef Fridgy"}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                      {recipe.instructions.slice(0,69)}
                    </p>

                    <div className="mt-auto mb-6">
                      <div className="flex flex-wrap gap-1.5">
                        {enriched.slice(0, 3).map((ing, i) => (
                          <span 
                            key={i} 
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 border border-white text-[10px] font-bold text-gray-600 shadow-sm"
                          >
                            <span className="text-base">{ing.emoji}</span>
                            <span className="truncate max-w-[80px]">{ing.name}</span>
                          </span>
                        ))}
                        {enriched.length > 3 && (
                          <span className="px-2 py-1 text-[10px] font-bold text-purple-500 bg-purple-50 rounded-lg">
                            +{enriched.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                        onClick={() => navigate(`/recipes/${recipeId}`)} 
                        className="w-full py-3 rounded-xl bg-white border border-purple-100 text-purple-700 font-bold text-sm shadow-sm group-hover:bg-purple-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        View Recipe
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
