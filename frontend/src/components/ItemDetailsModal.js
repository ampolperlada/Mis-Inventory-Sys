// src/components/ItemDetailsModal.js
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
} from '@mui/material';
import {
  Inventory2,
  Build,
  AttachMoney,
  Description,
} from '@mui/icons-material';

const ItemDetailsModal = ({ open, onClose, item }) => {
  // If no item or dialog closed, don't render
  if (!item || !open) return null;

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      {/* Fixed: Removed nested h6 inside h2 */}
      <DialogTitle>
        <Typography variant="h6" fontWeight="600" color="text.primary">
          Item Details - {item.item_name}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Inventory2 fontSize="small" color="primary" />
              <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                Basic Information
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography><strong>Name:</strong> {item.item_name}</Typography>
              <Typography><strong>Category:</strong> {item.category || 'N/A'}</Typography>
              <Typography><strong>Brand:</strong> {item.brand || 'N/A'}</Typography>
              <Typography><strong>Model:</strong> {item.model || 'N/A'}</Typography>
              <Typography><strong>Serial Number:</strong> {item.serial_number}</Typography>
              <Typography><strong>Status:</strong> {item.status}</Typography>
              <Typography><strong>Location:</strong> {item.location || 'N/A'}</Typography>
            </Box>
          </Grid>

          {/* Assignment Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Description fontSize="small" color="primary" />
              <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                Assignment Information
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography><strong>Assigned To:</strong> {item.assigned_to || 'Not assigned'}</Typography>
              <Typography><strong>Department:</strong> {item.department || 'N/A'}</Typography>
              <Typography><strong>Email:</strong> {item.assigned_email || 'N/A'}</Typography>
              <Typography><strong>Phone:</strong> {item.assigned_phone || 'N/A'}</Typography>
              <Typography><strong>Assignment Date:</strong> {formatDate(item.assignment_date)}</Typography>
            </Box>
          </Grid>

          {/* Purchase & Warranty */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AttachMoney fontSize="small" color="primary" />
              <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                Purchase & Warranty
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography><strong>Purchase Date:</strong> {formatDate(item.purchase_date)}</Typography>
              <Typography><strong>Warranty Period:</strong> {item.warranty_period || 'N/A'}</Typography>
              <Typography><strong>Deployment Date:</strong> {formatDate(item.deployment_date)}</Typography>
              <Typography><strong>Condition:</strong> {item.condition_status || 'N/A'}</Typography>
              <Typography><strong>Created:</strong> {formatDate(item.created_at)}</Typography>
            </Box>
          </Grid>

          {/* Technical Specifications */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Build fontSize="small" color="primary" />
              <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                Technical Specifications
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography><strong>Hostname:</strong> {item.hostname || 'N/A'}</Typography>
              <Typography><strong>Operating System:</strong> {item.operating_system || 'N/A'}</Typography>
              <Typography><strong>Processor:</strong> {item.processor || 'N/A'}</Typography>
              <Typography><strong>RAM:</strong> {item.ram || 'N/A'}</Typography>
              <Typography><strong>Storage:</strong> {item.storage || 'N/A'}</Typography>
            </Box>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="600" color="text.primary" mb={2}>
              Notes
            </Typography>
            <Box
              sx={{
                p: 2,
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: '#f9fafb',
              }}
            >
              <Typography variant="body2">
                {item.notes || 'No notes available'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDetailsModal;