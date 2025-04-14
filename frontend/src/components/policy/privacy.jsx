import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Mail, Phone, MapPin } from "lucide-react";

function Privacy() {
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
          <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
          <div className="w-6"></div> {/* Spacer for balance */}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="prose prose-amber max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              This privacy policy sets out how{" "}
              <span className="font-semibold text-amber-600">MOUNESH RAJA V</span> uses and protects
              any information that you provide when you visit our website or make purchases.
              We are committed to ensuring that your privacy is protected.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
              <p className="text-gray-700 italic">
                This policy may be updated periodically. Please check this page to stay informed.
              </p>
            </div>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <span className="w-3 h-3 bg-amber-400 rounded-full mr-2"></span>
                Information We Collect
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {[
                  "Name",
                  "Contact information including email address",
                  "Demographic information (postcode, preferences)",
                  "Other information relevant to surveys/offers"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-500 mr-2 mt-1">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <span className="w-3 h-3 bg-amber-400 rounded-full mr-2"></span>
                How We Use the Information
              </h2>
              <ul className="space-y-3 mb-4">
                {[
                  "Internal record keeping",
                  "Improving our products and services",
                  "Sending promotional emails about new products/special offers",
                  "Conducting market research",
                  "Customizing the website according to your interests"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-600 mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Cookies Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <span className="w-3 h-3 bg-amber-400 rounded-full mr-2"></span>
                How We Use Cookies
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700 mb-3">
                  Cookies are small files placed on your device that help analyze web traffic
                  and remember your preferences. We use them to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 pl-4">
                  <li>Identify which pages are being used</li>
                  <li>Improve our website based on usage data</li>
                  <li>Tailor the experience to customer needs</li>
                </ul>
              </div>
              <p className="text-gray-700">
                You can modify browser settings to decline cookies, though this may affect
                website functionality.
              </p>
            </section>

            {/* Controlling Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <span className="w-3 h-3 bg-amber-400 rounded-full mr-2"></span>
                Controlling Your Personal Information
              </h2>
              <p className="text-gray-700 mb-4">
                You may restrict collection or use of your information by:
              </p>
              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-medium text-amber-700 mb-2">Marketing Preferences</h3>
                  <p className="text-gray-700 text-sm">
                    Indicate on forms that your information should not be used for
                    direct marketing.
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-medium text-amber-700 mb-2">Update Information</h3>
                  <p className="text-gray-700 text-sm">
                    Email us to update your preferences or correct inaccurate information.
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                We will not sell, distribute, or lease your personal information to third
                parties unless required by law.
              </p>
            </section>

            {/* Contact Info */}
            <section className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-amber-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700">
                      70, Pudurvellangattuvalasu, Kanagapuram (PO), Erode, Tamil Nadu, 638112
                    </p>
                  </div>
                </div>
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

export default Privacy;