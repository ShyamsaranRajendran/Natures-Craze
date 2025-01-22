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
    <div className="flex items-center justify-center h-screen bg-white">
      <div
        className="border-4 border-gray-300 border-t-black rounded-full w-12 h-12 animate-spin"
        aria-label="Loading..."
      ></div>
    </div>
  );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>

      {/* Filters Section */}
      <div className="mb-6 overflow-x-auto">
        <div className="grid grid-cols-[repeat(5,minmax(200px,1fr))] gap-4">
          <input
            type="text"
            placeholder="Search by product name"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border p-2 rounded-md w-full"
          />
         
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Product ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Prices</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="border px-4 py-2">{product._id}</td>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">{product.description}</td>
                  <td className="border px-4 py-2">
                    {product.prices.map((priceOption, index) => (
                      <div key={index} className="mb-2">
                        <p>
                          <strong>Pack:</strong> {priceOption.packSize},{" "}
                          <strong>Price:</strong> ₹{priceOption.price}
                        </p>
                      </div>
                    ))}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      onClick={() =>
                        (window.location.href = `/admin/products/${product._id}`)
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
                  className="border px-4 py-2 text-center text-gray-500"
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
