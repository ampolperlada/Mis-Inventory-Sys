
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