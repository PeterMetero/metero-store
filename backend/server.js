const express = require('express'); // Import Express.js framework for building web applications
const mongoose = require('mongoose'); // Import Mongoose for MongoDB object modeling and schema management
const dotenv = require('dotenv'); // Import dotenv to load environment variables from .env file
const cors = require('cors'); // Import CORS middleware to enable Cross-Origin Resource Sharing

dotenv.config(); // Load environment variables from .env file into process.env object
const app = express(); // Create an Express application instance

app.use(cors()); // Enable CORS middleware for all routes to allow cross-origin requests
app.use(express.json()); // Middleware to parse incoming request bodies with JSON content

mongoose.connect(process.env.MONGO_URI) // Establish connection to MongoDB using the URI from environment variables
  .then(() => console.log('MongoDB connected')) // Execute this function when MongoDB connection is successfully established
  .catch(err => console.log(err)); // Execute this function if MongoDB connection fails and log the error

app.get('/', (req, res) => res.send('Metero Store Backend Running')); // Define a GET route handler for the root path that sends a response message

const PORT = process.env.PORT || 5000; // Get the server port from environment variables, or use 5000 as the default port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start the server and listen on the specified port, then log the port number

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes); // Use the userRoutes for any routes that start with /api/users

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes); // Use the productRoutes for any routes that start with /api/products