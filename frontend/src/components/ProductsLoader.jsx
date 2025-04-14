import React, { useState, useEffect } from "react";
import { Flame, ShieldCheck, Leaf, Sparkles } from "lucide-react";

const benefits = [
  {
    title: "Reduces Inflammation",
    description: "Helps with joint pain and swelling.",
    icon: <Flame size={30} className="text-red-400" />,
    borderColor: "border-red-400",
  },
  {
    title: "Boosts Immunity",
    description: "Strengthens the body's defense system.",
    icon: <ShieldCheck size={30} className="text-green-500" />,
    borderColor: "border-green-500",
  },
  {
    title: "Improves Digestion",
    description: "Reduces bloating and aids gut health.",
    icon: <Leaf size={30} className="text-lime-500" />,
    borderColor: "border-lime-500",
  },
  {
    title: "Rich in Antioxidants",
    description: "Protects cells from damage.",
    icon: <Sparkles size={30} className="text-yellow-400" />,
    borderColor: "border-yellow-400",
  },
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % benefits.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-orange-50 to-orange-100 p-4 py-10">
      {/* Improved Loader */}
      <div className="mt-10 flex justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 border-r-orange-500 rounded-full animate-spin"></div>
          <div className="absolute inset-1 border-4 border-transparent border-b-orange-400 border-l-orange-400 rounded-full animate-spin animation-delay-200"></div>
        </div>
      </div>

      <p className="text-center mt-4 text-sm text-gray-500 animate-pulse">
        Please wait while we prepare the best turmeric products for you...
      </p>

      <h1 className="text-2xl md:text-3xl font-bold text-orange-600 mb-6 text-center">
        🌿 Turmeric Benefits 🌿
      </h1>

      <div className="w-full max-w-6xl px-4">
        {/* Benefit Cards */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`w-full sm:w-72 p-4 bg-white border-2 rounded-xl shadow-md transition-all duration-300 ease-in-out ${
                index === currentIndex
                  ? `${benefit.borderColor} ring-2 ring-offset-2 ${benefit.borderColor.replace('border', 'ring')} scale-[1.02]`
                  : "border-gray-200 opacity-90 hover:opacity-100"
              }`}
            >
              <div className="flex justify-center mb-2">{benefit.icon}</div>
              <h3 className="text-lg font-semibold text-orange-600 mb-1 text-center">
                {benefit.title}
              </h3>
              <p className="text-xs text-gray-600 text-center">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;