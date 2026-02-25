import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUser } from "../../hooks/useUser";

const Navbar = () => {
  const { isLoggedIn } = useAuth();
  const user = useUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const linkClass = "transition-transform duration-200 hover:scale-105 px-3 py-1.5 bg-white/60 backdrop-blur-md rounded-lg text-gray-800 font-medium hover:bg-white hover:text-black border border-white/40 shadow-sm transition-all";
  const buttonClass = "transition-transform duration-200 hover:scale-105 px-5 py-1.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:shadow-purple-500/30 hover:brightness-110 border border-transparent";

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex justify-between items-center px-1.5 py-0.5 gap-1.5 bg-white/20 backdrop-blur-md border border-white/25 rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.05)] w-auto max-w-3xl text-[10px]">
      <div className="flex items-center space-x-2 text-sm">
        <Link to="/" className={linkClass}>Home</Link>
        <Link to="/explore" className={linkClass}>Explore</Link>
        {!isLoggedIn && (
          <a
            href="#how"
            className={linkClass}
            onClick={(e) => {
              e.preventDefault();
              if (window.location.pathname === "/") {
                document.getElementById("how")?.scrollIntoView({ behavior: "smooth" });
              } else {
                window.location.href = "/#how";
              }
            }}
          >
            How it works
          </a>
        )}
      </div>

      <div className="flex items-center space-x-3 text-sm ml-2">
        {!isLoggedIn && (
          <>
            <Link to="/login" className={buttonClass}>Log In</Link>
            <Link to="/register" className={buttonClass}>Register</Link>
          </>
        )}
        {isLoggedIn && user && (
          <>
            <Link to="/my-account" className={linkClass}>My Account</Link>
            {(user.role === "REGULAR" || user.role === "ADMIN") && (
              <Link to="/add-ingredient" className={buttonClass}>Add Ingredient</Link>
            )}
            {user.role === "ADMIN" && (
              <Link to="/dashboard" className={buttonClass}>Dashboard</Link>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-gray-600 hover:text-red-600 font-semibold transition-colors"
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};


export default Navbar;
