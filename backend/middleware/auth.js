// Import JWT library for verifying JSON Web Tokens
const jwt = require('jsonwebtoken');

// Export middleware function that takes request, response, and next function as parameters
module.exports = (req, res, next) => {
  // Extract the JWT token from the request headers using the 'x-auth-token' header
  const token = req.header('x-auth-token');
  // Check if token exists - if not, return 401 status with error message and deny access
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  // Begin try block to handle token verification safely
  try {
    // Verify the token using the JWT secret stored in environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Store the decoded token data (user info) in the request object for use in next middleware/route
    req.user = decoded;
    // Call next() to pass control to the next middleware or route handler
    next();
  // Catch any errors that occur during token verification
  } catch (err) {
    // Return 401 status with error message indicating the token is invalid or expired
    res.status(401).json({ msg: 'Token invalid' });
  }
};
