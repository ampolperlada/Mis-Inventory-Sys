import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Paper,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Inventory2,
  Build,
  AttachMoney,
  Description,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import { useInventoryItems } from '../hooks/useInventory'; // Import your hook

// Clean, modern styled components
const ModernContainer = styled(Box)(({ theme }) => ({
  background: '#f8fafc',
  minHeight: '100vh',
  padding: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e2e8f0',
  overflow: 'hidden',
}));

const SectionHeader = styled(Box)(({ theme, color = '#3b82f6' }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(4),
  '&:first-of-type': {
    marginTop: 0,
  },
  '& .section-icon': {
    background: color,
    color: 'white',
    borderRadius: '8px',
    padding: '10px',
    marginRight: theme.spacing(2),
    boxShadow: `0 2px 8px ${color}33`,
  },
  '& .section-title': {
    fontWeight: '600',
    fontSize: '1.125rem',
    color: '#1e293b',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: '#f8fafc',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#cbd5e1',
    },
    '&:hover fieldset': {
      borderColor: '#94a3b8',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
    },
    '& .MuiOutlinedInput-input': {
      padding: '12px 14px',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    color: '#64748b',
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
  }
}));

const ActionButton = styled(Button)(({ variant }) => ({
  borderRadius: '8px',
  padding: '12px 24px',
  fontWeight: '600',
  textTransform: 'none',
  ...(variant === 'contained' ? {
    background: '#3b82f6',
    '&:hover': {
      background: '#2563eb',
    },
    '&:disabled': {
      background: '#d1d5db',
    },
  } : {
    borderColor: '#cbd5e1',
    color: '#64748b',
    '&:hover': {
      borderColor: '#3b82f6',
      color: '#3b82f6',
    },
    '&:disabled': {
      borderColor: '#d1d5db',
      color: '#9ca3af',
    },
  }),
}));

const categories = [
  'Desktop',
  'Laptop',
  'Monitor', 
  'Network Equipment',
  'Mobile Device',
  'Accessories',
  'Other',
];

const statuses = [
  { value: 'available', label: 'Available' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'retired', label: 'Retired' },
];

const conditions = [
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

const AddItem = () => {
  const navigate = useNavigate();
  const { addItem } = useInventoryItems(); // Use your inventory hook
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    serialNumber: '',
    category: 'Desktop',
    hostname: '',
    operatingSystem: '',
    processor: '',
    ram: '',
    storage: '',
    status: 'available',
    condition: 'good',
    purchaseDate: '',
    purchasePrice: '',
    warrantyPeriod: '',
    deploymentDate: '',
    location: '',
    description: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for your backend API format
      const itemData = {
        item_name: formData.name.trim(),
        serial_number: formData.serialNumber.trim(),
        brand: formData.brand?.trim() || null,
        model: formData.model?.trim() || null,
        category: formData.category,
        hostname: formData.hostname?.trim() || null,
        operating_system: formData.operatingSystem?.trim() || null,
        processor: formData.processor?.trim() || null,
        ram: formData.ram?.trim() || null,
        storage: formData.storage?.trim() || null,
        purchase_date: formData.purchaseDate || null,
        warranty_period: formData.warrantyPeriod?.trim() || null,
        deployment_date: formData.deploymentDate || null,
        location: formData.location?.trim() || null,
        status: formData.status,
        condition_status: formData.condition,
        quantity: 1,
        notes: formData.notes?.trim() || null,
      };

      // Use your addItem function from the hook
      await addItem(itemData);

      setSnackbar({
        open: true,
        message: 'Item added successfully!',
        severity: 'success',
      });

      // Clear form
      setFormData({
        name: '',
        brand: '',
        model: '',
        serialNumber: '',
        category: 'Desktop',
        hostname: '',
        operatingSystem: '',
        processor: '',
        ram: '',
        storage: '',
        status: 'available',
        condition: 'good',
        purchaseDate: '',
        purchasePrice: '',
        warrantyPeriod: '',
        deploymentDate: '',
        location: '',
        description: '',
        notes: '',
      });

      // Navigate back after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error adding item: ' + (error.message || 'Please try again'),
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Dashboard>
      <ModernContainer>
        <StyledPaper sx={{ maxWidth: '1000px', mx: 'auto', p: 6 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ 
              display: 'inline-flex', 
              p: 2,
              borderRadius: '12px',
              background: '#3b82f6',
              mb: 3,
            }}>
              <AddIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Typography variant="h4" sx={{ 
              fontWeight: '700', 
              color: '#1e293b', 
              mb: 2,
            }}>
              Add New Item
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Enter the details for the new inventory item
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <SectionHeader color="#3b82f6">
              <Box className="section-icon">
                <Inventory2 sx={{ fontSize: 20 }} />
              </Box>
              <Typography className="section-title">Basic Information</Typography>
            </SectionHeader>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Item Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category *"
                    onChange={handleChange}
                    sx={{ background: '#f8fafc', borderRadius: '8px' }}
                    required
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  fullWidth
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  fullWidth
                  label="Model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  fullWidth
                  label="Serial Number *"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  error={!!errors.serialNumber}
                  helperText={errors.serialNumber}
                  required
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Technical Specifications */}
            <SectionHeader color="#10b981">
              <Box className="section-icon">
                <Build sx={{ fontSize: 20 }} />
              </Box>
              <Typography className="section-title">Technical Specifications</Typography>
            </SectionHeader>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Hostname"
                  name="hostname"
                  value={formData.hostname}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Operating System"
                  name="operatingSystem"
                  value={formData.operatingSystem}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  fullWidth
                  label="Processor"
                  name="processor"
                  value={formData.processor}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  fullWidth
                  label="RAM"
                  name="ram"
                  value={formData.ram}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  fullWidth
                  label="Storage"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Dates & Status */}
            <SectionHeader color="#f59e0b">
              <Box className="section-icon">
                <AttachMoney sx={{ fontSize: 20 }} />
              </Box>
              <Typography className="section-title">Dates & Status</Typography>
            </SectionHeader>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  fullWidth
                  label="Purchase Date"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  fullWidth
                  label="Deployment Date"
                  name="deploymentDate"
                  type="date"
                  value={formData.deploymentDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  fullWidth
                  label="Warranty Period"
                  name="warrantyPeriod"
                  value={formData.warrantyPeriod}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    name="condition"
                    value={formData.condition}
                    label="Condition"
                    onChange={handleChange}
                    sx={{ background: '#f8fafc', borderRadius: '8px' }}
                  >
                    {conditions.map((condition) => (
                      <MenuItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Notes */}
            <SectionHeader color="#8b5cf6">
              <Box className="section-icon">
                <Description sx={{ fontSize: 20 }} />
              </Box>
              <Typography className="section-title">Additional Information</Typography>
            </SectionHeader>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Any additional notes or comments..."
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'center', 
              pt: 4,
              borderTop: '1px solid #e2e8f0'
            }}>
              <ActionButton
                variant="outlined"
                onClick={handleCancel}
                startIcon={<CancelIcon />}
                disabled={loading}
              >
                Cancel
              </ActionButton>
              <ActionButton
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Adding Item...' : 'Add Item'}
              </ActionButton>
            </Box>
          </Box>
        </StyledPaper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </ModernContainer>
    </Dashboard>
  );
};

export default AddItem;