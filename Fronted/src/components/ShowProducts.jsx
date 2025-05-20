import React from 'react';
import '../styles/ShowProducts.css';

const ShowProducts = ({ products, handleEdit, handleDelete }) => {
  return (
    <div className="product-section">
      <h2>Your Products</h2>
      {products.length === 0 ? (
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
  );
};

export default ShowProducts;