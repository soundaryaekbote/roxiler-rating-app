require('dotenv').config();

const express = require('express');
const cors = require('cors');

// connect the database 
require('./src/config/db');


const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const storeRoutes = require('./src/routes/storeRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Store Rating API'
    });
});


app.get('/api', (req, res) => {
    res.json({
        message: 'Store Rating Backend Running Successfully'
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        message: 'Internal Server Error'
    });
});

// Start the Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server is running on port ${PORT}`
    );
});