import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Refund() {
  const navigate = useNavigate();
  useEffect(() => {
      window.scrollTo(0, 0);
    });
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-10 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-14 right-4 text-gray-600 bg-gray-100 hover:text-gray-800 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring focus:ring-gray-300"
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
      <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      
        Refund and Cancellation Policy
      </h1>

      <p className="text-gray-700 leading-relaxed mb-4">
        <span className="font-semibold">MOUNESH RAJA V</span> believes in
        helping its customers as far as possible and has therefore adopted a
        liberal cancellation policy. Under this policy:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>
          Cancellations will be considered only if the request is made within{" "}
          <span className="font-semibold">3-5 days</span> of placing the order.
          However, the cancellation request may not be entertained if the orders
          have been communicated to the vendors/merchants and they have
          initiated the process of shipping them.
        </li>
        <li>
          <span className="font-semibold">MOUNESH RAJA V</span> does not accept
          cancellation requests for perishable items like flowers, eatables,
          etc. However, a refund or replacement can be made if the customer
          establishes that the quality of the product delivered is not good.
        </li>
        <li>
          In case of receipt of damaged or defective items, please report the
          same to our Customer Service team. The request will, however, be
          entertained once the merchant has checked and determined the same at
          their own end. This should be reported within{" "}
          <span className="font-semibold">3-5 days</span> of receipt of the
          products.
        </li>
        <li>
          If you feel that the product received is not as shown on the site or
          as per your expectations, you must bring it to the notice of our
          Customer Service team within{" "}
          <span className="font-semibold">3-5 days</span> of receiving the
          product. The Customer Service team, after reviewing your complaint,
          will take an appropriate decision.
        </li>
        <li>
          For products with a manufacturer warranty, please refer the issue to
          the manufacturer directly.
        </li>
        <li>
          In case of any refunds approved by{" "}
          <span className="font-semibold">MOUNESH RAJA V</span>, it will take{" "}
          <span className="font-semibold">3-5 days</span> for the refund to be
          processed to the end customer.
        </li>
      </ul>
      <p className="text-gray-700 leading-relaxed">
        For further assistance, please contact our Customer Service team.
      </p>
    </div>
  );
}

export default Refund;
