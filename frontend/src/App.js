import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Contact from "./components/Contact";
import About from "./components/About";
import Products from "./components/Products";
import ProductDetails from "./components/ProductDetails";
import AdminDashboard from "./components/admin/dashboard"; 
import AdminProducts from "./components/admin/products";
import AdminAddProducts from "./components/admin/Addproduct"
import AdminEditProducts from "./components/admin/EditProduct"
import Cart from "./components/cart";
const backendURL = process.env.REACT_APP_BACKEND_URL;
const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl font-bold text-red-500">404</h1>
    <p className="text-lg">Page Not Found</p>
    <a
      href="/"
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Go to Home
    </a>
  </div>
);

const fetchUserRole = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    if (!token) {
      console.error("No token found in localStorage");
      return null; // Return null if there's no token
    }

    // Make the request with the token in the Authorization header
    const response = await axios.get(`${backendURL}/auth/role`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      },
    });
    console.log(response.data);
    return response.data; // Return the role from backend response
  } catch (error) {
    if (error.response) {
      // Handle different HTTP status codes (e.g., 401 Unauthorized or 403 Forbidden)
      if (error.response.status === 401) {
        console.error("Unauthorized: Token is missing or invalid");
      } else if (error.response.status === 403) {
        console.error("Forbidden: Access is denied");
      } else {
        console.error("An error occurred:", error.response.data);
      }
    } else {
      console.error("Error fetching user role:", error);
    }
    return null; // Default to no role if fetching fails
  }
};



// PrivateRoute Component for Secure Role-Based Access
const PrivateRoute = ({ children, allowedRoles }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRole = async () => {
      const fetchedRole = await fetchUserRole();
      console.log("Fetched Role:", fetchedRole); // Log the fetched role
      setRole(fetchedRole);
      setLoading(false);
    };
    getRole();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="border-4 border-gray-300 border-t-black rounded-full w-12 h-12 animate-spin"
          aria-label="Loading..."
        ></div>
      </div>
    );
  }

  if (!role) {
    console.log("No role, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("Role in PrivateRoute:", role?.user?.role); // Debug log for the role

  // Ensure the role comparison is strict and exact
  if (!allowedRoles.includes(role?.user?.role)) {
    console.log("Unauthorized role, redirecting to home");
    return <Navigate to="/" replace />;
  }

  return children;
};





function App() {

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getRole = async () => {
      const roleData = await fetchUserRole();
      if (roleData?.user?.role === "admin") {
        setIsAdmin(true);
      }
    };
    getRole();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Main Layout */}
        <Route path="/" element={<Layout  isAdmin={isAdmin}  />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />

          {/* Protected Admin Routes */}
          <Route
            path="admin/dashboard"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/products"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminProducts />
              </PrivateRoute>
            }
          />
          <Route 
          path="admin/products/add"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminAddProducts/>
            </PrivateRoute>
          }
          />
          <Route 
          path="admin/products/edit/:id"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminEditProducts/>
            </PrivateRoute>
          }
          />

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
