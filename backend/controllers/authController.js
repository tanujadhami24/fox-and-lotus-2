const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const User = require('../models/User');

// Temporary in-memory cache for storing OTPs
const otpCache = new Map();

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

// Helper: Send Twilio SMS OTP
const sendTwilioSms = async (phone, otp, name) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioPhone) {
    console.log('\n==================================================');
    console.log(`🔑 [MOCK SMS VERIFICATION KEY]`);
    console.log(`User Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Verification Code: ${otp}`);
    console.log('==================================================\n');
    return false;
  }

  try {
    const client = twilio(accountSid, authToken);
    
    // Add country code +91 if missing and number length is 10
    let formattedPhone = phone.trim();
    if (formattedPhone.length === 10 && !formattedPhone.startsWith('+')) {
      formattedPhone = `+91${formattedPhone}`;
    }

    await client.messages.create({
      body: `🔑 Fox & Lotus: Hello ${name}, your verification code is ${otp}. Expires in 5 mins.`,
      from: twilioPhone,
      to: formattedPhone
    });
    console.log(`Real Twilio SMS OTP sent successfully to ${formattedPhone}`);
    return true;
  } catch (error) {
    console.error('Twilio SMS dispatch failed:', error);
    // Keep testing alive by logging code as fallback
    console.log(`🔑 Fallback verification code: ${otp}`);
    return false;
  }
};

// @desc    Send OTP to User's Phone Number
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Please provide name and phone number' });
  }

  try {
    // Generate a 4-digit OTP code
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    // Save in cache
    otpCache.set(phone, { otp, email, expiresAt });

    // Send SMS via Twilio (with console fallback)
    await sendTwilioSms(phone, otp, name);

    res.status(200).json({ message: 'Verification code sent to phone number' });
  } catch (error) {
    console.error('OTP Send Error:', error);
    res.status(500).json({ message: 'Failed to send verification code: ' + error.message });
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
