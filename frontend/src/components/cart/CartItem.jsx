import React from "react";
import { Trash2, Plus, Minus, Package } from "lucide-react";
import { ToastContainer } from "react-toastify";
import CustomDropdown from "./CustomDropdown"; // Assuming you have a CustomDropdown component
const CartItem = ({
  item,
  index,
  cartImg,
  productQuantities,
  onPackSizeChange,        // Changed from handlePackSizeChange
  onAddToCart,            // Changed from handleAddToCart
  onUpdateQuantity,       // Changed from handleUpdateQuantity
  onRemoveItem,           // Changed from handleRemoveItem
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative">
    <ToastContainer />
    <button
      onClick={() => onRemoveItem(item._id)}
      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
    >
      <Trash2 className="w-5 h-5" />
    </button>
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Improved Image Container */}
      <div className="w-full sm:w-24 h-40 sm:h-24 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain p-2"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'placeholder-image-url';
              e.currentTarget.className = 'w-full h-full object-cover';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
        <div className="mt-2 space-y-2">
          {Object.entries(item.quantities || {}).map(([size, qty]) => {
            const price = item.prices.find((p) => p.packSize === size)?.price || 0;
            return (
              <div key={size} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm text-gray-600">Size: {size}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item._id, size, -1)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center">{qty}</span>
                  <button
                    onClick={() => onUpdateQuantity(item._id, size, 1)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <span className="ml-2 text-gray-900 font-medium whitespace-nowrap">
                    ₹{price * qty}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <CustomDropdown
              item={item}
              productQuantities={productQuantities}
              onPackSizeChange={onPackSizeChange}
            />
            <button
              onClick={() => onAddToCart(item._id)}
              className="bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-600 text-sm w-full sm:w-auto"
            >
              Add Pack
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default CartItem;