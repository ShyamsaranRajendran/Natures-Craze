import React from "react";
import "./Home.css"; 

function Home() {
  return (
    <div className="home">
      {/* Header Section */}
      <header className="home-header">
        <h1>Welcome to Turmeric Treasures</h1>
        <p>Experience the golden essence of nature</p>
      </header>

      <section className="home-introduction">
        <h2>About Us</h2>
        <p>
          At Turmeric Treasures, we bring you the finest, organic turmeric
          products sourced directly from farmers. Discover the incredible health
          benefits of turmeric in its purest form.
        </p>
      </section>

      {/* Product Highlights Section */}
      <section className="home-products">
        <h2>Our Products</h2>
        <div className="product-cards">
          <div className="product-card">
            <img
              src="https://via.placeholder.com/150"
              alt="Turmeric Powder"
              className="product-image"
            />
            <h3>Organic Turmeric Powder</h3>
            <p>100% pure and natural, perfect for culinary and health uses.</p>
          </div>
          <div className="product-card">
            <img
              src="https://via.placeholder.com/150"
              alt="Turmeric Capsules"
              className="product-image"
            />
            <h3>Turmeric Capsules</h3>
            <p>Convenient and powerful, packed with curcumin benefits.</p>
          </div>
          <div className="product-card">
            <img
              src="https://via.placeholder.com/150"
              alt="Turmeric Tea"
              className="product-image"
            />
            <h3>Turmeric Tea</h3>
            <p>A soothing blend for relaxation and wellness.</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="home-footer">
        <p>© 2025 Turmeric Treasures. All rights reserved.</p>
        <p>
          Follow us on{" "}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>{" "}
          and{" "}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

export default Home;
