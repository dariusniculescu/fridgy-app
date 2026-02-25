import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Add your ingredients",
    description: "Tell Fridgy what ingredients you have currently in your fridge or pantry.",
  },
  {
    number: "2",
    title: "AI generates recipes",
    description: "Our engine instantly suggests the best meals based on your available items.",
  },
  {
    number: "3",
    title: "Cook smarter",
    description: "Follow easy step-by-step instructions and enjoy your zero-waste meal.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative w-full py-24 overflow-hidden" id="how">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="absolute top-1/4 left-10 w-[300px] h-[300px] bg-purple-200/40 rounded-full blur-[80px] mix-blend-multiply"></div>
        <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[90px] mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            How it works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to transform your ingredients into delicious meals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative group p-8 rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="mb-4 relative inline-block">
                <span className="text-7xl font-black bg-gradient-to-br from-purple-600 via-fuchsia-500 to-purple-400 bg-clip-text text-transparent select-none">
                  {step.number}
                </span>
                <div className="absolute inset-0 bg-purple-400/20 blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed font-medium">{step.description}</p>

              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
