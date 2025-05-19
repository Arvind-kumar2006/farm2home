const Order = require('../Models/Order');
const Product = require('../Models/Product');
// filepath: /Users/arvindkumar/Desktop/untitled folder/Backend/Controllers/Order.js
const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, deliveryType } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Validate and fetch the farmer from the first product
    const firstProduct = await Product.findById(items[0].product).populate('farmer');
    if (!firstProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const farmerId = firstProduct.farmer._id;

    const order = new Order({
      customer: req.user._id,
      items,
      totalPrice,
      deliveryType,
      farmer: farmerId,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// CUSTOMER: View own orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your orders' });
  }
};

// FARMER: View all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id }) 
      .populate('customer', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// FARMER: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};




module.exports = {createOrder, getUserOrders, getAllOrders, updateOrderStatus};
