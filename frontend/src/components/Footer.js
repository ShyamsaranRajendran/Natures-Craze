import React from 'react';
import { Home, Heart, User, PlusCircle } from 'lucide-react';

const BottomNavigation = () => {
  return (
    <div className="relative mt-20">
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 w-full bg-white shadow-lg py-4 flex items-center justify-around">
        {/* Home Button */}
        <button className="group flex flex-col items-center">
          <Home className="w-6 h-6 text-gray-500 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 group-hover:text-orange-500 transition-all duration-300" />
          <span className="text-gray-500 text-xs group-hover:text-orange-500 transition-colors duration-300">
            Home
          </span>
        </button>

        {/* Add Button */}
        <button className="group flex flex-col items-center">
          <PlusCircle className="w-6 h-6 text-gray-500 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 group-hover:text-green-500 transition-all duration-300" />
          <span className="text-gray-500 text-xs group-hover:text-green-500 transition-colors duration-300">
            Add
          </span>
        </button>

        {/* User Button */}
        <button className="group flex flex-col items-center">
          <User className="w-6 h-6 text-gray-500 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 group-hover:text-blue-500 transition-all duration-300" />
          <span className="text-gray-500 text-xs group-hover:text-blue-500 transition-colors duration-300">
            Profile
          </span>
        </button>

        {/* Favorite Button */}
        <button className="group flex flex-col items-center">
          <Heart className="w-6 h-6 text-gray-500 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 group-hover:text-red-500 transition-all duration-300" />
          <span className="text-gray-500 text-xs group-hover:text-red-500 transition-colors duration-300">
            Favorites
          </span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
