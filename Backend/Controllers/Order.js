const Order = require('../Models/Order');
const Product = require('../Models/Product');

// Create Order
const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, deliveryType } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Validate and fetch the farmer from the first product
    const firstProduct = await Product.findById(items[0].product).populate('createdBy');
    if (!firstProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const farmerId = firstProduct.createdBy._id;

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

// Get Customer Orders
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

// Get Farmer Orders
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

// Update Order Status
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

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus };