import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productDescription, setProductDescription] = useState("");
  const [prices, setPrices] = useState([{ packSize: "", price: "" }]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024;
      if (!isImage) {
        toast.error("Please select a valid image file.");
        return;
      }
      if (!isValidSize) {
        toast.error("Image size should not exceed 5MB.");
        return;
      }
      setProductImage(file);
    }
  };

  const handlePriceChange = (index, field, value) => {
    const updatedPrices = [...prices];
    updatedPrices[index][field] = value;
    setPrices(updatedPrices);
  };

  const addPriceField = () => {
    setPrices([...prices, { packSize: "", price: "" }]);
  };

  const removePriceField = (index) => {
    const updatedPrices = prices.filter((_, i) => i !== index);
    setPrices(updatedPrices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !productImage || prices.length === 0) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("prices", JSON.stringify(prices));
    formData.append("image", productImage);

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
    <div className="container mx-auto px-4 mt-16 lg:mt-20">
      <ToastContainer />
      <h2 className="text-xl lg:text-2xl font-bold mb-6 text-center">
        Add Product
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full mx-auto bg-white p-4 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-sm lg:text-base font-medium mb-2">
            Product Name
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2 text-sm lg:text-base"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm lg:text-base font-medium mb-2">
            Description
          </label>
          <textarea
            className="w-full border rounded-lg px-4 py-2 text-sm lg:text-base"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            rows="4"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm lg:text-base font-medium mb-2">
            Prices
          </label>
          {prices.map((price, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row gap-2 lg:gap-4 mb-2"
            >
              <input
                type="text"
                className="w-full lg:flex-1 border rounded-lg px-4 py-2 text-sm lg:text-base"
                placeholder="Pack Size (e.g., 500g)"
                value={price.packSize}
                onChange={(e) =>
                  handlePriceChange(index, "packSize", e.target.value)
                }
                required
              />
              <input
                type="number"
                step="0.01"
                className="w-full lg:flex-1 border rounded-lg px-4 py-2 text-sm lg:text-base"
                placeholder="Price"
                value={price.price}
                onChange={(e) =>
                  handlePriceChange(index, "price", e.target.value)
                }
                required
              />
              <button
                type="button"
                onClick={() => removePriceField(index)}
                className="text-red-500 text-sm lg:text-base"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPriceField}
            className="text-blue-500 text-sm lg:text-base"
          >
            Add Price
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm lg:text-base font-medium mb-2">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-lg px-4 py-2 text-sm lg:text-base"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm lg:text-base ${
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
