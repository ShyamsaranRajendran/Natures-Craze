import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import { Provider } from "react-redux";
import store from "./redux/store";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/common/LoadingSpinner";
import NotFound from "./components/common/NotFound";
import ScrollToTop from "./components/common/ScrollTop";
// Environment configuration
const backendURL = process.env.REACT_APP_BACKEND_URL;

// Lazy-loaded components for better performance
const Home = lazy(() => import("./components/Home"));
const Login = lazy(() => import("./components/auth/Login"));
const Register = lazy(() => import("./components/auth/SignUp"));
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));
const Contact = lazy(() => import("./components/Contact"));
const About = lazy(() => import("./components/About"));
const Products = lazy(() => import("./components/Products"));
// const ProductDetails = lazy(() => import("./components/ProductDetails"));
const Cart = lazy(() => import("./components/cart/cart"));
const CheckOut = lazy(() => import("./components/checkout-copy"));
const Privacy = lazy(() => import("./components/policy/privacy"));
const Terms = lazy(() => import("./components/policy/terms"));
const Refund = lazy(() => import("./components/policy/refund"));
const Shipping = lazy(() => import("./components/policy/shipping"));
const PaymentFail = lazy(() => import("./components/paymentFail"));
const PaymentSuccess = lazy(() => import("./components/paymentSuccess"));
const Developer = lazy(() => import("./components/Developer"));

// Admin components with lazy loading
const AdminDashboard = lazy(() => import("./components/admin/dashboard"));
const AdminProducts = lazy(() => import("./components/admin/products"));
const AdminAddProducts = lazy(() => import("./components/admin/Addproduct"));
const AdminEditProducts = lazy(() => import("./components/admin/EditProduct"));
const AdminOrder = lazy(() => import("./components/admin/order/orders"));
const AdminOrderDetail = lazy(() => import("./components/admin/order/orderDetail"));
const AdminProcessing = lazy(() => import("./components/admin/order/ProcessingOrders"));
const AdminProcessed = lazy(() => import("./components/admin/order/ProcessedOrder"));
const AdminFailedOrders = lazy(() => import("./components/admin/order/failedOrders"));

// API service abstraction
const authService = {
  async fetchUserRole() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return null;
      }

      const response = await axios.get(`${backendURL}/auth/role`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Auth error:", error.response.status, error.response.data);
      } else {
        console.error("Network error:", error.message);
      }
      return null;
    }
  }
};

// Route configuration
const routes = {
  public: [
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    {path: "/register", element: <Register /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/contact", element: <Contact /> },
    { path: "/about", element: <About /> },
    { path: "/products", element: <Products /> },
    // { path: "/product/:id", element: <ProductDetails /> },
    { path: "/cart", element: <Cart /> },
    {path: "/checkout", element: <CheckOut /> },
    { path: "/policy/privacy", element: <Privacy /> },
    { path: "/policy/terms", element: <Terms /> },
    { path: "/policy/refund", element: <Refund /> },
    { path: "/policy/shipping", element: <Shipping /> },
    { path: "/payment/paymentFailed", element: <PaymentFail /> },
    { path: "/payment/paymentSuccess", element: <PaymentSuccess /> },
    { path: "/developer", element: <Developer /> }
  ],
  admin: [
    { path: "/admin/dashboard", element: <AdminDashboard /> },
    { path: "/admin/products", element: <AdminProducts /> },
    { path: "/admin/failedOrders", element: <AdminFailedOrders /> },
    { path: "/admin/products/add", element: <AdminAddProducts /> },
    { path: "/admin/products/edit/:id", element: <AdminEditProducts /> },
    { path: "/admin/orders", element: <AdminOrder /> },
    { path: "/admin/processing", element: <AdminProcessing /> },
    { path: "/admin/processed", element: <AdminProcessed /> },
    { path: "/admin/orders/:id", element: <AdminOrderDetail /> }
  ]
};

// PrivateRoute Component with memoization
const PrivateRoute = React.memo(({ children, allowedRoles }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRole = async () => {
      const fetchedRole = await authService.fetchUserRole();
      setRole(fetchedRole);
      setLoading(false);
    };
    getRole();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!role) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role?.user?.role)) return <Navigate to="/" replace />;

  return children;
});

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      const roleData = await authService.fetchUserRole();
      setIsAdmin(roleData?.user?.role === "admin");
    };
    checkAdminStatus();
  }, []);

  // Memoize route rendering to prevent unnecessary re-renders
  const renderedRoutes = useMemo(() => (
    <Routes>
      <Route path="/" element={<Layout isAdmin={isAdmin} />}>
        {/* Public Routes */}
        {routes.public.map((route) => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                {route.element}
              </Suspense>
            } 
          />
        ))}
        
        {/* Admin Routes */}
        {routes.admin.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Suspense fallback={<LoadingSpinner />}>
                  {route.element}
                </Suspense>
              </PrivateRoute>
            }
          />
        ))}
        
        {/* Fallback for unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  ), [isAdmin]);

  return (
    <Provider store={store}>
      
      <Router>
      <ScrollToTop />
        <Suspense fallback={<LoadingSpinner fullPage />}>
          {renderedRoutes}
        </Suspense>
      </Router>
    </Provider>
  );
}

export default React.memo(App);

// AIzaSyDZGMyMQ5v2pERahxw0Z5qDNDtr89aoHjU