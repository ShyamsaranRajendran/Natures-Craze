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
        <div className="flex items-center justify-center h-40">
          <div
            className="border-4 border-gray-300 border-t-blue-500 rounded-full w-12 h-12 animate-spin"
            aria-label="Loading..."
          ></div>
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
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {product.description || "No description available"}
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
    </div>
  );
};

export default Products;
