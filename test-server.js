// test-server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Server is running!',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Database connection (use your existing database.js)
const connectDB = require('./config/database.js');

// Start server
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.log('Failed to start server:', error);
    }
}

startServer();
