import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/HomePage/navbar";
import Footer from "../components/HomePage/footer";
import Background from "../components/Background";

const decodeJWT = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
};

export default function AddIngredient() {
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [message, setMessage] = useState("");
    const [requests, setRequests] = useState([]);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const decoded = useMemo(() => token ? decodeJWT(token) : null, [token]);
    const role = decoded?.role ?? null;

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "approved": return "bg-green-50 text-green-700 border-green-200";
            case "pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "rejected": return "bg-red-50 text-red-700 border-red-200";
            default: return "bg-gray-50 text-gray-500 border-gray-200";
        }
    };

    useEffect(() => {
        if (!token) return;
        fetch("http://localhost:8080/ingredient-request/my", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.ok ? res.json() : [])
            .then(data => setRequests(Array.isArray(data) ? data : []))
            .catch(() => setRequests([]));
    }, [token]);

    const sendRequest = async () => {
        if (!name || !symbol) {
            setMessage("Please enter both name and symbol.");
            return;
        }
        if (!token) {
            setMessage("You are not logged in.");
            return;
        }
        try {
            let res;
            if (role === "ADMIN") {
                res = await fetch("http://localhost:8080/ingredients", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ name, symbol })
                });
            } else {
                res = await fetch("http://localhost:8080/ingredient-request", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ name, symbol })
                });
            }
            if (!res.ok) {
                setMessage("Server error.");
                return;
            }
            setMessage(role === "ADMIN" ? "Ingredient added successfully." : "Request sent successfully.");
            setName("");
            setSymbol("");
            const refreshed = await fetch("http://localhost:8080/ingredient-request/my", {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => r.ok ? r.json() : []);
            setRequests(Array.isArray(refreshed) ? refreshed : []);
        } catch {
            setMessage("Server unavailable.");
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-gray-50/50">
            <Navbar />
            <Background />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white/70 backdrop-blur-xl shadow-xl"
                >
                    <h1 className="text-3xl font-black mb-4">
                        {role === "ADMIN" ? "Add Ingredient" : "Suggest Ingredient"}
                    </h1>

                    <div className="space-y-5">
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ingredient name"
                            className="w-full px-4 py-3 rounded-xl border"
                        />
                        <input
                            value={symbol}
                            onChange={e => setSymbol(e.target.value)}
                            placeholder="🥑"
                            maxLength={4}
                            className="w-full px-4 py-3 rounded-xl border text-xl"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={sendRequest}
                                className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold"
                            >
                                {role === "ADMIN" ? "Add" : "Send"}
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="px-6 py-3 rounded-xl bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                        {message && (
                            <p className="text-sm text-purple-700 bg-purple-50 p-3 rounded-xl">
                                {message}
                            </p>
                        )}
                    </div>
                </motion.div>

                <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-xl"
                >
                    <h2 className="text-xl font-bold mb-4">My Requests</h2>
                    {requests.length === 0 ? (
                        <p className="text-gray-400 italic">No requests.</p>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {requests.map(r => (
                                <div
                                    key={r.id ?? crypto.randomUUID()}
                                    className={`p-4 rounded-xl border ${getStatusStyle(r.status)}`}
                                >
                                    <div className="flex justify-between">
                                        <span>{r.symbol} {r.name}</span>
                                        <span className="text-xs uppercase">{r.status}</span>
                                    </div>
                                    {r.adminMessage && (
                                        <p className="mt-2 text-xs italic">
                                            {r.adminMessage}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </motion.section>
            </div>

            <Footer />
        </div>
    );
}
