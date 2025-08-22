const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'inventory_system',
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
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        department VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create inventory_items table (matching the actual table name)
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS inventory_items (
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
        description TEXT,
        notes TEXT,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create item_assignments table (matching the actual table name)
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS item_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_id INT NOT NULL,
        assigned_to_user_id INT,
        assigned_to_name VARCHAR(100),
        assigned_by_user_id INT NOT NULL,
        assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        due_date DATE,
        returned_date TIMESTAMP NULL,
        status ENUM('active', 'returned', 'overdue') DEFAULT 'active',
        assignment_notes TEXT,
        return_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (assigned_by_user_id) REFERENCES users(id) ON DELETE RESTRICT
      )
    `);

    // Create categories table for better organization
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized successfully');

    // Insert default categories
    const [categoryCheck] = await promisePool.execute('SELECT COUNT(*) as count FROM categories');
    if (categoryCheck[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO categories (name, description) VALUES 
        ('Laptops', 'Laptop computers and accessories'),
        ('Monitors', 'Computer monitors and displays'),
        ('Phones', 'Mobile phones and tablets'),
        ('Furniture', 'Office furniture and equipment'),
        ('Peripherals', 'Keyboards, mice, and other peripherals'),
        ('Networking', 'Routers, switches, and network equipment')
      `);
      console.log('✅ Default categories created');
    }

    // Check if admin user exists, if not create one
    const [adminCheck] = await promisePool.execute(
      'SELECT id FROM users WHERE username = ?', 
      ['admin']
    );

    if (adminCheck.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await promisePool.execute(
        'INSERT INTO users (username, email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin', 'admin@inventory.com', hashedPassword, 'admin', 'System', 'Administrator']
      );
      
      console.log('✅ Default admin user created (username: admin, password: admin123)');
    }

    // Insert some sample data for testing (optional)
    const [itemCheck] = await promisePool.execute('SELECT COUNT(*) as count FROM inventory_items');
    if (itemCheck[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO inventory_items (name, brand, model, serial_number, category, status, condition_status, purchase_date, purchase_price, location, description) VALUES 
        ('MacBook Pro 14"', 'Apple', 'MBP14-2023', 'MBA001', 'Laptops', 'available', 'new', '2023-01-15', 2499.00, 'IT Storage', 'MacBook Pro 14-inch with M2 chip'),
        ('Dell Monitor 27"', 'Dell', 'U2720Q', 'DEL001', 'Monitors', 'available', 'good', '2022-11-20', 599.00, 'IT Storage', '4K UltraSharp monitor'),
        ('iPhone 15 Pro', 'Apple', 'iPhone15Pro', 'IPH001', 'Phones', 'assigned', 'new', '2023-09-20', 999.00, 'Employee Desk', 'Latest iPhone model'),
        ('Office Chair', 'Herman Miller', 'Aeron', 'HM001', 'Furniture', 'available', 'good', '2021-03-10', 1395.00, 'Office Floor 2', 'Ergonomic office chair'),
        ('Wireless Keyboard', 'Logitech', 'MX Keys', 'LOG001', 'Peripherals', 'available', 'good', '2022-08-15', 99.00, 'IT Storage', 'Professional wireless keyboard')
      `);
      console.log('✅ Sample inventory data created');
    }

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
  }
};

// Initialize on startup
testConnection();
initializeDatabase();

module.exports = promisePool;