import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function IngredientsSection() {
  const { isLoggedIn } = useAuth();
  const [foods, setFoods] = useState([]);
  const [selected, setSelected] = useState([]);
  const [flyAway, setFlyAway] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/ingredients")
      .then((res) => res.json())
      .then(setFoods)
      .catch(console.error);
  }, []);

  const toggleFood = (name) => {
    if (flyAway) return;
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const onGenerate = async () => {
    if (selected.length === 0) return;
    if (!isLoggedIn) { window.location.href = "/login"; return; }

    const token = localStorage.getItem("token");
    setLoading(true);
    setIsFavorite(false);
    setFlyAway(true);

    setTimeout(async () => {
      try {
        await fetch("http://localhost:8080/fridgy/ingredients", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify(selected),
        });

        const res = await fetch("http://localhost:8080/fridgy", {
          headers: { Authorization: "Bearer " + token },
        });

        if (res.ok) {
          const textData = await res.text();
          try {
            const jsonData = JSON.parse(textData);
            setRecipe(jsonData);
          } catch {
            setRecipe({ id: null, title: "Chef Fridgy Recommends:", description: textData });
          }
        } else {
          console.error("Error generating recipe");
        }
      } catch (e) {
        console.error(e);
      }
      setFlyAway(false);
      setLoading(false);
      setSelected([]);
    }, 900);
  };

  const addToFavorites = async () => {
    if (!recipe?.id) {
      alert("Această rețetă nu are un ID valid și nu poate fi salvată momentan.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/users/me/favorites/${recipe.id}`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token }
      });
      if (res.ok) setIsFavorite(true);
    } catch (e) {
      console.error("Failed to add to favorites", e);
    }
  };

  return (
    <section className="relative w-full min-h-screen py-24 overflow-hidden font-sans" id="ingredients-section">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">What's in your fridge?</h2>
        <p className="text-lg text-gray-600 mb-12">Tap ingredients to add them to your cooking pot.</p>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {foods.filter(f => !selected.includes(f.name)).map((f, i) => (
            <motion.button
              key={f.name}
              onClick={() => toggleFood(f.name)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: i * 0.01 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/60 bg-white/40 backdrop-blur-md shadow-sm text-gray-700 font-medium hover:shadow-md transition-all cursor-pointer"
            >
              <span className="text-xl">{f.symbol}</span>
              <span>{f.name}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {selected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              className="relative p-8 rounded-[2rem] border border-white/50 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] max-w-3xl mx-auto mb-16"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Ready to Cook
              </h3>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <AnimatePresence>
                  {selected.map(name => {
                    const item = foods.find(f => f.name === name);
                    if (!item) return null;
                    return (
                      <motion.div
                        key={name}
                        onClick={() => toggleFood(name)}
                        layout
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={flyAway ? { x: 500, opacity: 0, scale: 0.5, rotate: 45 } : { opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-white border border-purple-200 text-purple-900 shadow-sm cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors z-10"
                      >
                        <span>{item.symbol}</span>
                        <span className="font-semibold">{item.name}</span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="flex justify-center">
                {!isLoggedIn ? (
                  <button onClick={() => window.location.href = "/login"} className="px-8 py-3 rounded-xl bg-gray-900 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                    Log in to generate
                  </button>
                ) : (
                  <motion.button
                    onClick={onGenerate}
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-lg shadow-[0_4px_20px_rgba(168,85,247,0.4)] hover:shadow-[0_8px_25px_rgba(168,85,247,0.5)] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? "Cooking Magic..." : "Generate Recipe ✨"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {recipe && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="mt-16 text-left max-w-4xl mx-auto">
              <div className="relative p-10 rounded-[2.5rem] bg-white/80 backdrop-blur-2xl border border-white shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="relative prose prose-lg prose-purple max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                  {recipe.description || recipe.instructions || "No details available."}
                </div>

                <div className="mt-8 flex justify-end gap-4">
    
    {/* BUTON 1: My Recipes (Accent Gradient - Atrage atenția) */}
    <Link 
        to="/my-account" 
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-[1.02] transition-all"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        My Recipes
    </Link>

    {/* BUTON 2: Close Recipe (Secundar, Neutru) */}
    <button
        onClick={() => setRecipe(null)}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Close Recipe
    </button>
</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
