import React from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const CheckoutModal = ({
  showCheckoutModal,
  setShowCheckoutModal,
  userDetails,
  handleInputChange,
  handleConfirmCheckout,
  isProcessing,
  calculateTotal, // Pass the calculateTotal function from the parent component
}) => {
  if (!showCheckoutModal) return null;

  // Validate the total amount before proceeding
  const validateAndConfirmCheckout = () => {
    const totalAmount = calculateTotal();

    if (totalAmount === 0 || totalAmount === null) {
      toast.error("Please select a valid pack size and quantity before proceeding.");
      return;
    }

    // If the amount is valid, proceed with the checkout
    handleConfirmCheckout();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={() => setShowCheckoutModal(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Checkout Details
        </h2>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={userDetails.username}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500 text-gray-900"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={userDetails.phoneNumber}
              onChange={handleInputChange}
              maxLength={10}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500 text-gray-900"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Alternate Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alternate Phone Number
            </label>
            <input
              type="tel"
              name="alternatePhoneNumber"
              value={userDetails.alternatePhoneNumber}
              onChange={handleInputChange}
              maxLength={10}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500 text-gray-900"
              placeholder="Optional alternate number"
            />
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={userDetails.address}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500 text-gray-900 resize-none"
              placeholder="Enter your full address"
              required
            />
          </div>

          {/* Confirm Order Button */}
          <button
            onClick={validateAndConfirmCheckout} // Use the validation function here
            disabled={isProcessing}
            className="w-full bg-amber-500 text-white font-semibold py-2 rounded-lg hover:bg-amber-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;