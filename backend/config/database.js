const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'inventory_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
});

// Get promise-based pool
const promisePool = pool.promise();

// Test connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Create users table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'manager', 'employee') DEFAULT 'employee',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create items table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        brand VARCHAR(50),
        model VARCHAR(50),
        serial_number VARCHAR(100) UNIQUE,
        category VARCHAR(50),
        status ENUM('available', 'assigned', 'maintenance', 'retired') DEFAULT 'available',
        condition_status ENUM('new', 'good', 'fair', 'poor') DEFAULT 'new',
        purchase_date DATE,
        purchase_price DECIMAL(10,2),
        location VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create assignments table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_id INT,
        assigned_to VARCHAR(100),
        assigned_by INT,
        assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        returned_date TIMESTAMP NULL,
        status ENUM('active', 'returned') DEFAULT 'active',
        notes TEXT,
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_by) REFERENCES users(id)
      )
    `);

    console.log('✅ Database tables initialized successfully');

    // Check if admin user exists, if not create one
    const [adminCheck] = await promisePool.execute(
      'SELECT id FROM users WHERE username = ?', 
      ['admin']
    );

    if (adminCheck.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await promisePool.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@inventory.com', hashedPassword, 'admin']
      );
      
      console.log('✅ Default admin user created (username: admin, password: admin123)');
    }

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
  }
};

// Initialize on startup
testConnection();
initializeDatabase();

module.exports = promisePool;