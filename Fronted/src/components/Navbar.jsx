import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/AddProduct" className="nav-link">Add Product</Link>
      <Link to="/FarmerDashboard" className="nav-link">Show Products</Link>
      <Link to="/Orders" className="nav-link">Orders</Link>
      <Link to="/Profile" className="nav-link">Profile</Link>
      <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
    </nav>
  );
};

export default Navbar;