import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FileText, AlertCircle, Shield, Link, Copyright, Scale, Mail, Phone } from "lucide-react";

function Terms() {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with back button */}
        <div className="bg-purple-500 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-purple-100 transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="ml-1 font-medium">Back</span>
          </button>
          <h1 className="text-2xl text-center font-bold text-white">Terms and Conditions</h1>
          <div className="w-6"></div> {/* Spacer for balance */}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="prose prose-purple max-w-none">
            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6 rounded-r-lg flex items-start">
              <FileText className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">
                Please read these terms carefully before using our services. By accessing or using our platform, you agree to be bound by these terms.
              </p>
            </div>

            {/* Definitions Section */}
            <section className="mb-8">
              <div className="flex items-start mb-4">
                <div className="bg-purple-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <Scale className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Definitions</h3>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">"We", "us", "our"</span> refers to <span className="font-semibold">MOUNESH RAJA V</span>, with office at:
                  </p>
                  <p className="text-gray-700 italic mb-2">
                    70, Pudurvellangattuvalasu, Kanagapuram (PO), Erode, Tamil Nadu, 638112
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">"You", "your", "user"</span> refers to any visitor or purchaser on our platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Terms List */}
            <section className="space-y-6">
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Website Content</h3>
                  <p className="text-gray-700">
                    Content on this website may change without notice. We don't guarantee the accuracy, completeness, or suitability of information for any purpose.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">User Responsibility</h3>
                  <p className="text-gray-700">
                    Your use of our website/products is at your own risk. You're responsible for ensuring any products/services meet your requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <Copyright className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Intellectual Property</h3>
                  <p className="text-gray-700">
                    All website content (design, layout, graphics) is owned/licensed to us. Unauthorized reproduction is prohibited.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <Link className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">External Links</h3>
                  <p className="text-gray-700">
                    We may include links to other sites for convenience. Creating links to our site requires prior written consent.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <span className="w-3 h-3 bg-purple-400 rounded-full mr-2"></span>
                  Legal Jurisdiction
                </h3>
                <p className="text-gray-700">
                  Any disputes are subject to Indian laws. We're not liable for transaction declines due to cardholder exceeding preset limits.
                </p>
              </div>
            </section>

            {/* Contact Info */}
            <section className="mt-8 bg-purple-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-3 h-3 bg-purple-400 rounded-full mr-2"></span>
                Questions About Our Terms?
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these terms and conditions, please contact us.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0" />
                  <a href="tel:+919361864257" className="text-gray-700 hover:text-purple-600">
                    +91 9361864257
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0" />
                  <a href="mailto:curcuimin138@gmail.com" className="text-gray-700 hover:text-purple-600">
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

export default Terms;