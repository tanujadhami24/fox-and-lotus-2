const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, default: "" },
  apartment: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  pin: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
