import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Background from "../components/Background";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const message = await res.text();

      if (!res.ok) {
        setError(message);
        setIsLoading(false);
        return;
      }

      setSuccess(message);
      setTimeout(() => (window.location.href = "/login"), 1500);
    } catch {
      setError("Server unavailable");
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center font-sans">
     <Background/>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] shadow-lg"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500">Join the community today.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium animate-pulse">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm text-center font-medium">
            {success} Redirecting...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-white/80 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-400 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-white/80 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-400 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-white/80 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-400 text-gray-800"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 transition-all duration-200 mt-4"
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-purple-600 hover:text-purple-800 transition-colors">
            Log in here
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Register;
