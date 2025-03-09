// api.js
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:5000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 413) {
      toast.error("Order data is too large. Please try reducing the cart size.");
    } else if (error.code === "ERR_NETWORK") {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error(error.response?.data?.message || "An error occurred");
    }
    return Promise.reject(error);
  }
);

export default api;