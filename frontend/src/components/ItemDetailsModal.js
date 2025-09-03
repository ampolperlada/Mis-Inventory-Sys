// src/components/ItemDetailsModal.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ItemDetailsModal = ({ open, onClose, item }) => {
  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VisibilityIcon />
          Item Details
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Basic Info */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" color="primary" gutterBottom>
              Basic Information
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography><strong>Name:</strong> {item.item_name}</Typography>
              <Typography><strong>Brand:</strong> {item.brand}</Typography>
              <Typography><strong>Model:</strong> {item.model}</Typography>
              <Typography><strong>Serial Number:</strong> {item.serial_number}</Typography>
              <Typography><strong>Status:</strong> {item.status}</Typography>
              <Typography><strong>Category:</strong> {item.category}</Typography>
              <Typography><strong>Location:</strong> {item.location}</Typography>
            </Box>
          </Grid>

          {/* Technical Details */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" color="primary" gutterBottom>
              Technical Specifications
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography><strong>Hostname:</strong> {item.hostname || 'N/A'}</Typography>
              <Typography><strong>OS:</strong> {item.operating_system || 'N/A'}</Typography>
              <Typography><strong>Processor:</strong> {item.processor || 'N/A'}</Typography>
              <Typography><strong>RAM:</strong> {item.ram || 'N/A'}</Typography>
              <Typography><strong>Storage:</strong> {item.storage || 'N/A'}</Typography>
              <Typography><strong>Purchase Date:</strong> {item.purchase_date || 'N/A'}</Typography>
              <Typography><strong>Warranty:</strong> {item.warranty_period || 'N/A'}</Typography>
              <Typography><strong>Deployment Date:</strong> {item.deployment_date || 'N/A'}</Typography>
              <Typography><strong>Notes:</strong> {item.notes || 'N/A'}</Typography>
            </Box>
          </Grid>

          {/* Assignment Info */}
          {item.assigned_to_name && (
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Assignment Information
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography><strong>Assigned To:</strong> {item.assigned_to_name}</Typography>
                <Typography><strong>Department:</strong> {item.department}</Typography>
                <Typography><strong>Email:</strong> {item.email}</Typography>
                <Typography><strong>Phone:</strong> {item.phone}</Typography>
                <Typography><strong>Assignment Date:</strong> {item.assignment_date}</Typography>
                <Typography><strong>Expected Return:</strong> {item.expected_return_date}</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDetailsModal;