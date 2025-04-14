import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Mail, Phone, AlertTriangle, Clock, Package, Shield } from "lucide-react";

function Refund() {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with back button */}
        <div className="bg-amber-500 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-amber-100 transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="ml-1 font-medium">Back</span>
          </button>
          <h1 className="text-2xl text-center font-bold text-white">Refund & Cancellation Policy</h1>
          <div className="w-6"></div> {/* Spacer for balance */}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="prose prose-amber max-w-none">
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">
                <span className="font-semibold">MOUNESH RAJA V</span> believes in helping its customers 
                and has therefore adopted a liberal cancellation policy.
              </p>
            </div>

            {/* Policy Points */}
            <section className="space-y-6">
              <div className="flex items-start">
                <div className="bg-amber-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Cancellation Timeframe</h3>
                  <p className="text-gray-700">
                    Cancellations will be considered only if requested within <span className="font-semibold text-amber-600">3-5 days</span> of ordering. 
                    Requests may not be honored if vendors have already initiated shipping.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <Package className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Perishable Items</h3>
                  <p className="text-gray-700">
                    We generally don't accept cancellations for perishable items. Refunds/replacements 
                    are only possible if product quality is unsatisfactory upon delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Damaged/Defective Products</h3>
                  <p className="text-gray-700">
                    Report damaged items within <span className="font-semibold text-amber-600">3-5 days</span> of receipt. 
                    We'll verify with the merchant before processing any claims.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Manufacturer Warranties</h3>
                  <p className="text-gray-700">
                    For products with manufacturer warranties, please contact the manufacturer directly 
                    for any issues covered under their warranty terms.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <span className="w-3 h-3 bg-amber-400 rounded-full mr-2"></span>
                  Refund Processing Time
                </h3>
                <p className="text-gray-700">
                  Approved refunds will be processed within <span className="font-semibold text-amber-600">3-5 business days</span>. 
                  The time for the refund to reflect in your account may vary depending on your bank.
                </p>
              </div>
            </section>

            {/* Contact Info */}
            <section className="mt-8 bg-amber-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-3 h-3 bg-amber-400 rounded-full mr-2"></span>
                Need Help?
              </h2>
              <p className="text-gray-700 mb-4">
                For any questions about our refund policy or to initiate a return, please contact our customer service team.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0" />
                  <a href="tel:+919361864257" className="text-gray-700 hover:text-amber-600">
                    +91 9361864257
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0" />
                  <a href="mailto:curcuimin138@gmail.com" className="text-gray-700 hover:text-amber-600">
                    curcuimin138@gmail.com
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Refund;