// backend/config/database.js - Clean Schema-based configuration
const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

// Database connection configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root', 
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'inventory_system',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Complete table schemas
const schemas = {
  categories: `
    CREATE TABLE IF NOT EXISTS categories (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  
  users: `
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
  `,
  
  inventory_items: `
    CREATE TABLE IF NOT EXISTS inventory_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      
      -- Basic Information
      item_name VARCHAR(255) NOT NULL,
      serialNumber VARCHAR(191) UNIQUE NOT NULL,
      brand VARCHAR(191) NULL,
      model VARCHAR(191) NULL,
      category VARCHAR(255) NULL DEFAULT 'Other',
      status ENUM('available','assigned','maintenance','retired') NOT NULL DEFAULT 'available',
      \`condition\` VARCHAR(191) NOT NULL DEFAULT 'good',
      location VARCHAR(191) NULL,
      quantity INT(11) NOT NULL DEFAULT 1,
      notes TEXT NULL,
      
      -- Technical Specifications
      hostname VARCHAR(255) NULL,
      operating_system VARCHAR(255) NULL,
      processor VARCHAR(255) NULL,
      ram VARCHAR(100) NULL,
      storage VARCHAR(100) NULL,
      specs TEXT NULL,
      
      -- Purchase & Warranty
      purchase_date DATE NULL,
      warranty_period VARCHAR(100) NULL,
      deployment_date DATE NULL,
      
      -- Assignment Information
      assigned_to VARCHAR(255) NULL,
      assigned_email VARCHAR(255) NULL,
      assigned_phone VARCHAR(50) NULL,
      assignment_date DATETIME NULL,
      department VARCHAR(255) NULL,
      
      -- Disposal Information
      disposal_reason TEXT NULL,
      disposal_date DATETIME NULL,
      disposed_by VARCHAR(255) NULL,
      
      -- Timestamps
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      
      -- Legacy fields (can be removed later)
      category_id INT NULL,
      created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      created_by INT(11) NULL,
      updated_by INT(11) NULL,
      
      -- Indexes
      KEY category_id (category_id),
      KEY created_by (created_by),
      KEY updated_by (updated_by),
      KEY status_idx (status),
      KEY category_idx (category),
      KEY assigned_to_idx (assigned_to)
    )
  `,
  
  item_assignments: `
    CREATE TABLE IF NOT EXISTS item_assignments (
      id INT PRIMARY KEY AUTO_INCREMENT,
      item_id INT NOT NULL,
      assigned_to VARCHAR(255) NOT NULL,
      assigned_by VARCHAR(255) NULL,
      department VARCHAR(255) NULL,
      email VARCHAR(255) NULL,
      phone VARCHAR(50) NULL,
      assignment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      return_date DATETIME NULL,
      notes TEXT NULL,
      status ENUM('active', 'returned') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
      KEY item_id_idx (item_id),
      KEY status_idx (status)
    )
  `,
  
  activity_logs: `
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      item_id INT NULL,
      action VARCHAR(100) NOT NULL,
      description TEXT NULL,
      user_id INT NULL,
      user_name VARCHAR(255) NULL,
      old_values JSON NULL,
      new_values JSON NULL,
      ip_address VARCHAR(45) NULL,
      user_agent TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      KEY item_id_idx (item_id),
      KEY action_idx (action),
      KEY created_at_idx (created_at)
    )
  `
};

// Connect to database and create pool
const connectDatabase = async () => {
  try {
    console.log('🔌 Connecting to database with config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });

    // First, connect without database to create it if it doesn't exist
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    // Create database if it doesn't exist
    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log(`📂 Database '${dbConfig.database}' created or verified`);
    await tempConnection.end();

    // Now create the pool with the database
    pool = mysql.createPool(dbConfig);
    
    // Test the connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    
    console.log('✅ Database connection pool created successfully');
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('📋 Check your .env file configuration:');
    console.error(`   DB_HOST=${process.env.DB_HOST || 'not set'}`);
    console.error(`   DB_USER=${process.env.DB_USER || 'not set'}`);
    console.error(`   DB_PASSWORD=${process.env.DB_PASSWORD ? '***set***' : 'not set'}`);
    console.error(`   DB_NAME=${process.env.DB_NAME || 'not set'}`);
    console.error(`   DB_PORT=${process.env.DB_PORT || 'not set'}`);
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

// Initialize database tables with complete schemas
const initializeDatabase = async () => {
  try {
    const pool = getPool();
    
    console.log('🔨 Creating database tables with complete schemas...');
    
    // Create tables in order (respecting foreign key dependencies)
    const tableOrder = ['categories', 'users', 'inventory_items', 'item_assignments', 'activity_logs'];
    
    for (const tableName of tableOrder) {
      console.log(`📋 Creating table: ${tableName}`);
      await pool.execute(schemas[tableName]);
    }

    console.log('📋 Database tables created successfully');

    // Insert default categories
    const categories = [
      ['Desktop', 'Desktop computers'],
      ['Laptop', 'Laptop computers'],
      ['Monitor', 'Computer monitors'],
      ['Network Equipment', 'Routers, switches, and network devices'],
      ['Mobile Device', 'Phones, tablets, and mobile devices'],
      ['Accessories', 'Keyboards, mice, and accessories'],
      ['Other', 'Other equipment']
    ];

    for (const [name, description] of categories) {
      await pool.execute(`
        INSERT IGNORE INTO categories (name, description) VALUES (?, ?)
      `, [name, description]);
    }

    console.log('✅ Database tables initialized successfully');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

// Drop and recreate all tables (USE WITH CAUTION - DEVELOPMENT ONLY)
const resetDatabase = async () => {
  try {
    const pool = getPool();
    
    console.log('⚠️  RESETTING DATABASE - ALL DATA WILL BE LOST');
    
    // Drop tables in reverse order (respecting foreign key dependencies)
    const dropOrder = ['activity_logs', 'item_assignments', 'inventory_items', 'users', 'categories'];
    
    for (const tableName of dropOrder) {
      await pool.execute(`DROP TABLE IF EXISTS ${tableName}`);
      console.log(`🗑️  Dropped table: ${tableName}`);
    }
    
    // Recreate tables
    await initializeDatabase();
    
    console.log('✅ Database reset completed');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
};

// Close database connection
const closeDatabase = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('🔌 Database connection closed');
  }
};

// Get table schema information
const getTableSchema = async (tableName) => {
  try {
    const pool = getPool();
    const [columns] = await pool.execute(`DESCRIBE ${tableName}`);
    return columns;
  } catch (error) {
    console.error(`Error getting schema for table ${tableName}:`, error);
    throw error;
  }
};

module.exports = {
  connectDatabase,
  getPool,
  initializeDatabase,
  resetDatabase,
  closeDatabase,
  getTableSchema,
  schemas
};