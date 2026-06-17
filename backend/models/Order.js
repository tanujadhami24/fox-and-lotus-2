const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    weight: { type: String, required: true }
  }],
  subtotal: { type: Number, required: true },
  discountApplied: { type: Number, default: 0 },
  shippingCost: { type: Number, required: true },
  total: { type: Number, required: true },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String, default: "" },
  isPaid: { type: Boolean, default: false },
  status: { type: String, enum: ['ROASTING', 'SHIPPED', 'DELIVERED'], default: 'ROASTING' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
