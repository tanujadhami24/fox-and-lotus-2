const Product = require('../models/Product');

// @desc    Get all catalog products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product (Admin route / Seeding utility)
// @route   POST /api/products
// @access  Public (for seeding, protect with auth/admin middleware in production)
const createProduct = async (req, res) => {
  const {
    name,
    desc,
    price,
    originalPrice,
    calories,
    weight,
    color,
    image,
    healthStats,
    flavorDetails,
    offerLabel,
    offerCode
  } = req.body;

  try {
    const product = await Product.create({
      name,
      desc,
      price,
      originalPrice,
      calories,
      weight,
      color,
      image,
      healthStats,
      flavorDetails,
      offerLabel,
      offerCode
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct
};
