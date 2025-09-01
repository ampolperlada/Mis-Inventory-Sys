// backend/config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'inventory_user', 
  password: process.env.DB_PASSWORD || 'secure123',
  database: process.env.DB_NAME || 'inventorydb',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const pool = getPool();
    
    // Create categories table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create users table (simplified)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create inventory_items table (matching your routes)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        asset_tag_number VARCHAR(20) NOT NULL UNIQUE,
        item_name VARCHAR(255) NOT NULL,
        brand VARCHAR(100),
        model VARCHAR(100),
        serial_number VARCHAR(100),
        category_id INT,
        status ENUM('available', 'assigned', 'maintenance', 'retired') DEFAULT 'available',
        condition_status ENUM('new', 'excellent', 'good', 'fair', 'poor') DEFAULT 'good',
        location VARCHAR(100),
        processor VARCHAR(100),
        ram VARCHAR(50),
        storage VARCHAR(100),
        operating_system VARCHAR(100),
        hostname VARCHAR(100),
        mac_address VARCHAR(17),
        ip_address VARCHAR(15),
        purchase_date DATE,
        purchase_price DECIMAL(10,2),
        supplier VARCHAR(100),
        warranty_period VARCHAR(50),
        description TEXT,
        notes TEXT,
        created_by INT,
        updated_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_asset_tag (asset_tag_number),
        INDEX idx_status (status),
        INDEX idx_category (category_id)
      )
    `);

    // Create default categories
    const defaultCategories = [
      ['Computers', 'Desktop computers, laptops, tablets'],
      ['Monitors', 'Computer monitors and displays'],
      ['Networking', 'Routers, switches, access points'],
      ['Printers', 'Printers, scanners, multifunction devices'],
      ['Mobile Devices', 'Smartphones, tablets, mobile accessories'],
      ['Furniture', 'Office furniture, desks, chairs'],
      ['Other', 'Miscellaneous items']
    ];

    for (const [name, description] of defaultCategories) {
      await pool.execute(
        'INSERT IGNORE INTO categories (name, description) VALUES (?, ?)',
        [name, description]
      );
    }

    // Create default admin user
    const bcrypt = require('bcryptjs');
    const defaultPassword = await bcrypt.hash('admin123', 10);
    
    await pool.execute(`
      INSERT IGNORE INTO users (username, full_name, email, password, role) 
      VALUES (?, ?, ?, ?, ?)
    `, ['admin', 'System Administrator', 'admin@company.com', defaultPassword, 'admin']);

    console.log('✅ Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
};

module.exports = { getPool, initializeDatabase };