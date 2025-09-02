// backend/server.js - Fixed version with proper routing
const express = require('express');
const cors = require('cors');
const { connectDatabase, initializeDatabase } = require('./config/database');
const inventoryRoutes = require('./routes/inventory');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/auth', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Inventory Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      inventory: '/api/inventory/*',
      auth: '/api/auth/*'
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    available_endpoints: [
      'GET /health',
      'GET /api/inventory/items',
      'GET /api/inventory/stats',
      'POST /api/inventory/items',
      'PUT /api/inventory/items/:id',
      'DELETE /api/inventory/items/:id'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    console.log('✅ Database connected successfully');
    
    // Initialize database (create tables, default data)
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;