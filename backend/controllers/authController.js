const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Temporary in-memory cache for storing OTPs (in production, use Redis or MongoDB collections)
const otpCache = new Map();

// Helper: Configure Nodemailer Transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // e.g. dhamitanuja78@gmail.com
      pass: process.env.SMTP_PASS, // App password
    },
  });
};

// @desc    Send OTP to User's Email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Please provide name, email, and phone number' });
  }

  try {
    // Generate a 4-digit OTP code
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    // Save in cache
    otpCache.set(phone, { otp, email, expiresAt });

    // Send email using Nodemailer
    const transporter = getTransporter();
    const mailOptions = {
      from: `"Fox & Lotus" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🔑 Your Fox & Lotus Verification Code',
      html: `
        <div style="font-family: monospace; border: 3px solid #000; padding: 24px; max-width: 480px; background-color: #fffbeb; color: #000;">
          <h2 style="font-weight: 900; text-transform: uppercase; margin-top: 0; border-bottom: 2px solid #000; padding-bottom: 8px;">FOX & LOTUS</h2>
          <p style="font-size: 1.1rem; font-weight: bold;">Hello ${name},</p>
          <p>Verify your session to unlock S-Tier snacks and secure your snack log.</p>
          <div style="background-color: #facc15; border: 2px solid #000; padding: 12px; font-size: 2rem; font-weight: 900; text-align: center; letter-spacing: 4px; margin: 20px 0; box-shadow: 4px 4px 0 #000;">
            ${otp}
          </div>
          <p style="font-size: 0.8rem; color: #6b7280; font-weight: bold;">● This OTP will expire in 5 minutes.</p>
        </div>
      `,
    };

    // Attempt to send email
    await transporter.sendMail(mailOptions);
    console.log(`OTP (${otp}) sent successfully to ${email}`);

    res.status(200).json({ message: 'Verification code sent to email' });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    res.status(500).json({ message: 'Failed to send OTP email: ' + error.message });
  }
};

// @desc    Verify OTP & Get JWT Token
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  const { name, email, phone, address, apartment, city, state, pin, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Please provide phone number and OTP code' });
  }

  const cached = otpCache.get(phone);

  if (!cached) {
    return res.status(400).json({ message: 'No OTP requested for this phone number' });
  }

  if (Date.now() > cached.expiresAt) {
    otpCache.delete(phone);
    return res.status(400).json({ message: 'OTP has expired. Request a new code.' });
  }

  if (cached.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP code' });
  }

  try {
    // OTP is correct! Clear it from cache
    otpCache.delete(phone);

    // Find or create user
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        name,
        phone,
        email: cached.email || email,
        address: address || "",
        apartment: apartment || "",
        city: city || "",
        state: state || "",
        pin: pin || ""
      });
    } else {
      // Update fields if provided
      user.name = name || user.name;
      user.email = email || user.email;
      user.address = address !== undefined ? address : user.address;
      user.apartment = apartment !== undefined ? apartment : user.apartment;
      user.city = city !== undefined ? city : user.city;
      user.state = state !== undefined ? state : user.state;
      user.pin = pin !== undefined ? pin : user.pin;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
      apartment: user.apartment,
      city: user.city,
      state: user.state,
      pin: user.pin,
      token
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: 'Verification error: ' + error.message });
  }
};

// @desc    Get Authenticated User Profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update User Coordinates
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  const { name, email, address, apartment, city, state, pin } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.address = address !== undefined ? address : user.address;
    user.apartment = apartment !== undefined ? apartment : user.apartment;
    user.city = city !== undefined ? city : user.city;
    user.state = state !== undefined ? state : user.state;
    user.pin = pin !== undefined ? pin : user.pin;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  getProfile,
  updateProfile
};
