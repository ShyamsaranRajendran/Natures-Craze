import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendURL = process.env.REACT_APP_BACKEND_URL;

function EditProduct() {
  const { id } = useParams(); // Extract the product ID from the URL
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    weight: "",
    desc: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null); // For the new image file
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); // Start loading state
        const response = await fetch(`${backendURL}/prod/${id}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch product details (status: ${response.status})`
          );
        }
        const data = await response.json();
        if (data.product) {
          setProduct({
            name: data.product.name || "",
            weight: data.product.weight || "",
            desc: data.product.description || "", // Autofill description
            image: data.product.image || "",
          });
        } else {
          throw new Error("Product not found.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("weight", product.weight);
    formData.append("desc", product.desc); // Append the description

    if (imageFile) {
      formData.append("image", imageFile); // Attach the image file if provided
    }

    try {
      const response = await fetch(`${backendURL}/prod/update/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        toast.success("Product updated successfully!");
        navigate("/admin/products"); // Navigate back to the products list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading product details...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-lg font-medium mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Weight (g):</label>
          <input
            type="text"
            name="weight"
            value={product.weight}
            onChange={handleInputChange}
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Description:</label>
          <textarea
            name="desc"
            value={product.desc}
            onChange={handleInputChange}
            className="border rounded-lg px-4 py-2 w-full h-24"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            Upload New Image:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            Current Image:
          </label>
          <img
            src={product.image || "https://via.placeholder.com/150"}
            alt={product.name || "Product Image"}
            className="w-40 h-40 object-cover rounded-lg"
          />
        </div>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Update Product
        </button>
      </div>
    </div>
  );
}

export default EditProduct;
