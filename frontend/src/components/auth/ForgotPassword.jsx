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
      const response = await axios.post(`${backendURL}/auth/forgot`, { email });
      setMessage('OTP sent to your email');
      setError(''); // Clear any previous error
      setTimeout(() => {
        // Redirect to the Reset Password page after OTP is sent
        navigate('/reset-password');
      }, 1500); // Delay the redirect to show success message for 1.5 seconds
    } catch (error) {
      setError('Error sending OTP');
      setMessage(''); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-white shadow-lg rounded-lg px-6 py-8 max-w-md w-full mx-auto relative">
        {" "}
        <h1 className="text-2xl font-bold text-center text-orange-500">
          Forgot Password
        </h1>
        <p className="text-center mt-2 text-gray-500">We'll send you an OTP</p>
        {error && (
          <div className="text-red-500 text-sm text-center mt-2">{error}</div>
        )}
        {message && (
          <div className="text-green-500 text-sm text-center mt-2">
            {message}
          </div>
        )}
        <form className="mt-6" onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg mt-4 hover:bg-orange-600"
          >
            Send OTP
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <a href="/login" className="text-orange-500 hover:underline">
            Login here
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
