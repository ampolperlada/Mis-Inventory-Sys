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
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '& .MuiTableHead-root': {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
  },
  '& .MuiTableCell-head': {
    fontWeight: '600',
    color: '#4a5568',
    borderBottom: '2px solid rgba(102, 126, 234, 0.1)',
  },
  '& .MuiTableRow-root:hover': {
    background: 'rgba(102, 126, 234, 0.05)',
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

// Mock data
const mockItems = [
  {
    id: 1,
    name: 'MacBook Pro 14"',
    brand: 'Apple',
    model: 'MBP14-2023',
    serialNumber: 'MBA001',
    category: 'Laptops',
    status: 'available',
    condition: 'new',
    location: 'IT Storage',
    purchaseDate: '2023-01-15',
    purchasePrice: 2499.00,
  },
  {
    id: 2,
    name: 'Dell Monitor 27"',
    brand: 'Dell',
    model: 'U2720Q',
    serialNumber: 'DEL001',
    category: 'Monitors',
    status: 'assigned',
    condition: 'good',
    location: 'Employee Desk',
    purchaseDate: '2022-11-20',
    purchasePrice: 599.00,
  },
  {
    id: 3,
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    model: 'iPhone15Pro',
    serialNumber: 'IPH001',
    category: 'Phones',
    status: 'assigned',
    condition: 'new',
    location: 'Employee Desk',
    purchaseDate: '2023-09-20',
    purchasePrice: 999.00,
  },
  {
    id: 4,
    name: 'Office Chair',
    brand: 'Herman Miller',
    model: 'Aeron',
    serialNumber: 'HM001',
    category: 'Furniture',
    status: 'available',
    condition: 'good',
    location: 'Office Floor 2',
    purchaseDate: '2021-03-10',
    purchasePrice: 1395.00,
  },
  {
    id: 5,
    name: 'Wireless Keyboard',
    brand: 'Logitech',
    model: 'MX Keys',
    serialNumber: 'LOG001',
    category: 'Peripherals',
    status: 'maintenance',
    condition: 'fair',
    location: 'IT Storage',
    purchaseDate: '2022-08-15',
    purchasePrice: 99.00,
  },
];

const categoryIcons = {
  'Laptops': Laptop,
  'Monitors': Monitor,
  'Phones': Phone,
  'Furniture': Chair,
  'Peripherals': Keyboard,
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

  const categories = ['all', 'Laptops', 'Monitors', 'Phones', 'Furniture', 'Peripherals', 'Networking', 'Other'];

  useEffect(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
    setPage(0);
  }, [items, searchTerm, statusFilter, categoryFilter]);

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
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: '700', color: 'white', mb: 1 }}>
            Inventory Items
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Manage and view all your inventory items
          </Typography>
        </Box>

        {/* Header with Add Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box />
          <ModernButton
            startIcon={<AddIcon />}
            onClick={() => navigate('/add-item')}
          >
            Add New Item
          </ModernButton>
        </Box>

        {/* Filters and Search */}
        <GlassCard sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.8)',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.8)',
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
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    sx={{
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ 
                  textAlign: 'center',
                  p: 2,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                }}>
                  <Typography variant="h6" sx={{ fontWeight: '700', color: '#4a5568' }}>
                    {filteredItems.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Items Found
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </GlassCard>

        {/* Items Table */}
        <GlassCard>
          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Brand/Model</TableCell>
                  <TableCell>Serial Number</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Condition</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ 
                            mr: 2, 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            width: 40,
                            height: 40
                          }}>
                            {getCategoryIcon(item.category)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="600" sx={{ color: '#2d3748' }}>
                              {item.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {item.brand}
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {item.model}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ 
                          fontFamily: 'monospace',
                          background: 'rgba(102, 126, 234, 0.1)',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          display: 'inline-block'
                        }}>
                          {item.serialNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ mr: 1, color: '#667eea' }}>
                            {getCategoryIcon(item.category)}
                          </Box>
                          {item.category}
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
                        <Typography variant="body2" sx={{ 
                          textTransform: 'capitalize',
                          fontWeight: '500',
                          color: item.condition === 'new' ? '#10b981' : 
                                 item.condition === 'good' ? '#3b82f6' : 
                                 item.condition === 'fair' ? '#f59e0b' : '#ef4444'
                        }}>
                          {item.condition}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600" sx={{ color: '#059669' }}>
                          ${item.purchasePrice.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="More actions">
                          <IconButton
                            onClick={(e) => handleMenuClick(e, item)}
                            size="small"
                            sx={{
                              background: 'rgba(102, 126, 234, 0.1)',
                              '&:hover': {
                                background: 'rgba(102, 126, 234, 0.2)',
                              }
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
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