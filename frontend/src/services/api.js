// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

class InventoryAPI {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Dashboard Stats
  static async getDashboardStats() {
    return await this.request('/dashboard/stats');
  }

  // Items CRUD
  static async getAllItems(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await this.request(`/inventory/items${params ? `?${params}` : ''}`);
  }

  static async getItem(id) {
    return await this.request(`/inventory/items/${id}`);
  }

  static async createItem(itemData) {
    return await this.request('/inventory/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  static async updateItem(id, itemData) {
    return await this.request(`/inventory/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  static async deleteItem(id) {
    return await this.request(`/inventory/items/${id}`, {
      method: 'DELETE',
    });
  }

  // Check-out/Check-in
  static async checkOutItem(id, assignmentData) {
    return await this.request(`/inventory/items/${id}/checkout`, {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  static async checkInItem(id, returnData) {
    return await this.request(`/inventory/items/${id}/checkin`, {
      method: 'POST',
      body: JSON.stringify(returnData),
    });
  }

  // Categories
  static async getCategories() {
    return await this.request('/inventory/categories');
  }
}

export default InventoryAPI;

// frontend/src/hooks/useInventory.js
import { useState, useEffect, useCallback } from 'react';
import InventoryAPI from '../services/api';

export const useInventoryItems = (filters = {}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InventoryAPI.getAllItems(filters);
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (itemData) => {
    try {
      const newItem = await InventoryAPI.createItem(itemData);
      setItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      const updatedItem = await InventoryAPI.updateItem(id, itemData);
      setItems(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ));
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await InventoryAPI.deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const checkOutItem = async (id, assignmentData) => {
    try {
      const updatedItem = await InventoryAPI.checkOutItem(id, assignmentData);
      setItems(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ));
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const checkInItem = async (id, returnData) => {
    try {
      const updatedItem = await InventoryAPI.checkInItem(id, returnData);
      setItems(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ));
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    checkOutItem,
    checkInItem,
    refetchItems: fetchItems
  };
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    available: 0,
    assigned: 0,
    maintenance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await InventoryAPI.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};