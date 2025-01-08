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
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleResetPassword}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={OTP}
          onChange={(e) => setOTP(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
