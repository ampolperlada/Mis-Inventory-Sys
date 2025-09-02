// backend/routes/inventory.js
const express = require('express');
const router = express.Router();
const { getPool } = require('../config/database');

// Generate unique asset tag
function generateAssetTag() {
  const prefix = 'AST';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

// GET /api/inventory/items - Get all items with filtering
router.get('/items', async (req, res) => {
  try {
    const pool = getPool();
    const { status, category, department, search, page = 1, limit = 50 } = req.query;
    
    let query = `
      SELECT 
        i.*,
        c.name as category_name,
        CONCAT(u_created.firstName, ' ', u_created.lastName) as created_by_name,
        CONCAT(u_updated.firstName, ' ', u_updated.lastName) as updated_by_name
      FROM inventory_items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN users u_created ON i.created_by = u_created.id
      LEFT JOIN users u_updated ON i.updated_by = u_updated.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Add filtering conditions
    if (status) {
      query += ' AND i.status = ?';
      params.push(status);
    }
    
    if (category) {
      query += ' AND i.category_id = ?';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (i.name LIKE ? OR i.brand LIKE ? OR i.model LIKE ? OR i.serial_number LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY i.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const [items] = await pool.execute(query, params);
    
    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM inventory_items i
      WHERE 1=1
    `;
    const countParams = [];
    
    if (status) {
      countQuery += ' AND i.status = ?';
      countParams.push(status);
    }
    
    if (category) {
      countQuery += ' AND i.category_id = ?';
      countParams.push(category);
    }
    
    if (search) {
      countQuery += ' AND (i.name LIKE ? OR i.brand LIKE ? OR i.model LIKE ? OR i.serial_number LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;
    
    res.json({
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET /api/inventory/items/:id - Get single item
router.get('/items/:id', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    
    const [items] = await pool.execute(`
      SELECT 
        i.*,
        c.name as category_name,
        CONCAT(u_created.firstName, ' ', u_created.lastName) as created_by_name,
        CONCAT(u_updated.firstName, ' ', u_updated.lastName) as updated_by_name
      FROM inventory_items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN users u_created ON i.created_by = u_created.id
      LEFT JOIN users u_updated ON i.updated_by = u_updated.id
      WHERE i.id = ?
    `, [id]);
    
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(items[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST /api/inventory/items - Create new item
router.post('/items', async (req, res) => {
  try {
    console.log('📥 Creating item:', req.body);

    const pool = getPool();
    
    const {
      name = null,
      brand = null,
      model = null,
      category_id = null,
      serialNumber,
      location = null,
      status = 'AVAILABLE',
      condition = 'Good',
      quantity = 1,
      notes = null,
      created_by = 1,
      updated_by = 1
    } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Item name is required' });
    }
    if (!serialNumber || !serialNumber.trim()) {
      return res.status(400).json({ error: 'Serial number is required' });
    }

    const asset_tag_number = generateAssetTag();

    const [result] = await pool.execute(`
      INSERT INTO inventory_items (
        name, brand, model, category_id, serialNumber, 
        location, status, \`condition\`, quantity, notes,
        created_at, updated_at, created_by, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      brand,
      model,
      category_id,
      serialNumber,
      location,
      status,
      condition,
      quantity,
      notes,
      new Date(),
      new Date(),
      created_by,
      updated_by
    ]);
    
    const [newItem] = await pool.execute(`
      SELECT i.*, c.name as category_name
      FROM inventory_items i
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.id = ?
    `, [result.insertId]);
    
    res.status(201).json(newItem[0]);
  } catch (error) {
    console.error('❌ Error creating item:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Serial number or asset tag already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create item' });
    }
  }
});

// PUT /api/inventory/items/:id - Update item
router.put('/items/:id', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.asset_tag_number;
    delete updateData.created_at;
    delete updateData.created_by;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    // Build dynamic update query
    const fields = Object.keys(updateData).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(1, id); // updated_by, id
    
    const [result] = await pool.execute(`
      UPDATE inventory_items 
      SET ${fields}, updated_by = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Fetch updated item
    const [updatedItem] = await pool.execute(`
      SELECT i.*, c.name as category_name
      FROM inventory_items i
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.id = ?
    `, [id]);
    
    res.json(updatedItem[0]);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE /api/inventory/items/:id - Delete item
router.delete('/items/:id', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    
    // Check if item exists and get details for logging
    const [items] = await pool.execute('SELECT name FROM inventory_items WHERE id = ?', [id]);
    
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const itemName = items[0].name;
    
    // Delete the item
    await pool.execute('DELETE FROM inventory_items WHERE id = ?', [id]);
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// POST /api/inventory/items/:id/checkout - Check out item
router.post('/items/:id/checkout', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const {
      assigned_to_name, employee_id, department, email, phone,
      assignment_date, expected_return_date, assignment_notes
    } = req.body;
    
    if (!assigned_to_name) {
      return res.status(400).json({ error: 'Assigned to name is required' });
    }
    
    // Update item status
    const [updateResult] = await pool.execute(
      'UPDATE inventory_items SET status = ? WHERE id = ? AND status = ?',
      ['assigned', id, 'available']
    );
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found or not available for checkout' });
    }
    
    // Fetch updated item
    const [item] = await pool.execute(`
      SELECT i.*, c.name as category_name
      FROM inventory_items i
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.id = ?
    `, [id]);
    
    res.json(item[0]);
  } catch (error) {
    console.error('Error checking out item:', error);
    res.status(500).json({ error: 'Failed to check out item' });
  }
});

// POST /api/inventory/items/:id/checkin - Check in item
router.post('/items/:id/checkin', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { return_notes, return_condition = 'good' } = req.body;
    
    // Update item status
    const [updateResult] = await pool.execute(
      'UPDATE inventory_items SET status = ? WHERE id = ? AND status = ?',
      ['available', id, 'assigned']
    );
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found or not currently assigned' });
    }
    
    // Fetch updated item
    const [item] = await pool.execute(`
      SELECT i.*, c.name as category_name
      FROM inventory_items i
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.id = ?
    `, [id]);
    
    res.json(item[0]);
  } catch (error) {
    console.error('Error checking in item:', error);
    res.status(500).json({ error: 'Failed to check in item' });
  }
});

// POST /api/inventory/items - Create new item
router.post('/items', async (req, res) => {
  try {
    console.log('📥 Creating item:', req.body);

    const pool = getPool();
    
    const {
      item_name,
      brand = null,
      model = null,
      category_id = null,
      serial_number,
      location = null,
      status = 'available',
      condition_status = 'new',
      processor = null,
      ram = null,
      storage = null,
      operating_system = null,
      hostname = null,
      mac_address = null,
      ip_address = null,
      purchase_date = null,
      purchase_price = null,
      supplier = null,
      warranty_period = null,
      description = null,
      notes = null
    } = req.body;

    // Validate required fields
    if (!item_name || !item_name.trim()) {
      return res.status(400).json({ error: 'Item name is required' });
    }
    if (!serial_number || !serial_number.trim()) {
      return res.status(400).json({ error: 'Serial number is required' });
    }

    const asset_tag_number = generateAssetTag();

    const [result] = await pool.execute(`
      INSERT INTO inventory_items (
        item_name, brand, model, category_id, asset_tag_number,
        serial_number, location, status, condition_status,
        processor, ram, storage, operating_system,
        hostname, mac_address, ip_address,
        purchase_date, purchase_price, supplier, warranty_period,
        description, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      item_name,
      brand,
      model,
      category_id,
      asset_tag_number,
      serial_number,
      location,
      status,
      condition_status,
      processor,
      ram,
      storage,
      operating_system,
      hostname,
      mac_address,
      ip_address,
      purchase_date,
      purchase_price,
      supplier,
      warranty_period,
      description,
      notes,
      1
    ]);
    
    const [newItem] = await pool.execute(`
      SELECT i.*, c.name as category_name
      FROM inventory_items i
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.id = ?
    `, [result.insertId]);
    
    res.status(201).json(newItem[0]);
  } catch (error) {
    console.error('❌ Error creating item:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Serial number or asset tag already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create item' });
    }
  }
});

// GET /api/inventory/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const pool = getPool();
    const [categories] = await pool.execute('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;