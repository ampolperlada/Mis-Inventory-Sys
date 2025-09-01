// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const { getPool } = require('../config/database');

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const pool = getPool();
    
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalItems,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN status = 'assigned' THEN 1 ELSE 0 END) as assigned,
        SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
        SUM(CASE WHEN status = 'retired' THEN 1 ELSE 0 END) as retired
      FROM inventory_items
    `);
    
    const [categoryStats] = await pool.execute(`
      SELECT c.name, COUNT(i.id) as count
      FROM categories c
      LEFT JOIN inventory_items i ON c.id = i.category_id
      GROUP BY c.id, c.name
      ORDER BY count DESC
    `);
    
    const [recentActivity] = await pool.execute(`
      SELECT al.*, i.item_name, u.full_name as user_name
      FROM activity_logs al
      LEFT JOIN inventory_items i ON al.item_id = i.id
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 10
    `);
    
    res.json({
      ...stats[0],
      categoryBreakdown: categoryStats,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

module.exports = router;