const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Helper: Configure Nodemailer Transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Helper: Get Razorpay Instance if credentials are set
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
};

// @desc    Create Checkout Order (Initialize Razorpay transaction)
// @route   POST /api/orders/checkout
// @access  Private
const createCheckoutOrder = async (req, res) => {
  const { items, discountCode } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in cart' });
  }

  try {
    // Calculate price securely based on database products (never trust client prices)
    let subtotal = 0;
    const itemsList = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item._id);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.name} not found in database` });
      }

      const itemPrice = dbProduct.price;
      subtotal += itemPrice * item.qty;

      itemsList.push({
        product: dbProduct._id,
        name: dbProduct.name,
        qty: item.qty,
        price: itemPrice,
        weight: item.selectedWeight || dbProduct.weight
      });
    }

    // Apply Discount Code if active
    let discountApplied = 0;
    if (discountCode) {
      const codeUpper = discountCode.toUpperCase().trim();
      if (codeUpper === 'CHEESYDRIP' || codeUpper === 'SWEETHEAT') {
        discountApplied = subtotal * 0.15; // 15% discount
      }
    }

    const finalSubtotal = subtotal - discountApplied;
    const shippingCost = finalSubtotal >= 500 ? 0 : 40;
    const total = finalSubtotal + shippingCost;

    let razorpayOrderId = '';
    const razorpayInstance = getRazorpayInstance();

    if (razorpayInstance) {
      // Create real Razorpay order
      const options = {
        amount: Math.round(total * 100), // in paise
        currency: 'INR',
        receipt: `receipt_${Math.floor(100000 + Math.random() * 900000)}`
      };

      const razorpayOrder = await razorpayInstance.orders.create(options);
      razorpayOrderId = razorpayOrder.id;
    } else {
      // Mock mode: generate mock Razorpay order ID
      console.log('--- MOCK PAYMENTS MODE ACTIVE (No Razorpay Keys in .env) ---');
      razorpayOrderId = `order_mock_${Math.floor(100000 + Math.random() * 900000)}`;
    }

    // Save pending Order to database
    const order = await Order.create({
      user: req.user.id,
      items: itemsList,
      subtotal,
      discountApplied,
      shippingCost,
      total,
      razorpayOrderId,
      status: 'ROASTING',
      isPaid: false
    });

    res.status(201).json({
      orderId: order._id,
      razorpayOrderId,
      amount: Math.round(total * 100),
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'mock_key_id'
    });
  } catch (error) {
    console.error('Checkout Order Error:', error);
    res.status(500).json({ message: 'Failed to initialize checkout: ' + error.message });
  }
};

// @desc    Verify Payment Signature & Finalize Order
// @route   POST /api/orders/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId) {
    return res.status(400).json({ message: 'Please provide razorpayOrderId' });
  }

  try {
    const order = await Order.findOne({ razorpayOrderId }).populate('user');
    if (!order) {
      return res.status(404).json({ message: 'Order reference not found' });
    }

    const isMockOrder = razorpayOrderId.startsWith('order_mock_');
    const razorpayInstance = getRazorpayInstance();

    if (!isMockOrder && razorpayInstance) {
      // Real payment validation
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({ message: 'Transaction verification failed: signature mismatch' });
      }
    }

    // Set payment details
    order.isPaid = true;
    order.razorpayPaymentId = razorpayPaymentId || `pay_mock_${Math.floor(100000 + Math.random() * 900000)}`;
    await order.save();

    // Send order confirmation invoice via Nodemailer
    try {
      const transporter = getTransporter();
      const mailOptions = {
        from: `"Fox & Lotus Support" <${process.env.SMTP_USER}>`,
        to: order.user.email,
        subject: `🛍️ Order Confirmed! Reference: ${order.razorpayOrderId}`,
        html: `
          <div style="font-family: monospace; border: 3px solid #000; padding: 24px; max-width: 600px; background-color: #fff; color: #000;">
            <h2 style="font-weight: 900; text-transform: uppercase; margin-top: 0; border-bottom: 2px solid #000; padding-bottom: 8px; color: #22c55e;">🎉 ORDER PLACED SUCCESSFULLY!</h2>
            <p style="font-size: 1.1rem; font-weight: bold;">Thank you for claiming the crunch, ${order.user.name}!</p>
            <p>Order Reference: <strong>${order.razorpayOrderId}</strong></p>
            <p>We're roasting your custom batch literally right now 💯</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background-color: #f3f4f6; border-bottom: 2px solid #000;">
                  <th style="padding: 8px; text-align: left; font-weight: bold; text-transform: uppercase;">Flavor Item</th>
                  <th style="padding: 8px; text-align: center; font-weight: bold; text-transform: uppercase;">Qty</th>
                  <th style="padding: 8px; text-align: right; font-weight: bold; text-transform: uppercase;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 8px; text-align: left; text-transform: uppercase;">${item.name} (${item.weight})</td>
                    <td style="padding: 8px; text-align: center;">${item.qty}</td>
                    <td style="padding: 8px; text-align: right;">₹${(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="border-top: 2px solid #000; padding-top: 10px; font-weight: bold; text-align: right; font-size: 0.95rem;">
              <p>Subtotal: ₹${order.subtotal.toFixed(2)}</p>
              ${order.discountApplied > 0 ? `<p style="color: #16a34a;">Discount: -₹${order.discountApplied.toFixed(2)}</p>` : ''}
              <p>Delivery Fee: ₹${order.shippingCost.toFixed(2)}</p>
              <p style="font-size: 1.35rem; font-weight: 900; margin-top: 5px; color: #000; border-top: 1px dashed #000; padding-top: 5px; display: inline-block;">TOTAL: ₹${order.total.toFixed(2)}</p>
            </div>

            <div style="margin-top: 30px; padding: 16px; background-color: #faf5ff; border: 2px solid #000; box-shadow: 4px 4px 0 #000;">
              <p style="font-weight: 900; margin-top: 0; text-transform: uppercase;">🚚 SHIPPING COORDINATES:</p>
              <p style="margin: 4px 0;"><strong>Name:</strong> ${order.user.name}</p>
              <p style="margin: 4px 0;"><strong>Address:</strong> ${order.user.address}, ${order.user.apartment || ''}</p>
              <p style="margin: 4px 0;"><strong>City/State:</strong> ${order.user.city}, ${order.user.state} - ${order.user.pin}</p>
              <p style="margin: 4px 0;"><strong>Contact:</strong> ${order.user.phone}</p>
            </div>
            
            <p style="font-size: 0.85rem; color: #6b7280; margin-top: 30px; font-weight: bold; text-align: center; border-top: 2px solid #000; padding-top: 12px;">
              © 2026 FOX & LOTUS INVENTIONS. ALL CODES SECURED. SNACK WISELY.
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`Invoice email sent successfully to ${order.user.email}`);
    } catch (mailErr) {
      console.error('Failed to send invoice email:', mailErr);
      // Don't fail the verification response if email fails
    }

    res.status(200).json({
      message: 'Transaction verified and saved successfully',
      orderId: order._id,
      razorpayOrderId: order.razorpayOrderId,
      total: order.total
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ message: 'Failed to verify transaction: ' + error.message });
  }
};

// @desc    Get orders for active authenticated user
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id, isPaid: true }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCheckoutOrder,
  verifyPayment,
  getMyOrders
};
