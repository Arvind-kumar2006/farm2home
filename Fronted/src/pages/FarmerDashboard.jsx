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

  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/products/my-products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched Products:', res.data);
      setProducts(res.data.products);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8000/api/products', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Product added!');
      setForm({ name: '', description: '', price: '', quantity: '', image: '', category: '' });
      fetchProducts();
    } catch (err) {
      console.error('Create error:', err);
      alert('Error creating product.');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Name"
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
            />
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              placeholder="Quantity"
              className="w-full border p-2 rounded"
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
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Submit Product
          </button>
        </form>
      </div>

      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products added yet.</p>
        ) : (
          <ul className="space-y-4">
            {products.map((prod) => (
              <li
                key={prod._id}
                className="bg-green-50 p-4 rounded flex justify-between items-center"
              >
                <div>
                  <strong>{prod.name}</strong>, {prod.category}<br />
                  ₹ {prod.price} × {prod.quantity}<br />
                  Quantity: {prod.quantity}
                </div>
                <img
                  src={prod.image || 'https://placehold.co/80x80'}
                  alt={prod.name}
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/80x80';
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;