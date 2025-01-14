import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';

const backendURL = process.env.REACT_APP_BACKEND_URL;

const Login = ({ onLoginSuccess, onClose }) => { // Added onClose prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`${backendURL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);

      if (onLoginSuccess) onLoginSuccess(); // Close the modal

      // Check if the user data is available before accessing role
      console.log(response.data.user.email);  
      if (response.data.user.email === "curcumin138@gmail.com") {
        navigate("/admin/dashboard");

    window.location.reload();
      } else {
        navigate("/");

    window.location.reload();
      }
    } catch (err) {
      // Improved error handling to check if response data exists
      const errorMessage =
        err.response?.data?.message || "Invalid email or password";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }

  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center fixed inset-0 bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg px-6 py-8 max-w-md w-full mx-auto relative">
       
        <h1 className="text-2xl font-bold text-center text-orange-500">Log In</h1>
        <p className="text-center mt-2 text-gray-500">Welcome! Please log in to continue.</p>
        {error && (
          <div className="bg-red-100 text-red-600 border border-red-500 rounded-lg p-2 mt-4 text-center">
            {error}
          </div>
        )}
        <form className="mt-6" onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email or Mobile Number
            </label>
            <input
              id="email"
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="text-right text-sm text-orange-500">
            <a href="/forgot-password" className="hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded-lg mt-4 text-white ${
              isSubmitting ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isSubmitting ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <span className="text-orange-500 cursor-pointer hover:underline" onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
