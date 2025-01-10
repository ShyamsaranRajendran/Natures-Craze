import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/auth/Login"; // Import your Login component
import SignUp from "./components/auth/SignUp"; // If you also have SignUp
import Home from "./components/Home"; // Import your Home component
import ForgotPassword from "./components/auth/ForgotPassword"; // If you also have ForgotPassword
import ResetPassword from "./components/auth/ResetPassword"; // If you also have ResetPassword
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
           <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/sign-up" element={<SignUp />} /> 
          
          </Routes>
      </div>
    </Router>
  );
}

export default App;
