const express = require('express');
const router = express.Router();
const { getPool } = require('../config/database');

// GET /api/inventory/stats - Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const pool = getPool();
    
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalItems,
        SUM(CASE WHEN status = 'AVAILABLE' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN status = 'ASSIGNED' THEN 1 ELSE 0 END) as assigned,
        SUM(CASE WHEN status = 'MAINTENANCE' THEN 1 ELSE 0 END) as maintenance
      FROM inventory_items
    `);
    
    res.json(stats[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// POST /api/inventory/items - Add new item
router.post('/items', async (req, res) => {
  try {
    const pool = getPool();
    const {
      item_name,
      serial_number,
      brand,
      model,
      category,
      operating_system,
      processor,
      ram,
      storage,
      location,
      status,
      condition_status,
      quantity,
      notes
    } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO inventory_items (
        item_name, serialNumber, brand, model, category, 
        specs, \`condition\`, status, location, 
        quantity, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      item_name,
      serial_number,
      brand,
      model,
      category || 'OTHER',
      `OS: ${operating_system || 'N/A'}, CPU: ${processor || 'N/A'}, RAM: ${ram || 'N/A'}, Storage: ${storage || 'N/A'}`,
      condition_status || 'Good',
      status || 'AVAILABLE',
      location,
      quantity || 1,
      notes
    ]);

    res.status(201).json({ 
      success: true, 
      id: result.insertId,
      message: 'Item added successfully' 
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ 
      error: 'Failed to add item',
      message: error.message 
    });
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
        i.serialNumber as serial_number,
        i.category,
        i.status,
        i.\`condition\` as condition_status,
        i.location,
        i.quantity,
        i.notes,
        i.assigned_to,
        i.assigned_email,
        i.assigned_phone,
        i.assignment_date,
        i.department,
        i.createdAt as created_at,
        i.updatedAt as updated_at
      FROM inventory_items i
      WHERE 1=1
    `;
    
    const params = [];
    
    if (status) {
      query += ' AND i.status = ?';
      params.push(status.toUpperCase());
    }
    
    if (category) {
      query += ' AND i.category = ?';
      params.push(category.toUpperCase());
    }
    
    if (search) {
      query += ' AND (i.item_name LIKE ? OR i.brand LIKE ? OR i.model LIKE ? OR i.serialNumber LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY i.createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const [items] = await pool.execute(query, params);
    
    const mappedItems = items.map(item => ({
      id: item.id,
      item_name: item.item_name,
      brand: item.brand,
      model: item.model,
      serial_number: item.serial_number,
      category: item.category,
      status: item.status ? item.status.toLowerCase() : 'available',
      condition_status: item.condition_status,
      location: item.location,
      quantity: item.quantity,
      notes: item.notes,
      assigned_to: item.assigned_to || null,
      department: item.department || null,
      assigned_email: item.assigned_email || null,
      assigned_phone: item.assigned_phone || null,
      assignment_date: item.assignment_date || null,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
    
    let countQuery = `SELECT COUNT(*) as total FROM inventory_items i WHERE 1=1`;
    const countParams = [];
    
    if (status) {
      countQuery += ' AND i.status = ?';
      countParams.push(status.toUpperCase());
    }
    
    if (category) {
      countQuery += ' AND i.category = ?';
      countParams.push(category.toUpperCase());
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
        i.\`condition\`,
        i.location,
        i.quantity,
        i.notes,
        i.assigned_to,
        i.assigned_email,
        i.assigned_phone,
        i.assignment_date,
        i.department,
        i.createdAt,
        i.updatedAt
      FROM inventory_items i
      WHERE i.id = ?
    `, [id]);
    
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
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
      assigned_to: item.assigned_to || null,
      assigned_email: item.assigned_email || null,
      assigned_phone: item.assigned_phone || null,
      assignment_date: item.assignment_date || null,
      department: item.department || null,
      created_at: item.createdAt,
      updated_at: item.updatedAt
    };
    
    res.json(mappedItem);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST /api/inventory/items/:id/checkin - Receive item back
router.post('/items/:id/checkin', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { return_condition, return_notes } = req.body;

    const [result] = await pool.execute(`
      UPDATE inventory_items 
      SET status = 'AVAILABLE',
          \`condition\` = ?,
          assigned_to = NULL,
          assigned_email = NULL,
          assigned_phone = NULL,
          department = NULL,
          assignment_date = NULL,
          notes = CONCAT(COALESCE(notes, ''), '\nReturned: ', COALESCE(?, '')),
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [return_condition || 'Good', return_notes || '', id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ 
      success: true, 
      message: 'Item checked in successfully' 
    });
  } catch (error) {
    console.error('Error checking in item:', error);
    res.status(500).json({ 
      error: 'Failed to check in item',
      message: error.message 
    });
  }
});

// POST /api/inventory/items/:id/checkout - Assign item
router.post('/items/:id/checkout', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { assigned_to_name, department, email, phone } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE inventory_items 
      SET status = 'ASSIGNED',
          assigned_to = ?,
          department = ?,
          assigned_email = ?,
          assigned_phone = ?,
          assignment_date = CURRENT_TIMESTAMP,
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'AVAILABLE'
    `, [assigned_to_name, department, email, phone, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found or not available' });
    }
    
    res.json({ success: true, message: 'Item assigned successfully' });
  } catch (error) {
    console.error('Error assigning item:', error);
    res.status(500).json({ error: 'Failed to assign item' });
  }
});

// PUT /api/inventory/items/:id - Update item
router.put('/items/:id', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const updateData = req.body;
    
    const fieldMap = {
      'serial_number': 'serialNumber',
      'condition_status': '`condition`',
      'item_name': 'item_name',
      'brand': 'brand',
      'model': 'model',
      'category': 'category',
      'status': 'status',
      'location': 'location',
      'notes': 'notes',
      'assigned_to': 'assigned_to',
      'department': 'department',
      'assigned_email': 'assigned_email',
      'assigned_phone': 'assigned_phone'
    };
    
    const updateFields = [];
    const values = [];
    
    Object.keys(updateData).forEach(key => {
      const dbField = fieldMap[key] || key;
      updateFields.push(`${dbField} = ?`);
      values.push(updateData[key]);
    });
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    values.push(id);
    
    const [result] = await pool.execute(
      `UPDATE inventory_items SET ${updateFields.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ success: true, message: 'Item updated successfully' });
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
    
    const [result] = await pool.execute(
      'DELETE FROM inventory_items WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// PUT /api/inventory/items/:id/dispose - Dispose item
router.put('/items/:id/dispose', async (req, res) => {
  try {
    const { id } = req.params;
    const { disposal_reason, disposed_by } = req.body;
    
    const pool = getPool();
    
    const [result] = await pool.execute(
      `UPDATE inventory_items 
       SET status = 'retired', 
           disposal_reason = ?, 
           disposal_date = NOW(), 
           disposed_by = ?
       WHERE id = ?`,
      [disposal_reason, disposed_by || 'System', id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Item moved to disposal successfully' 
    });
  } catch (error) {
    console.error('Error moving item to disposal:', error);
    res.status(500).json({ 
      error: 'Failed to move item to disposal',
      message: error.message 
    });
  }
});

// GET /api/inventory/disposal - Get disposal items
router.get('/disposal', async (req, res) => {
  try {
    const pool = getPool();
    
    const [rows] = await pool.execute(
      `SELECT * FROM inventory_items 
       WHERE status = 'retired' 
       ORDER BY disposal_date DESC`
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching disposal items:', error);
    res.status(500).json({ 
      error: 'Failed to fetch disposal items',
      message: error.message 
    });
  }
});

module.exports = router;