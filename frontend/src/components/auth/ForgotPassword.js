import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
const backendURL = process.env.REACT_APP_BACKEND_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendURL}/auth/forgot-password`, { email });
      setMessage('OTP sent to your email');
      setError(''); // Clear any previous error
      setTimeout(() => {
        // Redirect to the Reset Password page after OTP is sent
        navigate('/reset-password');
      }, 1500); // Delay the redirect to show success message for 1.5 seconds
    } catch (error) {
      setError('Error sending OTP');
      setMessage(''); // Clear any success message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-500 px-4 sm:px-6 md:px-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-black mb-6">Forgot Password</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4 animate-pulse">{error}</p>}
        {message && <p className="text-green-500 text-sm text-center mb-4 animate-pulse">{message}</p>}
        
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 transition transform hover:scale-105"
          >
            Send OTP
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Remember your password?{' '}
          <a href="/login" className="text-yellow-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
