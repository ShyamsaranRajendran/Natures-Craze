import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultImage from "../assets/default-placeholder.png";
import { ShoppingCart, Phone, Share2, Heart } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const backendURL = process.env.REACT_APP_BACKEND_URL ;
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [userName, setUserName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
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
    }, 2000);
  };
  
   const handleCall = () => {
     const phoneNumber = "+919698904457"; // International format for the phone number
     window.location.href = `tel:${phoneNumber}`;
   };

const handleAddToCart = (product) => {
  // Create a copy of the product without the image buffer
  const { image, ...productWithoutImage } = product;

  // Check if the product is already in the cart
  const existingItem = cart.find(
    (item) =>
      item._id === productWithoutImage._id && item.volume === product.volume
  );

  if (existingItem) {
    // If the product already exists, update the quantity
    const updatedCart = cart.map((item) =>
      item._id === productWithoutImage._id && item.volume === product.volume
        ? { ...item, quantity: item.quantity + 1 } // Increase the quantity of the existing item
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Show toast notification
    toast.success(`${productWithoutImage.name} quantity increased!`, {
      position: "bottom-center",
      autoClose: 3000,
    });
  } else {
    // If the product doesn't exist, add it to the cart without the image
    const updatedCart = [...cart, { ...productWithoutImage, quantity: 1 }];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Show toast notification
    toast.success(`${productWithoutImage.name} added to cart!`, {
      position: "bottom-center",
      autoClose: 3000,
    });
  }
};


  const handleShare = (product) => {
    const productUrl = `${window.location.origin}/product/${product._id}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Use clipboard API if available
      navigator.clipboard
        .writeText(productUrl)
        .then(() =>
          console.log(`Product link copied to clipboard: ${productUrl}`)
        )
        .catch(() => alert("Failed to copy the product link."));
    } else {
      // Fallback for devices or browsers that do not support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = productUrl;
      textArea.style.position = "fixed"; // Avoid scrolling to bottom
      textArea.style.left = "-9999px"; // Hide from view
      document.body.appendChild(textArea);
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        const message = successful
          ? "Product link copied to clipboard!"
          : "Failed to copy the product link.";
      } catch (err) {
        alert("Your browser does not support clipboard copy.");
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-customYellow">
        <div
          className="border-4 border-gray-300 border-t-black rounded-full w-12 h-12 animate-spin"
          aria-label="Loading..."
        ></div>
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
        <p className="text-gray-800 mb-4">{product.description}</p>
        <p className="text-2xl font-bold text-gray-900 mt-4">
          ₹{product.price}
        </p>
        <p className=" mt-2">
          Stock : <span className="text-green-600">{product.stock}</span>
        </p>
        <p className=" mt-2">
          Rating : <span className="text-yellow-500"> {product.rating}</span>⭐
        </p>

        <div className="flex justify-between items-center px-0 py-4 border-t border-gray-200">
          <button
            className="flex items-center text-blue-500"
            onClick={() => handleShare(product)}
          >
            <Share2 className="w-5 h-5 mr-2" /> Share
          </button>
          {/* <button
            className="flex items-center text-pink-500"
            onClick={() => handleInterest(product)}
          >
            <Heart className="w-5 h-5 mr-2" /> Show Interest
          </button> */}
          <button className="flex items-center text-red-500"
                              onClick={handleCall}
                            >
                              <Phone className="w-5 h-5 mr-1" /> Call
                            </button>
           <button className="flex items-center text-green-500"
                              onClick={() => handleAddToCart(product)}
                            >
                              <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
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

      {/* {showContactAgreement && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our team will contact you. Please provide your details.
            </h2>
            {contact ? (
              <p className="mt-4 text-lg font-medium text-gray-700">
                {contact}
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleContactAgreement("agree");
                }}
              >
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg mr-4"
                  >
                    Agree
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    onClick={() => handleContactAgreement("disagree")}
                  >
                    Disagree
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ProductDetails;
