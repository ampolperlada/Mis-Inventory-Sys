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
import EditIcon from '@mui/icons-material/Edit';

const ItemDetailsModal = ({ open, onClose, item }) => {
  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ 
        fontWeight: '600', 
        fontSize: '1.25rem',
        color: '#1e293b',
        borderBottom: '1px solid #e5e7eb',
        pb: 2
      }}>
        Item Details - {item.item_name}
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {/* Tab-like headers */}
        <Box sx={{ 
          display: 'flex', 
          borderBottom: '2px solid #e5e7eb',
          background: '#f9fafb'
        }}>
          <Box sx={{
            flex: 1,
            textAlign: 'left',
            py: 2,
            px: 3,
            fontWeight: '600',
            color: '#374151',
            fontSize: '1rem'
          }}>
            Basic Information
          </Box>
          <Box sx={{
            flex: 1,
            textAlign: 'left',
            py: 2,
            px: 3,
            fontWeight: '600',
            color: '#374151',
            fontSize: '1rem'
          }}>
            Assignment Information
          </Box>
          <Box sx={{
            flex: 1,
            textAlign: 'left',
            py: 2,
            px: 3,
            fontWeight: '600',
            color: '#374151',
            fontSize: '1rem'
          }}>
            Purchase & Warranty
          </Box>
          <Box sx={{
            flex: 1,
            textAlign: 'left',
            py: 2,
            px: 3,
            fontWeight: '600',
            color: '#374151',
            fontSize: '1rem'
          }}>
            Notes
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Basic Information */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Name:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>{item.item_name}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Category:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>{item.category || 'OTHER'}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Brand:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>{item.brand || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Model:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>{item.model || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Serial Number:</Typography>
                  <Typography sx={{ color: '#6b7280', fontFamily: 'monospace' }}>
                    {item.serial_number}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Status:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>{item.status || 'available'}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Location:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>{item.location || 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Assignment Information */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Assigned To:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    {item.assigned_to_name || item.assigned_to || 'Not assigned'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Department:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    {item.department || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Email:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    {item.email || item.assigned_email || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Phone:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    {item.phone || item.assigned_phone || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Assignment Date:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    {item.assignment_date ? 
                      new Date(item.assignment_date).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Purchase & Warranty */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Purchase Date:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    {item.purchase_date ? 
                      new Date(item.purchase_date).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Warranty Period:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    {item.warranty_period || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Deployment Date:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    {item.deployment_date ? 
                      new Date(item.deployment_date).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Condition:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    {item.condition_status || item.condition || 'good'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '600', color: '#374151', mb: 0.5 }}>Created:</Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    {item.created_at ? 
                      new Date(item.created_at).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Notes */}
            <Grid item xs={12} md={3}>
              <Box sx={{ 
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                p: 2,
                minHeight: '200px'
              }}>
                <Typography sx={{ 
                  color: item.notes ? '#374151' : '#9ca3af',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  fontStyle: item.notes ? 'normal' : 'italic'
                }}>
                  {item.notes || 'No notes available'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 3, 
        borderTop: '1px solid #e5e7eb',
        justifyContent: 'space-between'
      }}>
        <Button onClick={onClose} sx={{ color: '#3b82f6', textTransform: 'uppercase' }}>
          CLOSE
        </Button>
        <Button 
          variant="contained" 
          startIcon={<EditIcon />}
          sx={{ 
            background: '#3b82f6', 
            textTransform: 'uppercase',
            '&:hover': {
              background: '#2563eb'
            }
          }}
        >
          EDIT ITEM
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDetailsModal;