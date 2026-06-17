const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  calories: { type: String, required: true },
  weight: { type: String, required: true },
  color: { type: String, required: true },
  image: { type: String, required: true },
  healthStats: {
    hp: { type: Number, required: true },
    protein: { type: String, required: true },
    fiber: { type: String, required: true },
    guilt: { type: Number, required: true }
  },
  flavorDetails: {
    primaryName: { type: String, required: true },
    primaryPct: { type: Number, required: true },
    secondaryName: { type: String, required: true },
    secondaryPct: { type: Number, required: true }
  },
  offerLabel: { type: String, default: "" },
  offerCode: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
