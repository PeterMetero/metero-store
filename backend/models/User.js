// Import Mongoose library for MongoDB object modeling
const mongoose = require('mongoose');

// Define a new Mongoose schema for the User collection
const userSchema = new mongoose.Schema({
  // User name field - required string
  name: { type: String, required: true },
  // User email field - required unique string to prevent duplicate accounts
  email: { type: String, required: true, unique: true },
  // User password field - required string for authentication
  password: { type: String, required: true },
  // User admin flag field - boolean with default value of false
  isAdmin: { type: Boolean, default: false }
});

// Export the User model based on the defined schema
module.exports = mongoose.model('User', userSchema);
