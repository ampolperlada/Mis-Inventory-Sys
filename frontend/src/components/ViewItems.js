import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Chip,
  IconButton,
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Assignment as AssignIcon,
  Laptop,
  Monitor,
  Phone,
  Chair,
  Keyboard
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

// Styled components
const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  background: 'rgba(26, 26, 46, 0.9)', // Darker background instead of white
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  '& .MuiTableHead-root': {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)',
  },
  '& .MuiTableCell-head': {
    fontWeight: '600',
    color: 'white', // White text for headers
    borderBottom: '2px solid rgba(139, 92, 246, 0.3)',
  },
  '& .MuiTableCell-body': {
    color: 'white', // White text for body cells
    borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
  },
  '& .MuiTableRow-root:hover': {
    background: 'rgba(139, 92, 246, 0.1)',
  },
}));

const ModernButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: '600',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
  },
}));

const StatusChip = styled(Chip)(({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'available':
        return {
          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          color: 'white',
        };
      case 'assigned':
        return {
          background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
          color: 'white',
        };
      case 'maintenance':
        return {
          background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
          color: 'white',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
          color: 'white',
        };
    }
  };

  return {
    ...getStatusStyles(status),
    borderRadius: '8px',
    fontWeight: '600',
    border: 'none',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  };
});

// Empty data - will be populated from backend API
const mockItems = [];

const categories = ['all', 'Desktop', 'Laptop', 'Monitor', 'Network Equipment', 'Mobile Device', 'Accessories'];
const departments = ['all', 'IT', 'Design', 'Sales', 'Marketing', 'Finance', 'HR'];

const categoryIcons = {
  'Desktop': Laptop,
  'Laptop': Laptop,
  'Monitor': Monitor,
  'Network Equipment': Keyboard,
  'Mobile Device': Phone,
  'Accessories': Keyboard,
};

const ViewItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(mockItems);
  const [filteredItems, setFilteredItems] = useState(mockItems);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.hostname && item.hostname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.assetTag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.type === categoryFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(item => item.department === departmentFilter);
    }

    setFilteredItems(filtered);
    setPage(0);
  }, [items, searchTerm, statusFilter, categoryFilter, departmentFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleEdit = () => {
    console.log('Edit item:', selectedItem);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    setItems(items.filter(item => item.id !== selectedItem.id));
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const handleAssign = () => {
    navigate('/check-out');
    handleMenuClose();
  };

  const getCategoryIcon = (category) => {
    const IconComponent = categoryIcons[category] || Laptop;
    return <IconComponent />;
  };

  return (
    <Dashboard>
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1,
        maxWidth: '1400px',
        mx: 'auto',
        width: '100%'
      }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: '700', color: 'white', mb: 1 }}>
            Inventory Items
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Manage and view all your inventory items
          </Typography>
        </Box>

        {/* Header with Add Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
          <ModernButton
            startIcon={<AddIcon />}
            onClick={() => navigate('/add-item')}
          >
            Add New Item
          </ModernButton>
        </Box>

        {/* Filters and Search */}
        <GlassCard sx={{ mb: 3, width: '100%', background: 'rgba(26, 26, 46, 0.9)' }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#8b5cf6' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{
                      borderRadius: '12px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                    }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="assigned">Assigned</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="retired">Retired</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Type</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Type"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    sx={{
                      borderRadius: '12px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category === 'all' ? 'All Types' : category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Department</InputLabel>
                  <Select
                    value={departmentFilter}
                    label="Department"
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    sx={{
                      borderRadius: '12px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                    }}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ 
                  textAlign: 'center',
                  p: 2,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}>
                  <Typography variant="h6" sx={{ fontWeight: '700', color: 'white' }}>
                    {filteredItems.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Assets Found
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </GlassCard>

        {/* Items Table */}
        <GlassCard sx={{ width: '100%' }}>
          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asset Name</TableCell>
                  <TableCell>Hostname</TableCell>
                  <TableCell>Asset Tag</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Serial Number</TableCell>
                  <TableCell>Brand/Model</TableCell>
                  <TableCell>AnyDesk Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} sx={{ textAlign: 'center', py: 6 }}>
                      <Box>
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                          No assets found
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                          Add new assets or connect to your backend to populate inventory data
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ 
                              mr: 2, 
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                              width: 40,
                              height: 40
                            }}>
                              {getCategoryIcon(item.type)}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="600" sx={{ color: 'white' }}>
                                {item.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                {item.prevOwner ? `Prev: ${item.prevOwner}` : 'New Asset'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontFamily: 'monospace',
                            color: 'rgba(255, 255, 255, 0.9)',
                            background: 'rgba(6, 182, 212, 0.2)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            display: 'inline-block'
                          }}>
                            {item.hostname || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontFamily: 'monospace',
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#8b5cf6',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            display: 'inline-block'
                          }}>
                            {item.assetTag}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ mr: 1, color: '#8b5cf6' }}>
                              {getCategoryIcon(item.type)}
                            </Box>
                            <Typography sx={{ color: 'white' }}>{item.type}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <StatusChip
                            label={item.status.toUpperCase()}
                            status={item.status}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: 'white' }}>{item.department}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontFamily: 'monospace',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.75rem'
                          }}>
                            {item.serialNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {item.brand}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                            {item.model}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            color: item.anydeskStatus === 'Active' ? '#10b981' : 
                                   item.anydeskStatus === 'Inactive' ? '#f59e0b' : 'rgba(255, 255, 255, 0.6)',
                            fontWeight: '500'
                          }}>
                            {item.anydeskStatus}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="More actions">
                            <IconButton
                              onClick={(e) => handleMenuClick(e, item)}
                              size="small"
                              sx={{
                                background: 'rgba(139, 92, 246, 0.1)',
                                '&:hover': {
                                  background: 'rgba(139, 92, 246, 0.2)',
                                }
                              }}
                            >
                              <MoreVertIcon sx={{ color: 'white' }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredItems.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
            }}
          />
        </GlassCard>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          <MenuItem onClick={handleEdit} sx={{ borderRadius: '8px', mx: 1 }}>
            <EditIcon sx={{ mr: 2, color: '#667eea' }} fontSize="small" />
            Edit Item
          </MenuItem>
          <MenuItem onClick={handleAssign} sx={{ borderRadius: '8px', mx: 1 }}>
            <AssignIcon sx={{ mr: 2, color: '#10b981' }} fontSize="small" />
            Assign Item
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ borderRadius: '8px', mx: 1, color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 2 }} fontSize="small" />
            Delete Item
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: '600' }}>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ borderRadius: '8px' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete} 
              variant="contained" 
              sx={{ 
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Dashboard>
  );
};

export default ViewItems;