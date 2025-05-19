import React from 'react';
import '../styles/HomePage.css';

export default function HomePage() {
  return (
    <div className="homepage-container">
     
      <nav className="navbar">
        <div className="navbar-title">FarmConnect</div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Farmer</a></li>
          <li><a href="#">Buyer</a></li>
          <li><a href="/register">Register</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>

     
      <header className="hero-section">
        <div className="hero-text">
          <h1>Connecting Farmers and Buyers Directly</h1>
          <p>
            FarmConnect helps you buy fresh produce directly from the source — local farmers.
            Cut the middlemen, support local agriculture, and enjoy fresh, affordable produce.
          </p>
          <a href="/register" className="hero-button">
            Get Started
          </a>
        </div>
        <div className="hero-image">
          <img
            src="https://img.freepik.com/free-vector/organic-farming-concept_23-2148433516.jpg?semt=ais_hybrid&w=740"
            alt="Farmer"
            className="hero-image"
          />
        </div>
      </header>
    </div>
  );
}