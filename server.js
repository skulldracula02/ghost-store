 const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Example test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Ghost Store backend is running!' });
});

// Export the app for Vercel serverless functions
module.exports = app;
