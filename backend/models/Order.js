// Import Mongoose library for MongoDB object modeling
const mongoose = require('mongoose');

// Define a new Mongoose schema for the Order collection with timestamps
const orderSchema = new mongoose.Schema({
  // Reference to the User who placed the order - required field
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Array of products in the order with quantity information
  products: [{
    // Reference to the Product being ordered
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    // Quantity of the product ordered - required field
    quantity: { type: Number, required: true }
  }],
  // Total price of the order - required field
  total: { type: Number, required: true },
  // Order status with default value of 'Pending'
  status: { type: String, default: 'Pending' }
}, { timestamps: true }); // Add createdAt and updatedAt timestamps automatically

// Export the Order model based on the defined schema
module.exports = mongoose.model('Order', orderSchema);
