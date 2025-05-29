import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import '../styles/Register.css';

const Register = () => {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) {
      setErrorMessage('Name is required');
      return false;
    }
    if (!email.trim()) {
      setErrorMessage('Email is required');
      return false;
    }
    if (!password.trim()) {
      setErrorMessage('Password is required');
      return false;
    }
    if (!phone.trim()) {
      setErrorMessage('Phone number is required');
      return false;
    }
    if (!address.trim()) {
      setErrorMessage('Address is required');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRegisterSuccess(false);
    setErrorMessage('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const userData = { name, email, password, role, phone, address };
    const result = await registerUser(userData);

    setLoading(false);

    if (result.success) {
      setRegisterSuccess(true);
      // Navigate after a short delay to show the success message
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setErrorMessage(result.error);
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}/auth/register`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <img
          src="https://img.freepik.com/free-vector/organic-farming-concept_23-2148433516.jpg?semt=ais_hybrid&w=740"
          alt="Farmer"
        />
      </div>

      <div className="register-right">
        <h2 className="register-title">Welcome to Farm2Customer</h2>
        <p className="register-subtitle">Register your account</p>

        {registerSuccess && <div className="success-alert">✅ Registration successful! Redirecting to login...</div>}
        {errorMessage && <div className="error-alert">❌ {errorMessage}</div>}

        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="role">Select Role *</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="register-select"
              required
            >
              <option value="customer">Customer</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="register-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="register-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="register-input"
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="register-input"
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="register-input"
              required
              rows="3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="register-button"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="register-footer">
          Already have an account?{' '}
          <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;