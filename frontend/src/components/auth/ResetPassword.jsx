import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the toast CSS
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const backendURL = process.env.REACT_APP_BACKEND_URL;

const ResetPassword = () => {
  const [OTP, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); // Initialize the navigate function

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      toast.error("Passwords don't match");
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Get JWT from localStorage
      const response = await axios.post(
        `${backendURL}/auth/reset-password`,
        {
          OTP,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Handle success
      setMessage('Password reset successfully');
      setError('');
      toast.success('Password reset successfully!');

      // Navigate to the login page
      navigate('/login');
    } catch (error) {
      setError('Error resetting password');
      toast.error('Error resetting password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-200">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-orange-500">Reset Password</h1>
        {error && <p className="text-red-500 text-sm text-center mt-2 animate-pulse">{error}</p>}
        {message && <p className="text-green-500 text-sm text-center mt-2 animate-pulse">{message}</p>}
        <form className="mt-6" onSubmit={handleResetPassword}>
          {/* OTP Input: 6 digits */}
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={OTP[index] || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setOTP((prev) => {
                    const newOTP = prev.split('');
                    newOTP[index] = value;
                    return newOTP.join('');
                  });
                }}
                className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            ))}
          </div>
          {/* New Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg mt-4 hover:bg-orange-600"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
