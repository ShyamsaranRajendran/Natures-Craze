import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Eye icons for showing and hiding the password

const backendURL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState(''); // Change username to email
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendURL}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-600 px-4 sm:px-6 md:px-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">Login</h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4 animate-pulse">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email" // Change input type to email
            placeholder="Email"
            value={email} // Bind email state
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
          
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-600" />
              ) : (
                <FaEye className="text-gray-600" />
              )}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-semibold py-2 rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-400 transition transform hover:scale-105"
          >
            Login
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/sign-up" className="text-orange-600 hover:underline">
            Sign Up
          </a>
        </p>
        <p className="text-center text-sm text-gray-600">
          <a href="/forgot-password" className="text-orange-600 hover:underline">
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
