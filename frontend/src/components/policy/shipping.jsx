import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Truck, Clock, Shield, Mail, Phone, MapPin } from "lucide-react";

function Shipping() {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with back button */}
        <div className="bg-blue-500 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-blue-100 transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="ml-1 font-medium">Back</span>
          </button>
          <h1 className="text-2xl text-center font-bold text-white">Shipping Information</h1>
          <div className="w-6"></div> {/* Spacer for balance */}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="prose prose-blue max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg flex items-start">
              <Truck className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">
                <span className="font-semibold">MOUNESH RAJA V</span> ships orders worldwide through reliable courier services to ensure your items arrive safely.
              </p>
            </div>

            {/* Shipping Points */}
            <section className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Shipping Methods</h3>
                  <p className="text-gray-700">
                    For international buyers, orders are shipped through registered international courier companies or speed post. Domestic orders are shipped via registered domestic couriers or speed post.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Processing Time</h3>
                  <p className="text-gray-700">
                    Orders are shipped within <span className="font-semibold text-blue-600">6-8 days</span> or as per the delivery date agreed at order confirmation. We guarantee to hand over to courier within this timeframe, but delivery times depend on courier/postal service.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Delivery Address</h3>
                  <p className="text-gray-700">
                    All orders will be delivered to the address provided during checkout. Please ensure your shipping address is complete and accurate.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Tracking & Notifications</h3>
                  <p className="text-gray-700">
                    You will receive shipping confirmation and tracking information via email once your order is dispatched. Delivery notifications will be sent as specified during registration.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                  International Shipping Note
                </h3>
                <p className="text-gray-700">
                  International shipments may be subject to customs delays and import duties which are the responsibility of the buyer. Please check your country's import regulations before ordering.
                </p>
              </div>
            </section>

            {/* Contact Info */}
            <section className="mt-8 bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                Shipping Questions?
              </h2>
              <p className="text-gray-700 mb-4">
                For any inquiries about your order's shipping status or delivery issues, please contact our customer service.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                  <a href="tel:+919361864257" className="text-gray-700 hover:text-blue-600">
                    +91 9361864257
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                  <a href="mailto:curcuimin138@gmail.com" className="text-gray-700 hover:text-blue-600">
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

export default Shipping;