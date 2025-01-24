import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Phone,
  Share2,
  Heart,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DefaultImage from "../../assets/default-placeholder.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // New state to manage the selected image for enlarge modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const navigate = useNavigate();

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
    const regex = new RegExp(searchTerm, "i");
    return (
      regex.test(product.name) ||
      (product.weight && regex.test(product.weight.toString()))
    );
  });

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${backendURL}/prod/delete/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProducts(products.filter((product) => product._id !== id));
        toast.success("Product deleted successfully!");
      } else {
        throw new Error("Failed to delete product.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (product) => {
    navigate(`/admin/products/edit/${product._id}`);
  };

  const handleAddProduct = () => {
    navigate("/admin/products/add");
  };

  // Function to handle image click and open the modal
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="container mx-auto px-6 py-10 mt-10">
      <ToastContainer />

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
        <button
          onClick={handleAddProduct}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-all"
        >
          <PlusCircle size={22} className="mr-2" />
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading/Error States */}
      {loading ? (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin-slow"></div>
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        // Products Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white border rounded-lg shadow hover:shadow-md transition-all p-4 flex flex-col"
            >
              <img
                src={product.image || DefaultImage}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-4 cursor-pointer"
                onClick={() => handleImageClick(product.image || DefaultImage)} // Open modal on image click
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                {/* <p className="text-gray-600 text-sm">
                  {product.description || "No description available"}
                </p> */}
                <p className="text-gray-600 text-sm line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="mt-4 flex justify-between space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-all flex items-center justify-center"
                >
                  <Edit size={18} className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-all flex items-center justify-center"
                >
                  <Trash2 size={18} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Enlarged Image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeModal} // Close modal when clicking outside of the image
        >
          <div
            className="relative bg-white p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside the image
          >
            <button
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full px-3 py-1"
              onClick={closeModal}
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Enlarged Product"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;