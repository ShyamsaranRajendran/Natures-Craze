import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import Home from "./components/Home";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SocialMediaLinks from "./components/Social.jsx";

function App() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if the modal should be open based on localStorage
    const storedModalState = localStorage.getItem("isModalOpen");
    if (storedModalState === "true") {
      setIsModalOpen(true);
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Function to open the modal and store the state in localStorage
  const openModal = () => {
    setIsModalOpen(true);
    localStorage.setItem("isModalOpen", "true");
  };

  // Function to close the modal and store the state in localStorage
  const closeModal = () => {
    setIsModalOpen(false);
    localStorage.setItem("isModalOpen", "false");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-customYellow">
        <div className="border-4 border-gray-300 border-t-black rounded-full w-12 h-12 animate-spin"></div>
        <p className="text-lg font-semibold text-gray-800 mt-4"></p>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home openModal={openModal} />} />
          <Route path="/login" element={<Login onClose={closeModal} />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>

      {/* Modal Implementation */}
      {isModalOpen && <Login onClose={closeModal} />}

      <SocialMediaLinks />
      <Footer />
    </Router>
  );
}

export default App;
