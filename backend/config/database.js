// backend/config/database.js - Fixed version
const mysql = require('mysql2/promise');

let pool = null;

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'inventory_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Connect to database and create pool
const connectDatabase = async () => {
  try {
    // First, connect without database to create it if it doesn't exist
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    // Create database if it doesn't exist
    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await tempConnection.end();

    // Now create the pool with the database
    pool = mysql.createPool(dbConfig);
    
    // Test the connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    
    console.log('Database connection pool created successfully');
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

// Get the pool instance
const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call connectDatabase() first.');
  }
  return pool;
};

// Initialize database tables and default data
const initializeDatabase = async () => {
  try {
    const pool = getPool();
    
    // Create categories table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create inventory_items table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        item_name VARCHAR(255) NOT NULL,
        serialNumber VARCHAR(191) UNIQUE NOT NULL,
        brand VARCHAR(191) NULL,
        model VARCHAR(191) NULL,
        category ENUM('DESKTOP','LAPTOP','MONITOR','KEYBOARD','MOUSE','PRINTER','OTHER') NOT NULL DEFAULT 'OTHER',
        specs VARCHAR(191) NULL,
        \`condition\` VARCHAR(191) NOT NULL DEFAULT 'Good',
        status ENUM('AVAILABLE','ASSIGNED','MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
        location VARCHAR(191) NULL,
        quantity INT(11) NOT NULL DEFAULT 1,
        notes VARCHAR(191) NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        category_id INT NULL,
        created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by INT(11) NULL,
        updated_by INT(11) NULL,
        KEY category_id (category_id),
        KEY created_by (created_by),
        KEY updated_by (updated_by)
      )
    `);

    // Insert default categories
    const categories = [
      ['DESKTOP', 'Desktop computers'],
      ['LAPTOP', 'Laptop computers'],
      ['MONITOR', 'Computer monitors'],
      ['KEYBOARD', 'Keyboards'],
      ['MOUSE', 'Computer mice'],
      ['PRINTER', 'Printers and scanners'],
      ['OTHER', 'Other equipment']
    ];

    for (const [name, description] of categories) {
      await pool.execute(`
        INSERT IGNORE INTO categories (name, description) VALUES (?, ?)
      `, [name, description]);
    }

    // Create default admin user
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.execute(`
      INSERT IGNORE INTO users (firstName, lastName, email, password, role) 
      VALUES (?, ?, ?, ?, ?)
    `, ['Admin', 'User', 'admin@inventory.com', hashedPassword, 'admin']);

    console.log('✅ Default categories and admin user created');
    console.log('✅ Database tables initialized successfully');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Close database connection
const closeDatabase = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database connection closed');
  }
};

module.exports = {
  connectDatabase,
  getPool,
  initializeDatabase,
  closeDatabase
};