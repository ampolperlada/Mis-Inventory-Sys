const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

async function initializeDatabase() {
  try {
    // First connect without database to create it if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.end();

    // Now create the pool with the database
    pool = mysql.createPool(dbConfig);

    // Test the connection
    const testConnection = await pool.getConnection();
    await testConnection.ping();
    testConnection.release();

    console.log('✅ Database connected successfully');
    
    // Initialize tables
    await createTables();
    console.log('✅ Database tables initialized successfully');

    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

async function createTables() {
  try {
    // Categories table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Users table (matching your existing structure exactly)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Main inventory items table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        
        -- Basic Information
        item_name VARCHAR(200) NOT NULL,
        brand VARCHAR(100),
        model VARCHAR(100),
        category_id INT,
        asset_tag_number VARCHAR(50) UNIQUE NOT NULL,
        
        -- Technical Details
        serial_number VARCHAR(100) UNIQUE,
        location VARCHAR(200),
        status ENUM('available', 'assigned', 'maintenance', 'retired') DEFAULT 'available',
        condition_status ENUM('new', 'excellent', 'good', 'fair', 'poor') DEFAULT 'new',
        
        -- Hardware Specifications
        processor VARCHAR(200),
        ram VARCHAR(100),
        storage VARCHAR(100),
        operating_system VARCHAR(100),
        
        -- Network Details
        hostname VARCHAR(100),
        mac_address VARCHAR(17),
        ip_address VARCHAR(15),
        
        -- Purchase Information
        purchase_date DATE,
        purchase_price DECIMAL(10,2),
        supplier VARCHAR(200),
        warranty_period VARCHAR(100),
        
        -- Additional Information
        description TEXT,
        notes TEXT,
        
        -- Metadata
        created_by INT,
        updated_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        -- Indexes for better performance
        INDEX idx_status (status),
        INDEX idx_category (category_id),
        INDEX idx_asset_tag (asset_tag_number),
        INDEX idx_serial (serial_number)
      )
    `);

    // Item assignments table (simplified)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS item_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_id INT NOT NULL,
        assigned_to_user_id INT,
        assigned_to_name VARCHAR(100),
        employee_id VARCHAR(50),
        department VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        assignment_date DATE NOT NULL,
        expected_return_date DATE,
        actual_return_date DATE,
        assignment_notes TEXT,
        return_notes TEXT,
        return_condition ENUM('excellent', 'good', 'fair', 'poor'),
        assigned_by INT,
        returned_by INT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_item (item_id),
        INDEX idx_active (is_active),
        INDEX idx_assignment_date (assignment_date)
      )
    `);

    // Activity logs table (simplified)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_id INT,
        user_id INT,
        action ENUM('created', 'updated', 'assigned', 'returned', 'deleted') NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_item_logs (item_id),
        INDEX idx_action (action),
        INDEX idx_created (created_at)
      )
    `);

    // Insert default categories
    await pool.execute(`
      INSERT IGNORE INTO categories (name, description) VALUES
      ('Laptop', 'Portable computers'),
      ('Desktop', 'Desktop computers'),
      ('Monitor', 'Display monitors'),
      ('Printer', 'Printing devices'),
      ('Phone', 'Mobile phones and desk phones'),
      ('Tablet', 'Tablet devices'),
      ('Accessories', 'Computer accessories'),
      ('Other', 'Other equipment')
    `);

    // Create default admin user (password: admin123)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.execute(`
      INSERT IGNORE INTO users (username, email, password, firstName, lastName, role) VALUES
      ('admin', 'admin@inventory.local', ?, 'System', 'Administrator', 'admin')
    `, [hashedPassword]);

    console.log('✅ Default categories and admin user created');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
}

function getPool() {
  return pool;
}

// Export functions
module.exports = {
  initializeDatabase,
  getPool
};