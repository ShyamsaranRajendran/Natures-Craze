import React from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import AdminFooter from "./AdminFooter"; // New footer for admin
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./common/ScrollTop";
import ChatBot from "./ChatBot";
const Layout = ({ isAdmin }) => {
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.05 },
  };

  const pageTransition = {
    duration: 0.5,
  };

  return (
<div className="flex flex-col min-h-screen pt-18 pb-16 sm:pb-0">
  <ScrollToTop/>
<ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLosss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }} // Bring ToastContainer to the top
      />
     
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <ChatBot/>
      {isAdmin ? <AdminFooter /> : <Footer />}{" "}
      {/* Conditionally render footer */}
    </div>
  );
};

export default Layout;
