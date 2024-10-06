const express = require('express');
const cors = require('cors');
const app = express();

// Middleware to enable CORS
app.use(cors());
app.use(express.json());

// Example route
app.get('/', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
