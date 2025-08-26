import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
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
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Assignment as AssignIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

// Mock data for demonstration
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

const statusColors = {
  available: 'success',
  assigned: 'warning',
  maintenance: 'error',
  retired: 'default',
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

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
    setPage(0); // Reset to first page when filtering
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
    // Navigate to edit form (to be implemented)
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

  return (
    <Dashboard>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Inventory Items</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/add-item')}
          >
            Add New Item
          </Button>
        </Box>

        {/* Filters and Search */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
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
              <Typography variant="body2" color="text.secondary">
                {filteredItems.length} items found
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Items Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Brand/Model</TableCell>
                  <TableCell>Serial Number</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Condition</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Purchase Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {item.brand} {item.model}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {item.serialNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          color={statusColors[item.status]}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>
                        {item.condition}
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>${item.purchasePrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Tooltip title="More actions">
                          <IconButton
                            onClick={(e) => handleMenuClick(e, item)}
                            size="small"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredItems.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Edit
          </MenuItem>
          <MenuItem onClick={handleAssign}>
            <AssignIcon sx={{ mr: 1 }} fontSize="small" />
            Assign
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Dashboard>
  );
};

export default ViewItems;