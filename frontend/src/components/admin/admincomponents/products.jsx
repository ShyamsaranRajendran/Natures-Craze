import React, { useState, useEffect } from "react";
import axios from "axios";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    weight: "",
    minPrice: "",
    maxPrice: "",
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendURL}/prod/all`);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !filters.search ||
      product.name.toLowerCase().includes(filters.search.toLowerCase());

    const matchesWeight = !filters.weight || product.weight === filters.weight;

    const matchesPrice =
      (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) &&
      (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice));

    return matchesSearch && matchesWeight && matchesPrice;
  });

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
        <div className="absolute inset-3 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin-slow"></div>
      </div>
    </div>
  );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Products</h1>

      {/* Filters Section */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by product name"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/3"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b">Product ID</th>
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Description</th>
              <th className="px-6 py-3 border-b">Prices</th>
              <th className="px-6 py-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-100 transition duration-150"
                >
                  <td className="px-6 py-4 border-b">{product._id}</td>
                  <td className="px-6 py-4 border-b font-medium">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 border-b  text-gray-600">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 border-b w-1/4">
                    {product.prices.map((priceOption, index) => (
                      <div
                        key={index}
                        className="mb-1 p-2 bg-gray-50 rounded-lg shadow-sm"
                      >
                        <p>
                          <strong>Pack:</strong> {priceOption.packSize},{" "}
                          <strong>Price:</strong> ₹{priceOption.price}
                        </p>
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-150"
                      onClick={() =>
                        (window.location.href = `/admin/products/edit/${product._id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-gray-500 border-b"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
