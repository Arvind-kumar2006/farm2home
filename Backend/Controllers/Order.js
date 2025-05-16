const Order = require('../Models/Order');
const Product = require('../Models/Product');

const createOrder = async (req, res) => {
  try {
    const { items, deliveryType } = req.body;

    // Calculate total price
    let totalPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      totalPrice += product.price * item.quantity;
    }

    const order = new Order({
      customer: req.user._id,
      items,
      deliveryType,
      totalPrice
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'Order creation failed' });
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
    const orders = await Order.find()
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
