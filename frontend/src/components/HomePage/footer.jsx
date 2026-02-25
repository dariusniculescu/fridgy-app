import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const footerLinks = [
    { name: "My Account", path: "/my-account" },
    { name: "Log In", path: "/login" },
    { name: "Register", path: "/register" }
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative w-full pt-16 pb-8 font-sans bg-gray-50 border-t border-gray-200 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-10" 
        ></div>
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-purple-100/40 rounded-full blur-[80px] mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Fridgy.
              </span>
            </h2>
            <p className="text-gray-500 font-medium">Smart recipes from your ingredients.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {footerLinks.map(link => (
              <Link 
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-purple-600 font-semibold transition-colors relative group cursor-pointer"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <button 
            onClick={scrollToTop}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:scale-110 hover:border-purple-200 transition-all duration-300 cursor-pointer"
            aria-label="Scroll to top"
          >
            <svg 
              className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>

        <div className="pt-8 border-t border-gray-200/60 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Fridgy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
