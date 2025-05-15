const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: Number
  }],
  totalPrice: Number,
  status: {
    type: String,
    enum: ['Pending', 'Packed', 'Delivered'],
    default: 'Pending'
  },
  deliveryType: {
    type: String,
    enum: ['Delivery', 'Pickup'],
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);