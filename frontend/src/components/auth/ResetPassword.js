import React, { useState } from 'react';
import axios from 'axios';
const backendURL = process.env.REACT_APP_BACKEND_URL;

const ResetPassword = () => {
  const [OTP, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Get JWT from localStorage
      await axios.post(`${backendURL}/auth/reset-password`, {
        OTP,
        newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Password reset successfully');
    } catch (error) {
      setError('Error resetting password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-500 px-4 sm:px-6 md:px-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-black mb-6">Reset Password</h2>
        
        {error && <p className="text-red-500 text-sm text-center mb-4 animate-pulse">{error}</p>}
        {message && <p className="text-green-500 text-sm text-center mb-4 animate-pulse">{message}</p>}
        
        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* OTP Input: 6 digits */}
          <div className="flex space-x-2 justify-center">
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
                className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
            ))}
          </div>
          
          {/* New Password */}
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          
          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />

          {/* Reset Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 transition transform hover:scale-105"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
