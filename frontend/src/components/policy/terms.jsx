import React from "react";
import {useNavigate} from "react-router-dom";
function Terms() {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
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
        Terms and Conditions
      </h1>

      <p className="text-gray-700 leading-relaxed mb-4">
        For the purpose of these Terms and Conditions, the term{" "}
        <span className="font-semibold">"we", "us", "our"</span> used anywhere
        on this page shall mean
        <span className="font-semibold"> MOUNESH RAJA V</span>, whose
        registered/operational office is located at
        <span className="italic">
          {" "}
          70, Pudurvellangattuvalasu, Kanagapuram (PO), Erode, Tamil Nadu,
          638112
        </span>
        . The terms
        <span className="font-semibold">
          {" "}
          "you", "your", "user", "visitor"
        </span>{" "}
        shall mean any natural or legal person visiting our website and/or
        agreeing to purchase from us.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Your use of the website and/or purchase from us is governed by the
        following Terms and Conditions:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
        <li>
          The content of the pages on this website is subject to change without
          notice.
        </li>
        <li>
          Neither we nor any third parties provide any warranty or guarantee as
          to the accuracy, timeliness, performance, completeness, or suitability
          of the information and materials found or offered on this website for
          any particular purpose.
        </li>
        <li>
          You acknowledge that such information and materials may contain
          inaccuracies or errors, and we expressly exclude liability for any
          such inaccuracies or errors to the fullest extent permitted by law.
        </li>
        <li>
          Your use of any information or materials on our website and/or product
          pages is entirely at your own risk, for which we shall not be liable.
          It is your responsibility to ensure that any products, services, or
          information available through our website and/or product pages meet
          your specific requirements.
        </li>
        <li>
          Our website contains material that is owned by or licensed to us. This
          material includes, but is not limited to, the design, layout, look,
          appearance, and graphics. Reproduction is prohibited other than in
          accordance with the copyright notice, which forms part of these terms
          and conditions.
        </li>
        <li>
          Unauthorized use of information provided by us shall give rise to a
          claim for damages and/or be a criminal offense.
        </li>
        <li>
          From time to time, our website may include links to other websites.
          These links are provided for your convenience to offer further
          information. You may not create a link to our website from another
          website or document without{" "}
          <span className="font-semibold">MOUNESH RAJA V's</span> prior written
          consent.
        </li>
      </ul>
      <p className="text-gray-700 leading-relaxed mb-4">
        Any dispute arising out of your use of our website, purchase with us, or
        engagement with us is subject to the laws of India. We shall not be
        liable for any loss or damage arising directly or indirectly from the
        decline of authorization for any transaction on account of the
        cardholder exceeding the preset limit mutually agreed by us with our
        acquiring bank from time to time.
      </p>
    </div>
  );
}

export default Terms;
