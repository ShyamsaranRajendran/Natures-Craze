import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultImage from "../assets/default-placeholder.png";
const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [contact, setContact] = useState(null);
  const [showContactAgreement, setShowContactAgreement] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${backendURL}/prod/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data.product);
        setRecommendedProducts(data.recommendedProducts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleBuyNow = () => {
    // Redirect to the checkout page with product details
    navigate(`/checkout/${id}`);
  };

  const handleInterest = () => {
    setShowContactAgreement(true);
  };

  const handleContactAgreement = async (response) => {
    if (response === "agree") {
      setContact("Thank you for agreeing! We will contact you.");
      const productUrl = `http://localhost:3000/products/${id}`;

      try {
        const interestDetails = {
          productId: id,
          productUrl,
          message: `User is interested in this product.`,
        };

        const res = await fetch(`${backendURL}/order/interest`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(interestDetails),
        });

        if (!res.ok) throw new Error("Failed to send interest details.");
      } catch (err) {
        console.error("Error sending contact agreement:", err);
      }
    } else {
      setContact("You have disagreed.");
    }

    setTimeout(() => {
      setShowContactAgreement(false);
      setContact(null);
    }, 3000);
  };

  const handleShare = () => {
    const shareURL = `${window.location.origin}/product/${id}`;
    navigator.clipboard.writeText(shareURL).then(() => {
      alert("Product link copied to clipboard!");
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        <p className="ml-4 text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        {/* Check if the image is Base64 or URL */}
        <img
          src={product.image ? `${product.image}` : DefaultImage}
          alt={product.name}
          className="w-full h-48 object-cover mb-6 rounded-lg"
        />
        <p className="text-lg mb-4">{product.description}</p>
        <p className="text-2xl font-bold text-gray-900 mt-4">
          ₹{product.price}
        </p>
        <p className="text-green-600 mt-2">Stock: {product.stock}</p>
        <p className="text-yellow-500 mt-2">Rating: {product.rating}⭐</p>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleShare}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Share
          </button>
          <button
            onClick={handleInterest}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Show Interest
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Buy Now
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recommended Products</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {recommendedProducts.map((recProduct) => (
            <div
              key={recProduct._id}
              className="bg-white shadow-md rounded-lg p-4 w-60 flex-shrink-0"
            >
              <img
                src={recProduct.image ? `${recProduct.image}` : DefaultImage}
                alt={recProduct.name}
                className="h-40 w-full object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-medium">{recProduct.name}</h3>
              <p className="text-gray-600">₹{recProduct.price}</p>
              <a
                href={`/product/${recProduct._id}`}
                className="text-blue-500 mt-2 inline-block"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      </div>

      {showContactAgreement && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Will our team contact you?
            </h2>
            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg mr-4"
                onClick={() => handleContactAgreement("agree")}
              >
                Agree
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={() => handleContactAgreement("disagree")}
              >
                Disagree
              </button>
            </div>
            {contact && (
              <p className="mt-4 text-lg font-medium text-gray-700">
                {contact}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
