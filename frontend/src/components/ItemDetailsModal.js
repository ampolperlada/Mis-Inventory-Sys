import React, { useState, useEffect } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';

import {
  Inventory2,
  Build,
  AttachMoney,
  Description,
  Warning,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: '#ffffff',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#d1d5db',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    fontWeight: 500,
  },
  '& .MuiOutlinedInput-input': {
    color: '#1f2937',
  },
}));

const SectionHeader = ({ icon: Icon, children, sx }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      color: '#374151',
      fontWeight: 600,
      mb: 3,
      mt: 4,
      gap: 1,
      fontSize: '1.1rem',
      ...sx,
    }}
  >
    <Icon sx={{ fontSize: 20, color: '#6b7280' }} />
    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#374151' }}>
      {children}
    </Typography>
  </Box>
);

const ItemDetailsModal = ({ open, onClose, item, onSave, mode = 'view' }) => {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form data with correct field names
  useEffect(() => {
    if (item) {
      setFormData({
        item_name: item.item_name || '',
        category: item.category || 'Desktop',
        brand: item.brand || '',
        model: item.model || '',
        serial_number: item.serial_number || '',
        status: item.status || 'available',
        hostname: item.hostname || '',
        operating_system: item.operating_system || '',
        processor: item.processor || '',
        ram: item.ram || '',
        storage: item.storage || '',
        purchase_date: item.purchase_date?.split('T')[0] || '',
        deployment_date: item.deployment_date?.split('T')[0] || '',
        warranty_period: item.warranty_period || '',
        location: item.location || '',
        condition_status: item.condition_status || 'good',
        notes: item.notes || '',
        assigned_to: item.assigned_to || '',
        department: item.department || '',
        assigned_email: item.assigned_email || '',
        assigned_phone: item.assigned_phone || '',
        assignment_date: item.assignment_date?.split('T')[0] || '',
      });
    }
  }, [item]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSave = async () => {
    if (!onSave) return;
    if (!formData.item_name?.trim()) {
      alert('Item name is required');
      return;
    }
    if (!formData.serial_number?.trim()) {
      alert('Serial number is required');
      return;
    }

    setLoading(true);
    try {
      await onSave(item.id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (item) {
      setFormData({
        item_name: item.item_name || '',
        category: item.category || 'Desktop',
        brand: item.brand || '',
        model: item.model || '',
        serial_number: item.serial_number || '',
        status: item.status || 'available',
        hostname: item.hostname || '',
        operating_system: item.operating_system || '',
        processor: item.processor || '',
        ram: item.ram || '',
        storage: item.storage || '',
        purchase_date: item.purchase_date?.split('T')[0] || '',
        deployment_date: item.deployment_date?.split('T')[0] || '',
        warranty_period: item.warranty_period || '',
        location: item.location || '',
        condition_status: item.condition_status || 'good',
        notes: item.notes || '',
        assigned_to: item.assigned_to || '',
        department: item.department || '',
        assigned_email: item.assigned_email || '',
        assigned_phone: item.assigned_phone || '',
        assignment_date: item.assignment_date?.split('T')[0] || '',
      });
    }
    setIsEditing(false);
  };

  if (!item || !open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="600">
          Item Details - {item.item_name}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {/* Basic Info */}
          <Grid item xs={12} md={6}>
            <SectionHeader icon={Inventory2}>
              Basic Information
            </SectionHeader>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {isEditing ? (
                <>
                  <StyledTextField
                    fullWidth
                    label="Item Name"
                    value={formData.item_name}
                    onChange={handleChange('item_name')}
                    margin="dense"
                  />
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      label="Category"
                      onChange={handleChange('category')}
                      sx={{ background: '#ffffff', borderRadius: '8px' }}
                    >
                      <MenuItem value="Desktop">Desktop</MenuItem>
                      <MenuItem value="Laptop">Laptop</MenuItem>
                      <MenuItem value="Monitor">Monitor</MenuItem>
                      <MenuItem value="Network Equipment">Network Equipment</MenuItem>
                      <MenuItem value="Mobile Device">Mobile Device</MenuItem>
                      <MenuItem value="Accessories">Accessories</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                  <StyledTextField
                    fullWidth
                    label="Brand"
                    value={formData.brand}
                    onChange={handleChange('brand')}
                    margin="dense"
                  />
                  <StyledTextField
                    fullWidth
                    label="Model"
                    value={formData.model}
                    onChange={handleChange('model')}
                    margin="dense"
                  />
                  <StyledTextField
                    fullWidth
                    label="Serial Number"
                    value={formData.serial_number}
                    onChange={handleChange('serial_number')}
                    margin="dense"
                  />
                  <StyledTextField
                    fullWidth
                    label="Location"
                    value={formData.location}
                    onChange={handleChange('location')}
                    margin="dense"
                  />
                </>
              ) : (
                <>
                  <Typography><strong>Name:</strong> {item.item_name}</Typography>
                  <Typography><strong>Category:</strong> {item.category || 'N/A'}</Typography>
                  <Typography><strong>Brand:</strong> {item.brand || 'N/A'}</Typography>
                  <Typography><strong>Model:</strong> {item.model || 'N/A'}</Typography>
                  <Typography><strong>Serial Number:</strong> {item.serial_number}</Typography>
                  <Typography><strong>Status:</strong> {item.status}</Typography>
                  <Typography><strong>Location:</strong> {item.location || 'N/A'}</Typography>
                </>
              )}
            </Box>
          </Grid>

          {/* Assignment Info */}
          <Grid item xs={12} md={6}>
            <SectionHeader icon={Description}>
              Assignment Information
            </SectionHeader>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography><strong>Assigned To:</strong> {item.assigned_to || 'Not assigned'}</Typography>
              <Typography><strong>Department:</strong> {item.department || 'N/A'}</Typography>
              <Typography><strong>Email:</strong> {item.assigned_email || 'N/A'}</Typography>
              <Typography><strong>Phone:</strong> {item.assigned_phone || 'N/A'}</Typography>
              <Typography><strong>Assignment Date:</strong> {item.assignment_date ? new Date(item.assignment_date).toLocaleDateString() : 'N/A'}</Typography>
            </Box>
          </Grid>

          {/* Purchase & Warranty */}
          <Grid item xs={12} md={6}>
            <SectionHeader icon={AttachMoney}>
              Purchase & Warranty
            </SectionHeader>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {isEditing ? (
                <>
                  <StyledTextField
                    fullWidth
                    label="Purchase Date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={handleChange('purchase_date')}
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                  />
                  <StyledTextField
                    fullWidth
                    label="Warranty Period"
                    value={formData.warranty_period}
                    onChange={handleChange('warranty_period')}
                    margin="dense"
                  />
                  <StyledTextField
                    fullWidth
                    label="Deployment Date"
                    type="date"
                    value={formData.deployment_date}
                    onChange={handleChange('deployment_date')}
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              ) : (
                <>
                  <Typography><strong>Purchase Date:</strong> {item.purchase_date ? new Date(item.purchase_date).toLocaleDateString() : 'N/A'}</Typography>
                  <Typography><strong>Warranty Period:</strong> {item.warranty_period || 'N/A'}</Typography>
                  <Typography><strong>Deployment Date:</strong> {item.deployment_date ? new Date(item.deployment_date).toLocaleDateString() : 'N/A'}</Typography>
                  <Typography><strong>Condition:</strong> {item.condition_status || 'N/A'}</Typography>
                </>
              )}
            </Box>
          </Grid>

          {/* Technical Specs */}
          <Grid item xs={12} md={6}>
            <SectionHeader icon={Build}>
              Technical Specifications
            </SectionHeader>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {isEditing ? (
                <>
                  <StyledTextField
                    fullWidth
                    label="Hostname"
                    value={formData.hostname}
                    onChange={handleChange('hostname')}
                    margin="dense"
                  />
                  <StyledTextField
                    fullWidth
                    label="Operating System"
                    value={formData.operating_system}
                    onChange={handleChange('operating_system')}
                    margin="dense"
                  />
                  <StyledTextField
                    fullWidth
                    label="Processor"
                    value={formData.processor}
                    onChange={handleChange('processor')}
                    margin="dense"
                  />
                  <StyledTextField
                    fullWidth
                    label="RAM"
                    value={formData.ram}
                    onChange={handleChange('ram')}
                    margin="dense"
                  />
                  <StyledTextField
                    fullWidth
                    label="Storage"
                    value={formData.storage}
                    onChange={handleChange('storage')}
                    margin="dense"
                  />
                </>
              ) : (
                <>
                  <Typography><strong>Hostname:</strong> {item.hostname || 'N/A'}</Typography>
                  <Typography><strong>Operating System:</strong> {item.operating_system || 'N/A'}</Typography>
                  <Typography><strong>Processor:</strong> {item.processor || 'N/A'}</Typography>
                  <Typography><strong>RAM:</strong> {item.ram || 'N/A'}</Typography>
                  <Typography><strong>Storage:</strong> {item.storage || 'N/A'}</Typography>
                </>
              )}
            </Box>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <SectionHeader icon={Description}>
              Notes
            </SectionHeader>
            {isEditing ? (
              <StyledTextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={formData.notes}
                onChange={handleChange('notes')}
                margin="dense"
              />
            ) : (
              <Paper sx={{ p: 2, background: '#f8fafc' }}>
                <Typography variant="body2">
                  {item.notes || 'No notes available'}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb', justifyContent: 'space-between' }}>
        <Button onClick={onClose}>CLOSE</Button>
        {isEditing ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              onClick={handleCancel}
              startIcon={<Cancel />}
              sx={{ textTransform: 'uppercase' }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSave}
              disabled={loading}
              startIcon={<Save />}
              sx={{ background: '#10b981', textTransform: 'uppercase' }}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        ) : (
          <Button 
            variant="contained" 
            startIcon={<Edit />}
            onClick={handleEdit}
            sx={{ background: '#3b82f6', textTransform: 'uppercase' }}
          >
            EDIT ITEM
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ItemDetailsModal;