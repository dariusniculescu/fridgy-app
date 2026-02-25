import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Hero = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const scrollStart = () => {
    const el = document.getElementById("ingredients-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollHow = () => {
    const el = document.getElementById("how");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const yPos = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      ref={targetRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden font-sans"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.6]"
          style={{
            backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[80px] mix-blend-multiply"></div>
      </div>

      <motion.div
        style={{ opacity: textOpacity, scale: scale, y: yPos }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6"
      >
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-2">
          <span className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
            Fridgy.
          </span>
        </h1>

        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
          Your Smart Kitchen Assistant
        </h2>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Stop wasting food. Create delicious recipes instantly from 
          <strong className="text-gray-800"> what is already in your fridge</strong> using our AI-powered engine.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {["AI Recipes", "Zero Waste", "Smart Inventory"].map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-gray-200 rounded-full text-gray-600 text-sm font-medium shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={scrollStart}
            className="px-8 py-4 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-gray-900 font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            Get Started
          </button>
          <button
            onClick={scrollHow}
            className="px-8 py-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm text-gray-700 font-semibold hover:bg-white hover:scale-105 transition-all duration-300 border border-gray-200/50"
          >
            How it works
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
