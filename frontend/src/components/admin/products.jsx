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

  const navigate = useNavigate(); // Use navigate for programmatic navigation

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
    navigate(`/admin/products/edit/${product._id}`); // Navigate to the Edit Product page
  };

  const handleAddProduct = () => {
    navigate("/admin/products/add"); // Navigate to the Add Product page
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <ToastContainer />

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className="border rounded-lg px-4 py-2 flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleAddProduct} // Trigger Add Product navigation
          className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg flex items-center"
        >
          <PlusCircle size={22} className="" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-screen bg-white">
          <div
            className="border-4 border-gray-300 border-t-black rounded-full w-12 h-12 animate-spin"
            aria-label="Loading..."
          ></div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 shadow hover:shadow-md"
            >
              <img
                src={product.image || DefaultImage}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <div>
                <h3 className="text-lg font-bold">{product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg text-lg"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg text-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
