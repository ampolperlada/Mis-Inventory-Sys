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

// Styled Components
const ModernContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  minHeight: '100vh',
  padding: theme.spacing(3),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
  }
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden',
}));

const SectionHeader = styled(Box)(({ theme, color = '#667eea' }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(4),
  '&:first-of-type': {
    marginTop: 0,
  },
  '& .section-icon': {
    background: `linear-gradient(135deg, ${color} 0%, ${color}aa 100%)`,
    color: 'white',
    borderRadius: '12px',
    padding: '12px',
    marginRight: theme.spacing(2),
    boxShadow: `0 4px 12px ${color}33`,
  },
  '& .section-title': {
    fontWeight: '700',
    fontSize: '1.25rem',
    color: '#1f2937',
    letterSpacing: '-0.025em',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(102, 126, 234, 0.2)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(102, 126, 234, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    fontWeight: '600',
    '&.Mui-focused': {
      color: '#667eea',
    },
  },
}));

const StyledSelect = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(102, 126, 234, 0.2)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(102, 126, 234, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    fontWeight: '600',
    '&.Mui-focused': {
      color: '#667eea',
    },
  },
}));

const ActionButton = styled(Button)(({ variant, theme }) => ({
  borderRadius: '12px',
  padding: '14px 28px',
  fontSize: '16px',
  fontWeight: '600',
  textTransform: 'none',
  minWidth: '140px',
  transition: 'all 0.3s ease',
  ...(variant === 'contained' ? {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 20px rgba(102, 126, 234, 0.4)',
    },
  } : {
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#667eea',
    border: '2px solid rgba(102, 126, 234, 0.3)',
    '&:hover': {
      background: 'rgba(102, 126, 234, 0.1)',
      borderColor: '#667eea',
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
  'Printers',
  'Software',
  'Other',
];

const statuses = [
  { value: 'available', label: 'Available' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'retired', label: 'Retired' },
];

const conditions = [
  { value: 'new', label: 'New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

const AddItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    serialNumber: '',
    category: '',
    hostname: '',
    operatingSystem: '',
    processor: '',
    ram: '',
    storage: '',
    status: 'available',
    condition: 'new',
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
    
    // Clear error when user starts typing
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

    if (formData.purchasePrice && isNaN(formData.purchasePrice)) {
      newErrors.purchasePrice = 'Purchase price must be a number';
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
      // Here you would integrate with your backend API
      console.log('Adding item:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

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
        category: '',
        hostname: '',
        operatingSystem: '',
        processor: '',
        ram: '',
        storage: '',
        status: 'available',
        condition: 'new',
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
        message: 'Error adding item. Please try again.',
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

  const AddItemForm = () => (
    <ModernContainer>
      <GlassCard sx={{ maxWidth: '1000px', mx: 'auto', p: 6 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ 
            display: 'inline-flex', 
            p: 3,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            mb: 3,
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
          }}>
            <AddIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h3" sx={{ 
            fontWeight: '800', 
            color: '#1f2937', 
            mb: 2,
            letterSpacing: '-0.05em'
          }}>
            Add New Item
          </Typography>
          <Typography variant="h6" sx={{ color: '#6b7280', maxWidth: '500px', mx: 'auto' }}>
            Enter the details for the new inventory item
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <SectionHeader color="#667eea">
            <Box className="section-icon">
              <Inventory2 sx={{ fontSize: 24 }} />
            </Box>
            <Typography className="section-title">Basic Information</Typography>
          </SectionHeader>

          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} md={8}>
              <StyledTextField
                fullWidth
                label="Item Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="e.g., MacBook Pro 14-inch"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledSelect fullWidth error={!!errors.category}>
                <InputLabel>Category *</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category *"
                  onChange={handleChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </StyledSelect>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g., Apple, Dell, HP"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g., MBP14-2023"
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
                placeholder="e.g., SN123456789"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: 'rgba(102, 126, 234, 0.1)' }} />

          {/* Technical Specifications */}
          <SectionHeader color="#10b981">
            <Box className="section-icon">
              <Build sx={{ fontSize: 24 }} />
            </Box>
            <Typography className="section-title">Technical Specifications</Typography>
          </SectionHeader>

          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Hostname"
                name="hostname"
                value={formData.hostname}
                onChange={handleChange}
                placeholder="e.g., DESK-001"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Operating System"
                name="operatingSystem"
                value={formData.operatingSystem}
                onChange={handleChange}
                placeholder="e.g., Windows 11, macOS"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Processor"
                name="processor"
                value={formData.processor}
                onChange={handleChange}
                placeholder="e.g., Intel i7, M2 Pro"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="RAM"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                placeholder="e.g., 16GB, 32GB"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Storage"
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                placeholder="e.g., 512GB SSD, 1TB"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: 'rgba(102, 126, 234, 0.1)' }} />

          {/* Purchase & Status Information */}
          <SectionHeader color="#f59e0b">
            <Box className="section-icon">
              <AttachMoney sx={{ fontSize: 24 }} />
            </Box>
            <Typography className="section-title">Purchase & Status</Typography>
          </SectionHeader>

          <Grid container spacing={3} sx={{ mb: 2 }}>
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
                placeholder="e.g., 3 years"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Purchase Price"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={handleChange}
                error={!!errors.purchasePrice}
                helperText={errors.purchasePrice}
                placeholder="0.00"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledSelect fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleChange}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </StyledSelect>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledSelect fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  name="condition"
                  value={formData.condition}
                  label="Condition"
                  onChange={handleChange}
                >
                  {conditions.map((condition) => (
                    <MenuItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </MenuItem>
                  ))}
                </Select>
              </StyledSelect>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: 'rgba(102, 126, 234, 0.1)' }} />

          {/* Additional Information */}
          <SectionHeader color="#8b5cf6">
            <Box className="section-icon">
              <Description sx={{ fontSize: 24 }} />
            </Box>
            <Typography className="section-title">Additional Information</Typography>
          </SectionHeader>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., IT Storage, Office Floor 2"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description..."
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Any additional notes or comments..."
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            justifyContent: 'center', 
            pt: 4,
            borderTop: '1px solid rgba(102, 126, 234, 0.1)'
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
      </GlassCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ModernContainer>
  );

  return <Dashboard>{<AddItemForm />}</Dashboard>;
};

export default AddItem;