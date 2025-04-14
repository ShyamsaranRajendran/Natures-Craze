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
      <ToastContainer/>
      <button
        onClick={() => onRemoveItem(item._id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
      >
        <Trash2 className="w-5 h-5" />
      </button>
      <div className="flex gap-4">
        <div className="w-20 h-20 flex-shrink-0">
         
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-md"
              loading="lazy"
            />
            {/* <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
              <Package className="w-6 h-6 text-gray-400" />
            </div> */}
        
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <div className="mt-2 space-y-2">
            {Object.entries(item.quantities || {}).map(([size, qty]) => {
              const price =
                item.prices.find((p) => p.packSize === size)?.price || 0;
              return (
                <div key={size} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pack Size: {size}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item._id, size, -1)}
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{qty}</span>
                    <button
                      onClick={() => onUpdateQuantity(item._id, size, 1)}
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="ml-2 text-gray-900 font-medium">
                      ₹{price * qty}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2">
          <div className="mt-2 flex items-center gap-2">
  <CustomDropdown
    item={item}
    productQuantities={productQuantities}
    onPackSizeChange={onPackSizeChange}
  />
  <button
    onClick={() => onAddToCart(item._id)}
    className="bg-amber-500 text-white px-2 py-1 rounded-md hover:bg-amber-600 text-sm"
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