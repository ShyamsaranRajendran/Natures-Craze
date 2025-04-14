import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomDropdown = ({ item, productQuantities, onPackSizeChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const selectedPack = productQuantities[item._id]?.packSize || "";

  const handleSelect = (packSize) => {
    onPackSizeChange(item._id, packSize);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-48" ref={dropdownRef}>
    <button
      onClick={() => setOpen(!open)}
      className="w-full flex justify-between items-center border p-2 rounded-md text-sm bg-white hover:border-amber-500"
    >
      <span className="truncate">
        {selectedPack ? `${selectedPack} - ₹${item.prices.find(p => p.packSize === selectedPack)?.price}` : "Select Pack Size"}
      </span>
      <ChevronDown className="w-4 h-4 ml-2 text-gray-600" />
    </button>
  
    {open && (
      <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-md z-10 max-h-60 overflow-y-auto">
        {item.prices.map((price) => (
          <div
            key={price.packSize}
            onClick={() => handleSelect(price.packSize)}
            className="px-3 py-2 hover:bg-amber-100 cursor-pointer text-sm"
          >
            {price.packSize} - ₹{price.price}
          </div>
        ))}
      </div>
    )}
  </div>
  );
};

export default CustomDropdown;
