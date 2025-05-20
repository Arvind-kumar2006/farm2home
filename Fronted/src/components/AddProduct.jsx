import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddProduct.css';

const AddProduct = ({ fetchProducts }) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        image: '',
        category: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
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
            setLoading(true);
            await axios.post('http://localhost:8000/api/products', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Product added successfully!');
            setForm({
                name: '',
                description: '',
                price: '',
                quantity: '',
                image: '',
                category: '',
            });
            fetchProducts();
        } catch (err) {
            setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add Product</h2>
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;