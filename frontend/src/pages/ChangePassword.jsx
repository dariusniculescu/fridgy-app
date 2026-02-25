import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/HomePage/navbar";
import Footer from "../components/HomePage/footer";
import Background from "../components/Background";


function MessageBox({ message }) {
  if (!message.text) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className={`mb-6 p-4 rounded-xl text-sm font-bold text-center border ${
        message.type === "error"
          ? "bg-red-50 text-red-600 border-red-100"
          : "bg-green-50 text-green-600 border-green-100"
      }`}
    >
      {message.text}
    </motion.div>
  );
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const resetPassword = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!oldPassword || !newPassword) {
      setMessage({ text: "Please fill in all fields.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/reset", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (res.ok) {
        setMessage({ text: "Password changed successfully!", type: "success" });
        setOldPassword("");
        setNewPassword("");
        setTimeout(() => navigate("/my-account"), 1500);
      } else {
        const text = await res.text();
        setMessage({ text: text || "Failed to change password.", type: "error" });
      }
    } catch {
      setMessage({ text: "Server error. Please try again later.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gray-50/30">
      <Navbar />
      <Background />

      <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-10 rounded-[2.5rem] bg-white/70 backdrop-blur-2xl border border-white shadow-[0_20px_60px_rgba(0,0,0,0.05)]"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4 text-3xl">
              🔒
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Security
            </h1>
            <p className="text-gray-500 text-sm">
              Update your password to keep your account secure.
            </p>
          </div>

          <MessageBox message={message} />

          <form onSubmit={resetPassword} className="space-y-6">
            <input
              type="password"
              placeholder="Current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-purple-500/10"
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-purple-500/10"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-lg disabled:opacity-70"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(-1)}
              className="text-sm font-semibold text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
