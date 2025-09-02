// frontend/src/hooks/useInventory.js
import { useState, useEffect } from 'react';
import axios from 'axios';

// Set up axios base URL
const API_BASE_URL = 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Custom hook for inventory items
export const useInventoryItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all items
  const fetchItems = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const response = await api.get(`/inventory/items?${params.toString()}`);
      setItems(response.data.items || []);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.response?.data?.error || 'Failed to fetch items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add new item
  const addItem = async (itemData) => {
    try {
      setError(null);
      const response = await api.post('/inventory/items', itemData);
      
      // Refresh items after adding
      await fetchItems();
      
      return response.data;
    } catch (err) {
      console.error('Error adding item:', err);
      const errorMessage = err.response?.data?.error || 'Failed to add item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update item
  const updateItem = async (id, updateData) => {
    try {
      setError(null);
      const response = await api.put(`/inventory/items/${id}`, updateData);
      
      // Update local state
      setItems(prev => prev.map(item => 
        item.id === id ? response.data : item
      ));
      
      return response.data;
    } catch (err) {
      console.error('Error updating item:', err);
      const errorMessage = err.response?.data?.error || 'Failed to update item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    try {
      setError(null);
      await api.delete(`/inventory/items/${id}`);
      
      // Remove from local state
      setItems(prev => prev.filter(item => item.id !== id));
      
      return true;
    } catch (err) {
      console.error('Error deleting item:', err);
      const errorMessage = err.response?.data?.error || 'Failed to delete item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Check out item
  const checkOutItem = async (id, assignmentData) => {
    try {
      setError(null);
      const response = await api.post(`/inventory/items/${id}/checkout`, {
        assigned_to_name: assignmentData.assignedTo,
        department: assignmentData.department,
        assignment_date: new Date().toISOString(),
      });
      
      // Update local state
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'assigned' } : item
      ));
      
      return response.data;
    } catch (err) {
      console.error('Error checking out item:', err);
      const errorMessage = err.response?.data?.error || 'Failed to check out item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Check in item
  const checkInItem = async (id, returnData) => {
    try {
      setError(null);
      const response = await api.post(`/inventory/items/${id}/checkin`, {
        return_condition: returnData.condition,
        return_notes: returnData.notes,
      });
      
      // Update local state
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'available' } : item
      ));
      
      return response.data;
    } catch (err) {
      console.error('Error checking in item:', err);
      const errorMessage = err.response?.data?.error || 'Failed to check in item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Get single item
  const getItem = async (id) => {
    try {
      setError(null);
      const response = await api.get(`/inventory/items/${id}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching item:', err);
      const errorMessage = err.response?.data?.error || 'Failed to fetch item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    checkOutItem,
    checkInItem,
    getItem,
    refetch: fetchItems,
  };
};

// Custom hook for dashboard statistics
export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    available: 0,
    assigned: 0,
    maintenance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/inventory/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.response?.data?.error || 'Failed to fetch statistics');
      // Set default stats on error
      setStats({
        totalItems: 0,
        available: 0,
        assigned: 0,
        maintenance: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

// Custom hook for categories
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/inventory/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.error || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};