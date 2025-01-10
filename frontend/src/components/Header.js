
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-yellow-600 text-white p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-xl font-bold">Turmeric Bliss</h1>
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:text-yellow-200">Home</Link></li>
          <li><Link to="/products" className="hover:text-yellow-200">Products</Link></li>
        </ul>
      </nav>
    </div>
  </header>
);
