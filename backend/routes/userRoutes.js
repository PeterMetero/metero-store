// Import Express framework for creating router
const express = require('express');
// Import register and login functions from the user controller
const { register, login } = require('../controllers/userController');

// Create a new Express router instance
const router = express.Router();

// Define a POST route for user registration that calls the register controller function
router.post('/register', register);
// Define a POST route for user login that calls the login controller function
router.post('/login', login);

// Export the router so it can be used in the main server file
module.exports = router;
