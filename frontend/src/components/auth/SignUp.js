import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const backendURL = process.env.REACT_APP_BACKEND_URL;

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await axios.post(`${backendURL}/auth/register`, {
        name,
        email,
        username,
        password,
        confirm_password: confirmPassword,
        phoneNumber,
        address,  // Send the address field even if it's empty
      });
      navigate('/login');
    } catch (error) {
      setError('Error during registration');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-500 px-4 sm:px-6 md:px-8">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center text-black mb-6">Sign Up</h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4 animate-pulse">
            {error}
          </p>
        )}
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <input
            type="text"
            placeholder="Address (optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
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

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
            <span
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showConfirmPassword ? (
                <FaEyeSlash className="text-gray-600" />
              ) : (
                <FaEye className="text-gray-600" />
              )}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 transition transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-yellow-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
