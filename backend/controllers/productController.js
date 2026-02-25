// Import Product model from the models directory
const Product = require('../models/Product');
// Import Joi library for data validation schemas
const Joi = require('joi');

// Define validation schema for product data with all required fields
const productSchema = Joi.object({
  // Product name field - required string
  name: Joi.string().required(),
  // Product description field - required string
  description: Joi.string().required(),
  // Product price field - required number
  price: Joi.number().required(),
  // Product stock quantity field - required number
  stock: Joi.number().required(),
  // Product image URL field - optional string
  image: Joi.string()
});

// Export getProducts function to retrieve all products from database
exports.getProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();
    // Send products as JSON response to the client with 200 OK status code
    res.status(200).json(products);
  } catch (error) {
    // Catch any errors that occur during database retrieval (connection errors, query errors, etc.)
    console.error(error);
    // Return 500 status with error message for server errors
    res.status(500).json({ msg: 'Server error' });
  }
};

// Export createProduct function to add a new product to the database
exports.createProduct = async (req, res) => {
  try {
    // Check if the authenticated user has admin privileges - if not, deny access
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Admin only' });

    // Validate the request body against the productSchema
    const { error } = productSchema.validate(req.body);
    // If validation fails, return 400 status with detailed error message
    if (error) return res.status(400).json({ msg: error.details[0].message });

    // Create a new Product instance with the validated request data
    const product = new Product(req.body);
    // Save the new product to the database
    await product.save();
    // Return the created product as JSON response with 201 Created status code
    res.status(201).json(product);
  } catch (error) {
    // Catch any errors that occur during product creation (database errors, validation errors, etc.)
    console.error(error);
    // Return 500 status with error message for server errors
    res.status(500).json({ msg: 'Server error' });
  }
};

// Export updateProduct function to modify an existing product
exports.updateProduct = async (req, res) => {
  try {
    // Check if the authenticated user has admin privileges - if not, deny access
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Admin only' });
    
    // Find the product by ID and update it with the new request data, then return the updated product
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Check if the product exists - if not, return 404 not found error
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    
    // Return the updated product as JSON response
    res.json(product);
  } catch (error) {
    // Catch any errors that occur during the update operation (database errors, invalid ID format, etc.)
    console.error(error);
    // Return 500 status with error message for server errors
    res.status(500).json({ msg: 'Server error' });
  }
};

// Export deleteProduct function to remove a product from the database
exports.deleteProduct = async (req, res) => {
  try {
    // Check if the authenticated user has admin privileges - if not, deny access
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Admin only' });
    
    // Find the product by ID and delete it from the database
    const product = await Product.findByIdAndDelete(req.params.id);
    
    // Check if the product exists - if not, return 404 not found error
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    
    // Return a confirmation message as JSON response
    res.json({ msg: 'Deleted' });
  } catch (error) {
    // Catch any errors that occur during the delete operation (database errors, invalid ID format, etc.)
    console.error(error);
    // Return 500 status with error message for server errors
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: 'Invalid product id' });
  }
};