import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FarmerDashboard.css';

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    image: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editProductId, setEditProductId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:8000/api/products/my-products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      quantity: '',
      image: '',
      category: '',
    });
    setEditProductId(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.price || !form.quantity) {
      setError('Name, Price, and Quantity are required');
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      category: form.category.trim(),
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
    };

    try {
      if (editProductId) {
        await axios.put(`http://localhost:8000/api/products/${editProductId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Product updated successfully!');
      } else {
        await axios.post('http://localhost:8000/api/products', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Product added successfully!');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Product deleted!');
      fetchProducts();
    } catch {
      alert('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      quantity: product.quantity || '',
      image: product.image || '',
      category: product.category || '',
    });
    setEditProductId(product._id);
    setError('');
  };

  return (
    <div className="container">
     
      <div className="form-section">
        <h2>{editProductId ? 'Edit Product' : 'Create Product'}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name*" required />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
          <div className="form-row">
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price*" required min="0" />
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity*" required min="0" />
          </div>
          <input type="text" name="image" value={form.image} onChange={handleChange} placeholder="Image URL" />
          <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Category" />
          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : editProductId ? 'Update Product' : 'Submit Product'}
            </button>
            {editProductId && (
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      
      <div className="product-section">
        <h2>Your Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          <ul className="product-list">
            {products.map((prod) => (
              <li key={prod._id} className="product-item">
                <div className="product-details">
                  <strong>{prod.name}</strong> ({prod.category})<br />
                  ₹{prod.price} × {prod.quantity}
                </div>
                <div className="product-actions">
                  <img
                    src={prod.image || 'https://placehold.co/80x80'}
                    alt={prod.name}
                    className="product-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/80x80';
                    }}
                  />
                  <button onClick={() => handleEdit(prod)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(prod._id)} className="delete-btn">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;