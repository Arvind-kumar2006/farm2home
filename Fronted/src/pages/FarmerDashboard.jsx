import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/FarmerDashboard.css';

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    image: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const categories = ['Vegetables', 'Grains', 'Dairy', 'Fruits', 'Pulses', 'Spices'];
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategories, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to view your products');
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/products/my-products', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load products. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAddProduct = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      image: ''
    });
    setIsAddingProduct(true);
    setSelectedProduct(null);
  };

  const handleEditProduct = (product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      image: product.image || ''
    });
    setSelectedProduct(product);
    setIsAddingProduct(false);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to manage products.');
        navigate('/login');
        return;
      }

      const productData = {
        ...productForm,
        price: Number(productForm.price),
        quantity: Number(productForm.quantity)
      };

      if (selectedProduct) {
        await axios.put(
          `http://localhost:8000/api/products/${selectedProduct._id}`,
          productData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setMessage('Product updated successfully!');
      } else {
        await axios.post(
          'http://localhost:8000/api/products',
          productData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setMessage('Product added successfully!');
      }

      setSelectedProduct(null);
      setIsAddingProduct(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Could not save product. Try again later.');
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to manage products.');
        navigate('/login');
        return;
      }

      await axios.delete(
        `http://localhost:8000/api/products/${productId}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMessage('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Could not delete product. Try again later.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <Link to="/" className="nav-logo">FarmFresh</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/FarmerDashboard" className="nav-link">My Products</Link>
          <Link to="/FarmerOrders" className="nav-link">Order History</Link>
          <Link to="/Profile" className="nav-link">Profile</Link>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>

      {/* Sidebar */}
      <div className="sidebar">
        <h3>Categories</h3>
        <div className="category-list">
          {categories.map((category) => (
            <label key={category} className="category-item">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
        <button onClick={handleAddProduct} className="add-product-btn">
          Add New Product
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="page-title">My Products</h1>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {message && <div className="message-success">{message}</div>}
        {error && <div className="message-error">{error}</div>}

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">No products available. Add your first product!</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                {product.image && (
                  <img src={product.image} alt={product.name} className="product-image" />
                )}
                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">Category: {product.category}</p>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">₹ {product.price}</p>
                  <p className="product-availability">Available: {product.quantity}</p>
                  <div className="product-actions">
                    <button onClick={() => handleEditProduct(product)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="delete-button">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Form Modal */}
        {(selectedProduct || isAddingProduct) && (
          <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && (setSelectedProduct(null), setIsAddingProduct(false))}>
            <div className="modal-content">
              <h3 className="modal-title">{selectedProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <form onSubmit={handleProductSubmit} className="modal-form">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price (₹):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category:</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Image URL:</label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-button">
                    {selectedProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button type="button" onClick={() => (setSelectedProduct(null), setIsAddingProduct(false))} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;