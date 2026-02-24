// Import Mongoose library for MongoDB object modeling
const mongoose = require('mongoose');

// Define a new Mongoose schema for the Review collection with timestamps
const reviewSchema = new mongoose.Schema({
  // Reference to the User who wrote the review - required field
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Reference to the Product being reviewed - required field
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  // Rating value given by the user - required field
  rating: { type: Number, required: true },
  // Text comment or feedback from the user - optional field
  comment: { type: String }
}, { timestamps: true }); // Add createdAt and updatedAt timestamps automatically

// Export the Review model based on the defined schema
module.exports = mongoose.model('Review', reviewSchema);
