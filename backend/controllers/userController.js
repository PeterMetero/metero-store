// Import User model from the models directory
const User = require('../models/User');
// Import bcryptjs library for password hashing and comparison
const bcrypt = require('bcryptjs');
// Import jsonwebtoken library for creating and signing JWT tokens
const jwt = require('jsonwebtoken');
// Import Joi library for data validation schemas
const Joi = require('joi');

// Define validation schema for user registration with required fields
const registerSchema = Joi.object({
  // Name field must be a string and is required
  name: Joi.string().required(),
  // Email field must be a valid email format and is required
  email: Joi.string().email().required(),
  // Password field must be at least 6 characters long and is required
  password: Joi.string().min(6).required()
});



// Export register function to handle user registration requests
exports.register = async (req, res) => {
  // Validate the request body against the registerSchema
  const { error } = registerSchema.validate(req.body);
  // If validation fails, return 400 status with error message
  if (error) return res.status(400).json({ msg: error.details[0].message });

  // Check if a user with the provided email already exists in the database
  let user = await User.findOne({ email: req.body.email });
  // If user exists, return 400 status indicating user already registered
  if (user) return res.status(400).json({ msg: 'User exists' });

  // Generate a salt for password hashing with 10 rounds of complexity
  const salt = await bcrypt.genSalt(10);
  // Hash the provided password using the generated salt
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new User instance with registration data
  user = new User({
    // Set user name from request body
    name: req.body.name,
    // Set user email from request body
    email: req.body.email,
    // Set user password to the hashed password for security
    password: hashedPassword,
    // Set isAdmin flag from request body or default to false (For testing, set one admin manually later)
    isAdmin: req.body.isAdmin || false  // For testing, set one admin manually later
  });

  // Save the new user to the database
  await user.save();

  // Create a JWT token with user ID and admin status, expires in 1 hour
  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
  // Return the JWT token to the client as JSON response
  res.json({ token });
};

// Export login function to handle user login requests
exports.login = async (req, res) => {
  // Define validation schema for login with email and password
  const schema = Joi.object({
    // Email field must be a valid email format and is required
    email: Joi.string().email().required(),
    // Password field is required
    password: Joi.string().required()
  });
  // Validate the request body against the login schema
  const { error } = schema.validate(req.body);
  // If validation fails, return 400 status with error message
  if (error) return res.status(400).json({ msg: error.details[0].message });

  // Find user in database by email from request body
  const user = await User.findOne({ email: req.body.email });
  // If user not found, return 400 status with invalid credentials message
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  // Compare the provided password with the hashed password stored in the database
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  // If passwords don't match, return 400 status with invalid credentials message
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  // Create a JWT token with user ID and admin status, expires in 1 hour
  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
  // Return the JWT token to the client as JSON response
  res.json({ token });
};
