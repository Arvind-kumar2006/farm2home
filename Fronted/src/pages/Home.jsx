import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 1, name: 'Fruits', image: 'https://img.freepik.com/free-photo/fresh-fruits-vegetables_144627-16201.jpg' },
    { id: 2, name: 'Vegetables', image: 'https://img.freepik.com/free-photo/vegetables-basket_144627-27201.jpg' },
    { id: 3, name: 'Grains', image: 'https://img.freepik.com/free-photo/grains-bowl_144627-27202.jpg' },
  ];

  const steps = [
    { id: 1, title: 'Browse Products', icon: '🔍' },
    { id: 2, title: 'Add to Cart', icon: '🛒' },
    { id: 3, title: 'Place Order', icon: '📦' },
    { id: 4, title: 'Get Delivered', icon: '🚚' },
  ];

  const testimonials = [
    { id: 1, name: 'John Doe', text: 'Amazing fresh produce!', rating: 5, image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Jane Smith', text: 'Best quality vegetables!', rating: 5, image: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 3, name: 'Mike Johnson', text: 'Great service!', rating: 4, image: 'https://randomuser.me/api/portraits/men/2.jpg' },
  ];

  return (
    <div className="homepage-container">
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-title">FarmConnect</div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Farmer</a></li>
          <li><a href="#">Buyer</a></li>
          <li><a href="#">About</a></li>
          <li><a href="/register">Register</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="#" className="cart-icon">🛒</a></li>
        </ul>
      </nav>

      <header className="hero-section">
        <div className="hero-text">
          <h1>Fresh Farm Products Delivered to You</h1>
          <p>
            FarmConnect helps you buy fresh produce directly from the source — local farmers.
            Cut the middlemen, support local agriculture, and enjoy fresh, affordable produce.
          </p>
          <a href="/register" className="hero-button">
            Shop Now
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

      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <img src={category.image} alt={category.name} />
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          {steps.map(step => (
            <div key={step.id} className="step-card">
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <img src={testimonial.image} alt={testimonial.name} />
              <h3>{testimonial.name}</h3>
              <p>{testimonial.text}</p>
              <div className="rating">
                {'⭐'.repeat(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Join Our Community</h2>
        <p>Be part of the sustainable farming revolution</p>
        <div className="cta-buttons">
          <a href="/register" className="cta-button">Sign Up as Farmer</a>
          <a href="/register" className="cta-button secondary">Sign Up as Buyer</a>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About FarmConnect</h3>
            <p>Connecting farmers and buyers directly for a sustainable future.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Connect With Us</h3>
            <div className="social-links">
              <a href="#">📱</a>
              <a href="#">📘</a>
              <a href="#">📸</a>
              <a href="#">🐦</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 FarmConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}