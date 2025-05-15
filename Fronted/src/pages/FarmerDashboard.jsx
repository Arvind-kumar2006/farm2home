import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/FarmerDashboard.css";

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    image: "",
    category: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [farmerId, setFarmerId] = useState(null);

  const backendUrl = "http://localhost:8000/api";

  const fetchFarmerInfo = async () => {
    try {
      const res = await axios.get(`${backendUrl}/auth/me`, {
        withCredentials: true,
      });
      setFarmerId(res.data._id);
    } catch (error) {
      console.error("Failed to fetch farmer info", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${backendUrl}/products`, {
        withCredentials: true,
      });
      const filtered = res.data.filter(
        (product) => product.createdBy === farmerId
      );
      setProducts(filtered);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchFarmerInfo();
  }, []);

  useEffect(() => {
    if (farmerId) {
      fetchProducts();
    }
  }, [farmerId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${backendUrl}/products/${editingId}`,
          form,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${backendUrl}/products`,
          form,
          { withCredentials: true }
        );
      }
      setForm({
        name: "",
        price: "",
        quantity: "",
        description: "",
        image: "",
        category: ""
      });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description || "",
      image: product.image || "",
      category: product.category || ""
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/products/${id}`, {
        withCredentials: true,
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Farmer Dashboard</h1>

      <div className="form-container">
        <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />
          <button type="submit">
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      <div className="products-container">
        <h2>Your Products</h2>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.category}</td>
                  <td>
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(product)}>Edit</button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;