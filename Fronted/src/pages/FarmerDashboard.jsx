import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import AddProduct from '../components/AddProduct';
import ShowProducts from '../components/ShowProducts';
import '../styles/FarmerDashboard.css'; // Add this file for modal styles

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    image: '',
    category: '',
  });

  const token = localStorage.getItem('token');

  const fetchProducts = React.useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/products/my-products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: product.image,
      category: product.category,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      };

      await axios.put(`http://localhost:8000/api/products/${editProduct._id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('Product updated successfully!');
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err.response?.data || err.message);
      alert('Failed to update product');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setEditProduct(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Product deleted!');
      fetchProducts();
    } catch (err) {
      console.log('Error deleting product:', err.response?.data || err.message);
      alert('Failed to delete product');
    }
  };

  return (
    <div>
      <Navbar />
      <AddProduct fetchProducts={fetchProducts} />
      <ShowProducts
        products={products}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {editProduct && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleEditChange}
                placeholder="Name"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleEditChange}
                placeholder="Description"
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleEditChange}
                placeholder="Price"
                required
              />
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleEditChange}
                placeholder="Quantity"
                required
              />
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleEditChange}
                placeholder="Image URL"
              />
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleEditChange}
                placeholder="Category"
              />
              <div className="edit-buttons">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;