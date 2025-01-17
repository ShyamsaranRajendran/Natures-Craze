import React, { useState, useEffect } from "react";
import { ShoppingCart, Phone, Share2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import DefaultImage from "../assets/default-placeholder.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const backendURL=process.env.REACT_APP_BACKEND_URL;
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [contact, setContact] = useState(null);
  const [showContactAgreement, setShowContactAgreement] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [userName, setUserName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${backendURL}/prod/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const regex = new RegExp(searchTerm, "i"); // Case-insensitive regex for matching
    return (
      regex.test(product.name) ||
      (product.weight && regex.test(product.weight.toString())) // Check weight as a string
    );
  });

    useEffect(() => {
      const storedCart = JSON.parse(localStorage.getItem("cart"));
      if (storedCart) {
        setCart(storedCart);
      }
    }, []);

    // Handle adding a product to the cart
    // const handleAddToCart = (product) => {
    //   const updatedCart = [...cart, product];
    //   setCart(updatedCart);

    //   // Store the updated cart in localStorage
    //   localStorage.setItem("cart", JSON.stringify(updatedCart));

    //   // Show toast notification
    //   toast.success(`${product.name} added to cart!`, {
    //     position: "bottom-center",
    //     autoClose: 3000,
    //   });
    // };


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
       .then(() => console.log(`Product link copied to clipboard: ${productUrl}`))
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

 const handleCall = () => {
   const phoneNumber = "+919698904457"; // International format for the phone number
   window.location.href = `tel:${phoneNumber}`;
 };


  const handleInterest = (product) => {
    setCurrentProductId(product._id);
    setShowContactAgreement(true);
  };
 const handleContactAgreement = async (response) => {
   if (response === "agree") {
     if (!userName || !mobileNumber) {
       alert("Please provide both your name and mobile number.");
       return;
     }

     setContact("Thank you for agreeing! We will contact you.");
     const productUrl = `http://localhost:3000/products/${currentProductId}`;

     try {
       const interestDetails = {
         productId: currentProductId,
         productUrl,
         message: `User is interested in this product.`,
         name: userName,
         mobile: mobileNumber,
       };

       const res = await fetch(`${backendURL}/orders/interest`, {
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
     setCurrentProductId(null);
     setUserName("");
     setMobileNumber("");
   }, 2000);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/product/${product._id}`} className="block">
                  <img
                    src={product.image || DefaultImage}
                    alt={product.name}
                    className="w-full h-48 lg:h-60 object-cover"
                  />
                </Link>
                <div className="p-4 flex flex-col space-y-2">
                  <h3 className="font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    Weight: {product.weight || "N/A"}
                  </p>
                  <p className="font-bold text-gray-900">₹ {product.price}</p>
                  {/* <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Stock: {product.stock}</span>
                    <span>Rating: {product.rating}⭐</span>
                  </div> */}
                </div>
                <div className="p-4 flex justify-between items-center border-t">
                  <button
                    className="flex items-center text-blue-500"
                    onClick={() => handleShare(product)}
                  >
                    <Share2 className="w-5 h-5 mr-1" /> Share
                  </button>
                  <button
                    className="flex items-center text-red-500"
                    onClick={handleCall}
                  >
                    <Phone className="w-5 h-5 mr-1" /> Call
                  </button>
                  {/* <button
                    className="flex items-center text-pink-500"
                    onClick={() => handleInterest(product)}
                  >
                    <Heart className="w-5 h-5 mr-1" /> Interest
                  </button> */}
                  <button
                    className="flex items-center text-green-500"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

export default Products;
