import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/auth/Login"; // Import your Login component
import SignUp from "./components/auth/SignUp"; // If you also have SignUp

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} /> {/* Add any other routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
