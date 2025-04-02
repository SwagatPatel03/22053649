// app.js
const express = require('express');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// API Endpoint: POST /average
app.post('/average', (req, res) => {
  // Extract numbers from the request body
  const { numbers } = req.body;
  
  // Validate that numbers is an array with at least one number
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of numbers in the "numbers" field.' });
  }
  
  // Validate that all elements are numbers
  for (let num of numbers) {
    if (typeof num !== 'number') {
      return res.status(400).json({ error: 'All elements in the numbers array must be numeric.' });
    }
  }
  
  // Calculate the average without using any external libraries
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const average = sum / numbers.length;
  
  // Prepare and send the response
  return res.json({ average });
});

// Start the server on port 3000 (or any port of your choice)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Average Calculator API is running on port ${PORT}`);
});
