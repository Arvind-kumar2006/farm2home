import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div className="container mx-auto p-6 max-w-2xl">
      {/* Product Form */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editProductId ? 'Edit Product' : 'Create Product'}
        </h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Name*"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
          />
          <div className="flex space-x-4">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="Price*"
              className="w-full border p-2 rounded"
              min="0"
            />
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              placeholder="Quantity*"
              className="w-full border p-2 rounded"
              min="0"
            />
          </div>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full border p-2 rounded"
          />
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : editProductId ? 'Update Product' : 'Submit Product'}
            </button>
            {editProductId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products added yet.</p>
        ) : (
          <ul className="space-y-4">
            {products.map((prod) => (
              <li
                key={prod._id}
                className="bg-green-50 p-4 rounded flex justify-between items-center"
              >
                <div>
                  <strong>{prod.name}</strong> ({prod.category})<br />
                  ₹{prod.price} × {prod.quantity}
                </div>
                <div className="flex items-center space-x-4">
                  <img
                    src={prod.image || 'https://placehold.co/80x80'}
                    alt={prod.name}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/80x80';
                    }}
                  />
                  <button
                    onClick={() => handleEdit(prod)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
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