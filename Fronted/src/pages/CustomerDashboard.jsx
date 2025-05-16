import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderForm, setOrderForm] = useState({ quantity: 1, deliveryType: 'Delivery' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/products');
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching all products:', err);
        setError('⚠️ Failed to load products. Please try again later.');
      }
    };

    fetchAllProducts();
  }, []);

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setOrderForm({ quantity: 1, deliveryType: 'Delivery' });
    setMessage('');
    setError('');
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const quantity = Number(orderForm.quantity);
    if (quantity < 1) {
      setError('❌ Quantity must be at least 1.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('⚠️ Please log in to place an order.');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const payload = {
        items: [{ product: selectedProduct._id, quantity }],
        deliveryType: orderForm.deliveryType,
      };

      await axios.post('http://localhost:8000/api/orders', payload, config);

      setMessage('✅ Order placed successfully!');
      setSelectedProduct(null);
      setOrderForm({ quantity: 1, deliveryType: 'Delivery' });
    } catch (err) {
      console.error('Order Error:', err?.response?.data || err);
      setError(err?.response?.data?.message || '❌ Could not place order. Try again later.');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === 'orderModalOverlay') {
      setSelectedProduct(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">All Available Farmer Products</h2>

      {message && <div className="text-center text-green-600 mb-4">{message}</div>}
      {error && <div className="text-center text-red-600 mb-4">{error}</div>}

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div key={prod._id} className="border rounded-lg p-4 shadow bg-white">
              {prod.image && (
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-lg font-semibold mb-1">{prod.name}</h3>
              <p className="text-gray-600 text-sm mb-1">Category: {prod.category}</p>
              <p className="text-sm text-gray-700 mb-1">{prod.description}</p>
              <p className="font-medium text-green-700">₹ {prod.price}</p>
              <p className="text-sm text-gray-500">Available: {prod.quantity}</p>
              <button
                onClick={() => handleOrderClick(prod)}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Order Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedProduct && (
        <div
          id="orderModalOverlay"
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Order: {selectedProduct.name}</h3>

            <form onSubmit={handleOrderSubmit}>
              <label className="block mb-3">
                Quantity:
                <input
                  type="number"
                  min="1"
                  value={orderForm.quantity}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, quantity: Number(e.target.value) })
                  }
                  className="w-full p-2 mt-1 border border-gray-300 rounded"
                  required
                />
              </label>

              <label className="block mb-4">
                Delivery Type:
                <select
                  value={orderForm.deliveryType}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, deliveryType: e.target.value })
                  }
                  className="w-full p-2 mt-1 border border-gray-300 rounded"
                >
                  <option value="Delivery">Delivery</option>
                  <option value="Pickup">Pickup</option>
                </select>
              </label>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Place Order
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
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

export default CustomerDashboard;