// Import Mongoose library for MongoDB object modeling
const mongoose = require('mongoose');

// Define a new Mongoose schema for the Product collection
const productSchema = new mongoose.Schema({
  // Product name field - required string
  name: { type: String, required: true },
  // Product description field - required string
  description: { type: String, required: true },
  // Product price field - required number
  price: { type: Number, required: true },
  // Product stock quantity field - required number
  stock: { type: Number, required: true },
  // Product image URL field - optional string
  image: { type: String },  // URL to image
  // Array of Review references linked to this product
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

// Export the Product model based on the defined schema
module.exports = mongoose.model('Product', productSchema);