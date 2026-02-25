import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/HomePage/navbar";
import Footer from "../components/HomePage/footer";
import Background from "../components/Background";

const IngredientsList = ({ ingredients }) => (
  <div className="md:col-span-1 flex flex-col h-full">
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pl-1 flex items-center gap-2">
      <span>🥕</span> Ingredients
    </h3>
    <div className="bg-white/50 border border-white/60 rounded-[1.5rem] p-3 shadow-inner flex-1 max-h-[400px] overflow-hidden flex flex-col">
      <div className="overflow-y-auto custom-scrollbar pr-2 p-1 space-y-3 h-full">
        {ingredients.length > 0 ? (
          ingredients.map((ing, index) => {
            const isObject = typeof ing === "object" && ing !== null;
            const name = isObject ? ing.name : ing;
            const symbol = isObject ? ing.symbol : "🥘";
            return (
              <div
                key={isObject ? ing.id : index}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 text-gray-800 font-medium shadow-sm hover:shadow-md transition-all"
              >
                <span className="text-2xl filter drop-shadow-sm">{symbol}</span>
                <span className="text-sm leading-tight font-semibold text-gray-700">{name}</span>
              </div>
            );
          })
        ) : (
          <div className="text-gray-400 text-sm italic p-4 text-center">
            No ingredients listed.
          </div>
        )}
      </div>
    </div>
  </div>
);

const Instructions = ({ text }) => (
  <div className="md:col-span-2">
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
      <span>📝</span> Instructions
    </h3>
    <div className="prose prose-lg prose-purple text-gray-700 leading-relaxed whitespace-pre-line bg-white/40 p-8 rounded-[2rem] border border-white/60 shadow-sm min-h-[200px]">
      {text}
    </div>
  </div>
);

const ReviewForm = ({ currentUser, rating, setRating, newReview, setNewReview, handleSubmitReview }) => {
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="text-center text-gray-500 italic">
        Please{" "}
        <span
          className="font-bold text-purple-600 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          login
        </span>{" "}
        to leave a review.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitReview} className="mb-10 bg-white/60 p-6 rounded-[1.5rem] border border-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-bold text-gray-500 uppercase tracking-wide mr-2">Rate this recipe:</span>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(star => (
            <button 
              key={star} 
              type="button" 
              onClick={() => setRating(star)} 
              className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400 drop-shadow-sm" : "text-gray-300"}`}
            >★</button>
          ))}
        </div>
      </div>
      <textarea
        className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all text-base placeholder-gray-400 resize-none"
        rows="3"
        placeholder="What did you think? Share your experience..."
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
      />
      <div className="flex justify-end mt-4">
        <button 
          type="submit" 
          className="px-8 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
        >
          Post Review
        </button>
      </div>
    </form>
  );
};

const ReviewCard = ({ review }) => {
  const userName = review.userName || "Anonymous";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex gap-5 p-6 rounded-[1.5rem] bg-white/70 border border-white shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
        {userInitial}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-gray-900">{userName}</span>
          <div className="flex text-yellow-400 text-sm">
            {"★".repeat(review.rating)}
            <span className="text-gray-200">{"★".repeat(5 - review.rating)}</span>
          </div>
        </div>
        <p className="text-gray-600 leading-relaxed text-sm">{review.comment}</p>
      </div>
    </div>
  );
};

const RecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); 
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        };
        
        if (token) {
            try {
                const userRes = await fetch("http://localhost:8080/api/users/me", { headers });
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setCurrentUser(userData);
                }
            } catch (e) {
                console.error("Could not fetch current user details");
            }
        }

        const recipeRes = await fetch(`http://localhost:8080/api/recipes/${id}`, { headers });
        if (recipeRes.ok) setRecipe(await recipeRes.json());

        const reviewsRes = await fetch(`http://localhost:8080/api/recipes/${id}/reviews`, { headers });
        if (reviewsRes.ok) setReviews((await reviewsRes.json()).reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    if (!currentUser) return alert("Authentication failed. Login again.");

    const token = localStorage.getItem("token");
    const reviewPayload = { rating, comment: newReview, email: currentUser.email };

    try {
        const res = await fetch(`http://localhost:8080/api/recipes/${id}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify(reviewPayload)
        });

        if (res.ok) {
            const savedReview = await res.json();
            if (!savedReview.userName) savedReview.userName = currentUser.name || "Anonymous";
            setReviews(prev => [savedReview, ...prev]);
            setNewReview("");
            setRating(5);
        } else {
            alert("Could not post review.");
        }
    } catch (err) {
        console.error(err);
    }
  };

  const rawIngredients = recipe ? (recipe.ingredientList || recipe.ingredients || []) : [];
  const instructionsText = recipe ? (recipe.instructions || recipe.description || "No instructions provided.") : "";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>
  );

  if (!recipe) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
      Recipe not found.
    </div>
  );

  return (
    <div className="relative w-full min-h-screen font-sans overflow-x-hidden bg-gray-50/30 pb-20">
      <Navbar/>
      <Background/>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-28">

        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-gray-600 hover:text-purple-700 hover:border-purple-200 transition-all font-medium shadow-sm w-fit">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* Details card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 md:p-10 rounded-[2.5rem] bg-white/70 backdrop-blur-xl border border-white/80 shadow-lg mb-10">
          <div className="mb-10 pb-8 border-b border-gray-100">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tight">{recipe.title}</h1>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {recipe.authorName ? recipe.authorName.charAt(0).toUpperCase() : "C"}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Created by</p>
                <p className="text-gray-800 font-semibold">{recipe.authorName || "Chef Fridgy"}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <IngredientsList ingredients={rawIngredients} />
            <Instructions text={instructionsText} />
          </div>
        </motion.div>

        {/*Reviews*/}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-8 md:p-10 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/80 shadow-lg mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Community Reviews</h2>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200">{reviews.length} reviews</span>
          </div>

          <ReviewForm 
            currentUser={currentUser} 
            rating={rating} 
            setRating={setRating} 
            newReview={newReview} 
            setNewReview={setNewReview} 
            handleSubmitReview={handleSubmitReview} 
          />

          <div className="space-y-6">
            {reviews.map((rev, idx) => <ReviewCard key={rev.id || idx} review={rev} />)}
          </div>
        </motion.div>
      </div>

      <Footer />
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.8); }
      `}</style>
    </div>
  );
};

export default RecipePage;
