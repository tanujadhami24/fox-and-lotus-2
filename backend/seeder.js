const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: 'Cheese & Herbs',
    id: 'cheese',
    desc: 'Infused with organic cheddar cheese and loaded with premium aromatic herbs. Fully popped for crunch.',
    price: 180,
    originalPrice: 210,
    calories: '280 kcal',
    weight: '70g',
    color: '#ffd15c',
    image: '/makhana_cheese.jpg',
    healthStats: { hp: 98, protein: '9.2g', fiber: '4.8g', guilt: 5 },
    flavorDetails: { primaryName: 'Cheddar Cheese Powder', primaryPct: 80, secondaryName: 'Parsley & Oregano Herbs', secondaryPct: 20 },
    offerCode: 'CHEESYDRIP',
    offerLabel: 'Flat 15% OFF + 2x Level XP Points'
  },
  {
    name: 'Honey Chilli',
    id: 'chilli',
    desc: 'The perfect kick of wild honey sweetness intertwined with spicy, slow-baked red chilli flakes.',
    price: 195,
    originalPrice: 230,
    calories: '290 kcal',
    weight: '70g',
    color: '#e11d48',
    image: '/makhana_honey_chilli.jpg',
    healthStats: { hp: 95, protein: '8.8g', fiber: '4.5g', guilt: 8 },
    flavorDetails: { primaryName: 'Organic Wild Honey', primaryPct: 70, secondaryName: 'Crushed Red Chilli Flakes', secondaryPct: 30 },
    offerCode: 'SWEETHEAT',
    offerLabel: 'Buy 2 Get 1 FREE on Honey Chilli cups'
  },
  {
    name: 'Himalayan Pink Salt',
    id: 'salt',
    desc: 'Freshly seasoned with genuine, raw pink salt hand-mined from high Himalayan peaks. Organic mineral dense.',
    price: 165,
    originalPrice: 190,
    calories: '260 kcal',
    weight: '70g',
    color: '#ec4899',
    image: '/makhana_pink_salt.jpg',
    healthStats: { hp: 99, protein: '9.5g', fiber: '5.2g', guilt: 2 },
    flavorDetails: { primaryName: 'Raw Himalayan Pink Salt', primaryPct: 95, secondaryName: 'Cold-Pressed Olive Drizzle', secondaryPct: 5 },
    offerCode: 'SALTYVIBES',
    offerLabel: 'Flat ₹30 OFF returning orders'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Database cleared (Product collection)');

    // Seed products
    await Product.insertMany(products);
    console.log('Product catalog successfully seeded! 🌱');
    
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
