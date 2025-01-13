import React, { useState, useEffect } from "react";
import { ShoppingCart, Phone, Share2, Heart } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [contact, setContact] = useState(null); // For contact agreement state
  const [showContactAgreement, setShowContactAgreement] = useState(false); // For toggling the contact agreement modal

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/prod/all");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Products:", data.products);
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  const handleShare = (product) => {
    const productUrl = window.location.href + `/product/${product._id}`;

    // Use Clipboard API to copy the product URL
    navigator.clipboard
      .writeText(productUrl)
      .then(() => {
        alert(`Product link copied to clipboard: ${productUrl}`);
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        alert("Failed to copy the product link.");
      });
  };

  const handleCall = () => {
    alert("Dialing our customer service...");
  };

  const handleInterest = (product) => {
    setShowContactAgreement(true); // Show contact agreement modal when user expresses interest
  };

  const handleContactAgreement = async (response) => {
    if (response === "agree") {
      setContact("Thank you for agreeing! We will contact you.");

      // Send the product link to the backend/admin
      try {
        const productUrl = window.location.href;
        const productDetails = {
          message: "User agreed to contact. Here is the product link:",
          productUrl,
        };

        const response = await fetch(
          "http://localhost:5000/contact-agreement",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productDetails),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send the link to the backend.");
        }

        alert("The link has been sent to the admin.");
      } catch (err) {
        console.error("Error sending contact agreement:", err);
        alert("Failed to send the link to the backend.");
      }
    } else {
      setContact("You have disagreed. We won't contact you.");
    }

    setShowContactAgreement(false); // Close the modal after agreement
  };

  if (loading) {
    return (
      <div className="text-center text-lg font-medium text-gray-700 mt-10">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-lg font-medium text-red-500 mt-10">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-lg font-medium text-gray-600">
          No products available.
        </p>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Available Products
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={product.imageURL}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {product.description}
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-3">
                    ${product.price}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-green-600">
                      Stock: {product.stock}
                    </span>
                    <span className="text-sm text-yellow-500">
                      Rating: {product.rating}⭐
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center p-4 border-t border-gray-200">
                  <button
                    className="flex items-center text-blue-500"
                    onClick={() => handleShare(product)}
                  >
                    <Share2 className="w-5 h-5 mr-2" /> Share
                  </button>
                  <button
                    className="flex items-center text-green-500"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                  </button>
                  <button
                    className="flex items-center text-red-500"
                    onClick={handleCall}
                  >
                    <Phone className="w-5 h-5 mr-2" /> Call
                  </button>
                  <button
                    className="flex items-center text-pink-500"
                    onClick={() => handleInterest(product)}
                  >
                    <Heart className="w-5 h-5 mr-2" /> Interest
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Agreement Modal */}
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

export default Products;
