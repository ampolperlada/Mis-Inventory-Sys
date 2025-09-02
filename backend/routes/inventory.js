// backend/routes/inventory.js - Complete functional version
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

// GET /api/inventory/stats - Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const pool = getPool();
    
    // Get total items count
    const [totalResult] = await pool.execute('SELECT COUNT(*) as total FROM inventory_items');
    const totalItems = totalResult[0].total;
    
    // Get counts by status
    const [statusResult] = await pool.execute(`
      SELECT 
        status,
        COUNT(*) as count 
      FROM inventory_items 
      GROUP BY status
    `);
    
    // Initialize stats
    const stats = {
      totalItems: totalItems,
      available: 0,
      assigned: 0,
      maintenance: 0
    };
    
    // Map status counts
    statusResult.forEach(row => {
      const status = row.status.toLowerCase();
      switch (status) {
        case 'available':
          stats.available = row.count;
          break;
        case 'assigned':
          stats.assigned = row.count;
          break;
        case 'maintenance':
          stats.maintenance = row.count;
          break;
      }
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET /api/inventory/items - Get all items with filtering
router.get('/items', async (req, res) => {
  try {
    const pool = getPool();
    const { status, category, search, page = 1, limit = 50 } = req.query;
    
    let query = `
      SELECT 
        i.id,
        i.item_name,
        i.brand,
        i.model,
        i.serialNumber,
        i.category,
        i.status,
        i.condition,
        i.location,
        i.quantity,
        i.notes,
        i.createdAt,
        i.updatedAt
      FROM inventory_items i
      WHERE 1=1
    `;
    
    const params = [];
    
    // Add filtering conditions
    if (status) {
      query += ' AND i.status = ?';
      params.push(status);
    }
    
    if (category) {
      query += ' AND i.category = ?';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (i.item_name LIKE ? OR i.brand LIKE ? OR i.model LIKE ? OR i.serialNumber LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY i.createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const [items] = await pool.execute(query, params);
    
    // Map database fields to what frontend expects
    const mappedItems = items.map(item => ({
      id: item.id,
      item_name: item.item_name,
      brand: item.brand,
      model: item.model,
      serial_number: item.serialNumber, // Map serialNumber to serial_number for frontend
      category: item.category,
      status: item.status ? item.status.toLowerCase() : 'available', // Ensure lowercase status
      condition_status: item.condition,
      location: item.location,
      quantity: item.quantity,
      notes: item.notes,
      created_at: item.createdAt,
      updated_at: item.updatedAt
    }));
    
    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM inventory_items i WHERE 1=1`;
    const countParams = [];
    
    if (status) {
      countQuery += ' AND i.status = ?';
      countParams.push(status);
    }
    
    if (category) {
      countQuery += ' AND i.category = ?';
      countParams.push(category);
    }
    
    if (search) {
      countQuery += ' AND (i.item_name LIKE ? OR i.brand LIKE ? OR i.model LIKE ? OR i.serialNumber LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;
    
    res.json({
      items: mappedItems,
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
        i.id,
        i.item_name,
        i.brand,
        i.model,
        i.serialNumber,
        i.category,
        i.status,
        i.condition,
        i.location,
        i.quantity,
        i.notes,
        i.createdAt,
        i.updatedAt
      FROM inventory_items i
      WHERE i.id = ?
    `, [id]);
    
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Map database fields to what frontend expects
    const item = items[0];
    const mappedItem = {
      id: item.id,
      item_name: item.item_name,
      brand: item.brand,
      model: item.model,
      serial_number: item.serialNumber,
      category: item.category,
      status: item.status ? item.status.toLowerCase() : 'available',
      condition_status: item.condition,
      location: item.location,
      quantity: item.quantity,
      notes: item.notes,
      created_at: item.createdAt,
      updated_at: item.updatedAt
    };
    
    res.json(mappedItem);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});
// POST /api/inventory/items - Create new item (FIXED)
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
      status = 'AVAILABLE',
      condition_status = 'Good',
      quantity = 1,
      notes = null
    } = req.body;

    // Validate required fields
    if (!item_name || !item_name.trim()) {
      return res.status(400).json({ error: 'Item name is required' });
    }
    if (!serial_number || !serial_number.trim()) {
      return res.status(400).json({ error: 'Serial number is required' });
    }

    // Set a default category if none provided
    const categoryToUse = category_id || 'OTHER';

    // FIXED: Remove createdAt, updatedAt - let MySQL handle auto-timestamps
    const [result] = await pool.execute(`
      INSERT INTO inventory_items (
        item_name, serialNumber, brand, model, category,
        location, status, \`condition\`, quantity, notes,
        created_by, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      item_name,        
      serial_number,    
      brand,
      model,
      categoryToUse,    
      location,
      status,
      condition_status, 
      quantity,
      notes,
      1,              // created_by
      1               // updated_by
    ]);
    
    // Fetch the created item and map fields properly
    const [newItem] = await pool.execute(`
      SELECT 
        id,
        item_name,
        brand,
        model,
        serialNumber as serial_number,
        category,
        status,
        \`condition\` as condition_status,
        location,
        quantity,
        notes,
        createdAt as created_at,
        updatedAt as updated_at
      FROM inventory_items 
      WHERE id = ?
    `, [result.insertId]);
    
    console.log('✅ Item created successfully with ID:', result.insertId);
    res.status(201).json(newItem[0]);
  } catch (error) {
    console.error('❌ Error creating item:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.sqlMessage.includes('serialNumber')) {
        res.status(409).json({ error: 'Serial number already exists' });
      } else {
        res.status(409).json({ error: 'Duplicate entry error' });
      }
    } else {
      res.status(500).json({ error: 'Failed to create item: ' + error.message });
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
    delete updateData.created_at;
    delete updateData.created_by;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    // Map frontend field names to database column names
    const fieldMapping = {
      'item_name': 'item_name',
      'serial_number': 'serialNumber',
      'condition_status': 'condition'
    };
    
    const mappedData = {};
    for (const [key, value] of Object.entries(updateData)) {
      const dbField = fieldMapping[key] || key;
      mappedData[dbField] = value;
    }
    
    // Build dynamic update query
    const fields = Object.keys(mappedData).map(field => `${field} = ?`).join(', ');
    const values = Object.values(mappedData);
    values.push(new Date(), 1, id); // updatedAt, updated_by, id
    
    const [result] = await pool.execute(`
      UPDATE inventory_items 
      SET ${fields}, updatedAt = ?, updated_by = ?
      WHERE id = ?
    `, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Fetch updated item
    const [updatedItem] = await pool.execute(`
      SELECT * FROM inventory_items WHERE id = ?
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
    const [items] = await pool.execute('SELECT item_name FROM inventory_items WHERE id = ?', [id]);
    
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const itemName = items[0].item_name;
    
    // Delete the item
    await pool.execute('DELETE FROM inventory_items WHERE id = ?', [id]);
    
    console.log(`🗑️ Deleted item: ${itemName} (ID: ${id})`);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// POST /api/inventory/items/:id/checkout - Assign item
router.post('/items/:id/checkout', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const {
      assigned_to_name, 
      department, 
      email, 
      phone,
      assignment_date = new Date().toISOString()
    } = req.body;
    
    if (!assigned_to_name) {
      return res.status(400).json({ error: 'Assigned to name is required' });
    }
    
    // Update item with assignment details
    const [updateResult] = await pool.execute(`
      UPDATE inventory_items 
      SET status = ?, 
          assigned_to = ?, 
          department = ?, 
          assigned_email = ?, 
          assigned_phone = ?,
          assignment_date = ?,
          updatedAt = ? 
      WHERE id = ? AND status = ?
    `, [
      'ASSIGNED', 
      assigned_to_name, 
      department, 
      email, 
      phone,
      assignment_date,
      new Date(), 
      id, 
      'AVAILABLE'
    ]);
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found or not available for assignment' });
    }
    
    // Fetch updated item with assignment details
    const [item] = await pool.execute(`
      SELECT 
        i.*,
        i.assigned_to,
        i.department as assigned_department,
        i.assigned_email,
        i.assigned_phone,
        i.assignment_date
      FROM inventory_items i 
      WHERE i.id = ?
    `, [id]);
    
    console.log(`📤 Assigned item ID: ${id} to ${assigned_to_name} (${department})`);
    res.json(item[0]);
  } catch (error) {
    console.error('Error assigning item:', error);
    res.status(500).json({ error: 'Failed to assign item' });
  }
});

// POST /api/inventory/items/:id/checkin - Check in item
router.post('/items/:id/checkin', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { return_notes, return_condition = 'Good' } = req.body;
    
    // Update item status and condition
    const [updateResult] = await pool.execute(
      'UPDATE inventory_items SET status = ?, `condition` = ?, updatedAt = ? WHERE id = ? AND status = ?',
      ['AVAILABLE', return_condition, new Date(), id, 'ASSIGNED']
    );
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found or not currently assigned' });
    }
    
    // Fetch updated item
    const [item] = await pool.execute(`
      SELECT * FROM inventory_items WHERE id = ?
    `, [id]);
    
    console.log(`📥 Checked in item ID: ${id}, condition: ${return_condition}`);
    res.json(item[0]);
  } catch (error) {
    console.error('Error checking in item:', error);
    res.status(500).json({ error: 'Failed to check in item' });
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