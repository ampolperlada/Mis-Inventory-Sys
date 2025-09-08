// backend/server.js - Network accessible version with schema support
const express = require('express');
const cors = require('cors');
const { connectDatabase, initializeDatabase, resetDatabase } = require('./config/database');
const inventoryRoutes = require('./routes/inventory');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

// Middleware - Updated CORS to allow your network IP
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000',
    'http://192.168.0.138:3000', // Your network IP
    'http://192.168.0.*:3000'    // Allow any device on your subnet
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    host: req.get('host')
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
    server_ip: '192.168.0.138',
    endpoints: {
      health: '/health',
      inventory: '/api/inventory/*',
      auth: '/api/auth/*'
    }
  });
});

// Stats endpoint for dashboard - Updated for new schema
app.get('/api/inventory/stats', async (req, res) => {
  try {
    const pool = require('./config/database').getPool();
    
    // Get total count (exclude retired items from main stats)
    const [totalResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM inventory_items WHERE status != ?', 
      ['retired']
    );
    const totalItems = totalResult[0].total;
    
    // Get available count
    const [availableResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM inventory_items WHERE status = ?', 
      ['available']
    );
    const available = availableResult[0].count;
    
    // Get assigned count
    const [assignedResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM inventory_items WHERE status = ?', 
      ['assigned']
    );
    const assigned = assignedResult[0].count;
    
    // Get maintenance count
    const [maintenanceResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM inventory_items WHERE status = ?', 
      ['maintenance']
    );
    const maintenance = maintenanceResult[0].count;
    
    // Get retired count for disposal section
    const [retiredResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM inventory_items WHERE status = ?', 
      ['retired']
    );
    const retired = retiredResult[0].count;
    
    res.json({
      totalItems,
      available,
      assigned,
      maintenance,
      retired
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      message: error.message 
    });
  }
});

// Database management endpoints (development only)
if (process.env.NODE_ENV === 'development') {
  // Reset database endpoint (DANGEROUS - development only)
  app.post('/api/admin/reset-database', async (req, res) => {
    try {
      console.log('⚠️  Database reset requested via API');
      await resetDatabase();
      res.json({ 
        success: true, 
        message: 'Database reset completed successfully' 
      });
    } catch (error) {
      console.error('Error resetting database:', error);
      res.status(500).json({ 
        error: 'Failed to reset database',
        message: error.message 
      });
    }
  });

  // Get database schema endpoint
  app.get('/api/admin/schema/:table', async (req, res) => {
    try {
      const { getTableSchema } = require('./config/database');
      const schema = await getTableSchema(req.params.table);
      res.json({ table: req.params.table, schema });
    } catch (error) {
      console.error('Error getting schema:', error);
      res.status(500).json({ 
        error: 'Failed to get table schema',
        message: error.message 
      });
    }
  });
}

// 404 handler for undefined routes
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl} from ${req.ip}`);
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
      'DELETE /api/inventory/items/:id',
      'POST /api/inventory/items/:id/checkout',
      'POST /api/inventory/items/:id/checkin'
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
    
    // Choose database initialization strategy
    const shouldReset = process.env.RESET_DB === 'true' || process.argv.includes('--reset-db');
    
    if (shouldReset) {
      console.log('⚠️  RESETTING DATABASE (--reset-db flag detected)');
      await resetDatabase();
      console.log('✅ Database reset and initialized with new schema');
    } else {
      // Normal initialization (create tables if they don't exist)
      await initializeDatabase();
      console.log('✅ Database initialized successfully');
    }
    
    // Start the server on all network interfaces
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
      console.log(`🌐 Network Access: http://192.168.0.138:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Local API URL: http://localhost:${PORT}/api`);
      console.log(`🔗 Network API URL: http://192.168.0.138:${PORT}/api`);
      console.log(`🏥 Health Check: http://192.168.0.138:${PORT}/health`);
      console.log(`📱 Officemates can access at: http://192.168.0.138:${PORT}`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🛠️  Development mode: Database admin endpoints available');
        console.log(`   Reset DB: POST http://192.168.0.138:${PORT}/api/admin/reset-database`);
        console.log(`   View Schema: GET http://192.168.0.138:${PORT}/api/admin/schema/inventory_items`);
      }
      
      if (shouldReset) {
        console.log('');
        console.log('💡 Database was reset. All existing data has been cleared.');
        console.log('💡 You can now add items with the complete schema including:');
        console.log('   - Technical specifications (hostname, OS, processor, RAM, storage)');
        console.log('   - Purchase & warranty information (dates, warranty period)');
        console.log('   - Assignment tracking');
        console.log('   - Activity logging');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;