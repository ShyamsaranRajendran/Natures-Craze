import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [productWeight, setProductWeight] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !productWeight || !productImage || !price) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("weight", productWeight);
    formData.append("image", productImage);
    formData.append("description", productDescription);
    formData.append("price", price);

    setLoading(true);

    try {
      const response = await fetch(`${backendURL}/prod/add`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Product added successfully!");
        navigate("/admin/products");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add product.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Weight (kg)</label>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded-lg px-4 py-2"
            value={productWeight}
            onChange={(e) => setProductWeight(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Price ($)</label>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded-lg px-4 py-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            className="w-full border rounded-lg px-4 py-2"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            rows="4"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
