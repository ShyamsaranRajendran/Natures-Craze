import React from "react";
import {useNavigate} from "react-router-dom";
function Privacy() {
  const navigate = useNavigate(); 
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-800 mr-4 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring focus:ring-gray-300"
          aria-label="Go Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        Privacy Policy
      </h1>

      <p className="text-gray-700 leading-relaxed mb-4">
        This privacy policy sets out how{" "}
        <span className="font-semibold">MOUNESH RAJA V</span> uses and protects
        any information that you give{" "}
        <span className="font-semibold">MOUNESH RAJA V</span> when you visit
        their website and/or agree to purchase from them.
        <span className="font-semibold"> MOUNESH RAJA V</span> is committed to
        ensuring that your privacy is protected. Should we ask you to provide
        certain information by which you can be identified when using this
        website, you can be assured that it will only be used in accordance with
        this privacy statement.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        <span className="font-semibold">MOUNESH RAJA V</span> may change this
        policy from time to time by updating this page. You should check this
        page periodically to ensure that you adhere to any changes.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Information We Collect
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>Name</li>
        <li>Contact information including email address</li>
        <li>
          Demographic information such as postcode, preferences, and interests
        </li>
        <li>Other information relevant to customer surveys and/or offers</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        How We Use the Information
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>Internal record keeping</li>
        <li>Improving our products and services</li>
        <li>
          Sending periodic promotional emails about new products, special
          offers, or other information using the email address you provided
        </li>
        <li>
          Conducting market research and contacting you by email, phone, fax, or
          mail
        </li>
        <li>Customizing the website according to your interests</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        How We Use Cookies
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        A cookie is a small file placed on your computer's hard drive with your
        permission. Cookies help analyze web traffic or let you know when you
        visit a particular site. They allow web applications to respond to your
        preferences. We use traffic log cookies to identify which pages are
        being used to improve our website and tailor it to customer needs. The
        information is used for statistical analysis and then removed from the
        system.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Cookies help us provide you with a better website but do not give us
        access to your computer or personal information other than what you
        choose to share. You can choose to accept or decline cookies by
        modifying your browser settings, though this may limit website
        functionality.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Controlling Your Personal Information
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        You may restrict the collection or use of your personal information in
        the following ways:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>
          Indicate on forms that your information should not be used for direct
          marketing.
        </li>
        <li>
          If you've previously agreed to direct marketing, you can change your
          preference by emailing us at{" "}
          <span className="text-blue-600">curcuimin138@gmail.com</span>.
        </li>
      </ul>
      <p className="text-gray-700 leading-relaxed mb-4">
        We will not sell, distribute, or lease your personal information to
        third parties unless required by law or with your permission. You may
        request corrections for inaccurate information by contacting us at:
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        <span className="font-semibold">Address:</span> 70,
        Pudurvellangattuvalasu, Kanagapuram (PO), Erode, Tamil Nadu, 638112{" "}
        <br />
        <span className="font-semibold">Phone:</span> +91 9361864257 <br />
        <span className="font-semibold">Email:</span>{" "}
        <span className="text-blue-600">curcuimin138@gmail.com</span>
      </p>
    </div>
  );
}

export default Privacy;
