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
    description: "Strengthens the body’s defense system.",
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
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-orange-50 to-orange-100 p-2 overflow-x-hidden">
      <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">
        🌿 Turmeric Benefits 🌿
      </h1>

      <div className="relative w-full max-w-6xl px-4 box-border overflow-hidden">
        {/* Benefit Cards */}
        <div className="flex flex-wrap justify-center gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`w-full sm:w-72 p-4 bg-white border-2 rounded-xl shadow-md transition-all duration-500 ease-in-out transform hover:scale-105 ${
                index === currentIndex
                  ? `${benefit.borderColor} scale-105 opacity-100`
                  : "border-gray-200 opacity-80"
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
