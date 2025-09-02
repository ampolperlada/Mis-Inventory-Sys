import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Chip,
  Paper,
  TextField,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';
import {
  Dashboard as DashboardIcon,
  Add as AddIcon,
  ViewList as ViewListIcon,
  CheckCircle as CheckInIcon,
  Assignment as CheckOutIcon,
  Assessment as ReportsIcon,
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Settings,
  Inventory2,
  TrendingUp,
  Warning,
  CheckCircleOutline,
  Star,
  AutoAwesome,
  AssignmentTurnedIn as Assignment,
  Search,
  Delete,
  Edit,
  Person,
  CalendarToday,
} from '@mui/icons-material';

import { useInventoryItems, useDashboardStats } from '../hooks/useInventory';

// Create clean white theme
const drawerWidth = 300;

const whiteTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#7c3aed',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  }
});

// Styled Components
const ModernDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
}));

const ModernAppBar = styled(AppBar)(({ theme }) => ({
  background: '#ffffff',
  color: '#1f2937',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  border: '1px solid #e5e7eb',
  borderTop: 'none',
}));

const NavItem = styled(ListItemButton)(({ theme, active }) => ({
  margin: '4px 16px',
  borderRadius: '8px',
  background: active ? '#eff6ff' : 'transparent',
  border: active ? '1px solid #dbeafe' : '1px solid transparent',
  color: active ? '#2563eb' : '#6b7280',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: '#f9fafb',
    color: '#1f2937',
  },
}));

const UltraModernCard = styled(Card)(({ theme }) => ({
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
}));

const GlowingStatCard = styled(Card)(({ gradient, glowColor }) => ({
  background: gradient,
  borderRadius: '12px',
  border: 'none',
  transition: 'all 0.2s ease-in-out',
  height: '100px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
}));

const FloatingActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '12px 24px',
  background: '#2563eb',
  color: 'white',
  fontWeight: '600',
  fontSize: '14px',
  textTransform: 'none',
  transition: 'all 0.2s ease-in-out',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  '&:hover': {
    background: '#1d4ed8',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
}));

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
      borderColor: '#2563eb',
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

// Dashboard Component
const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  // Hooks
  const { items, loading, error, addItem, deleteItem, checkOutItem, checkInItem } = useInventoryItems();
  const { stats, loading: statsLoading } = useDashboardStats();

  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openCheckOutDialog, setOpenCheckOutDialog] = useState(null);
  const [openCheckInDialog, setOpenCheckInDialog] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form states
  const [newItem, setNewItem] = useState({ name: '', brand: '', model: '', serialNumber: '' });
  const [assignmentData, setAssignmentData] = useState({ assignedTo: '', department: '' });
  const [returnData, setReturnData] = useState({ condition: 'good', notes: '' });

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, view: 'dashboard' },
    { text: 'Add Item', icon: <AddIcon />, view: 'add' },
    { text: 'View Items', icon: <ViewListIcon />, view: 'view' },
    { text: 'Check Out', icon: <CheckOutIcon />, view: 'checkout' },
    { text: 'Check In', icon: <CheckInIcon />, view: 'checkin' },
    { text: 'Reports', icon: <ReportsIcon />, view: 'reports' },
  ];

  // Handlers
  const handleAddItem = async () => {
    if (!newItem.name?.trim()) {
      showSnackbar('Item name is required', 'error');
      return;
    }
    if (!newItem.serialNumber?.trim()) {
      showSnackbar('Serial number is required', 'error');
      return;
    }

    const itemData = {
      name: newItem.name.trim(),
      brand: newItem.brand?.trim() || null,
      model: newItem.model?.trim() || null,
      serial_number: newItem.serialNumber.trim(),
      status: 'available',
      category_id: 1,
      location: 'Office',
      condition_status: 'new',
      description: '',
      notes: '',
      created_by: 1,
    };

    try {
      await addItem(itemData);
      setNewItem({ name: '', brand: '', model: '', serialNumber: '' });
      setOpenAddDialog(false);
      showSnackbar('Item added successfully!', 'success');
    } catch (err) {
      console.error('Add item error:', err);
      showSnackbar('Failed to add item: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteItem(id);
      setDeleteConfirm(null);
      showSnackbar('Item deleted successfully!');
    } catch (err) {
      showSnackbar('Failed to delete item: ' + err.message, 'error');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await checkOutItem(id, assignmentData);
      setOpenCheckOutDialog(null);
      setAssignmentData({ assignedTo: '', department: '' });
      showSnackbar('Item checked out successfully!');
    } catch (err) {
      showSnackbar('Failed to check out: ' + err.message, 'error');
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await checkInItem(id, returnData);
      setOpenCheckInDialog(null);
      setReturnData({ condition: 'good', notes: '' });
      showSnackbar('Item checked in successfully!');
    } catch (err) {
      showSnackbar('Failed to check in: ' + err.message, 'error');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'add':
        return (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ color: '#1f2937', mb: 2 }}>Add New Item</Typography>
            <UltraModernCard>
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Item Name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="Brand"
                      value={newItem.brand}
                      onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="Model"
                      value={newItem.model}
                      onChange={(e) => setNewItem({ ...newItem, model: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Serial Number"
                      value={newItem.serialNumber}
                      onChange={(e) => setNewItem({ ...newItem, serialNumber: e.target.value })}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Button onClick={() => setCurrentView('dashboard')}>Cancel</Button>
                  <FloatingActionButton onClick={handleAddItem}>
                    Add Item
                  </FloatingActionButton>
                </Box>
              </CardContent>
            </UltraModernCard>
          </Box>
        );

      case 'view':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h4" sx={{ color: '#1f2937' }}>Inventory Items</Typography>
              <FloatingActionButton
                startIcon={<AddIcon />}
                onClick={() => setOpenAddDialog(true)}
              >
                Add Item
              </FloatingActionButton>
            </Box>

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <TableContainer component={Paper} sx={{ border: '1px solid #e5e7eb' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Brand</strong></TableCell>
                      <TableCell><strong>Model</strong></TableCell>
                      <TableCell><strong>Serial</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ color: '#6b7280' }}>
                          No items found. Add one to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.brand}</TableCell>
                          <TableCell>{item.model}</TableCell>
                          <TableCell>{item.serial_number}</TableCell>
                          <TableCell>
                            <Chip
                              label={item.status}
                              size="small"
                              sx={{
                                background:
                                  item.status === 'available' ? '#dcfce7' :
                                  item.status === 'assigned' ? '#fef3c7' :
                                  '#fee2e2',
                                color:
                                  item.status === 'available' ? '#166534' :
                                  item.status === 'assigned' ? '#92400e' :
                                  '#991b1b',
                                fontWeight: '600'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => setOpenCheckOutDialog(item.id)}>
                              <CheckOutIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => setOpenCheckInDialog(item.id)}>
                              <CheckInIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => setDeleteConfirm(item.id)}>
                              <Delete fontSize="small" color="error" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        );

      default:
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: '900', color: '#1f2937', mb: 1 }}>
                Dashboard
              </Typography>
              <Typography variant="h6" sx={{ color: '#6b7280', maxWidth: '600px', mx: 'auto' }}>
                Inventory Management System
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 6 }}>
              <Grid item xs={12} sm={3}>
                <GlowingStatCard gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" glowColor="#8b5cf6">
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Inventory2 sx={{ fontSize: 32, color: 'white', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: '900', color: 'white' }}>
                      {stats.totalItems}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                      Total Items
                    </Typography>
                  </CardContent>
                </GlowingStatCard>
              </Grid>
              <Grid item xs={12} sm={3}>
                <GlowingStatCard gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" glowColor="#06b6d4">
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <CheckCircleOutline sx={{ fontSize: 32, color: 'white', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: '900', color: 'white' }}>
                      {stats.available}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                      Available
                    </Typography>
                  </CardContent>
                </GlowingStatCard>
              </Grid>
              <Grid item xs={12} sm={3}>
                <GlowingStatCard gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" glowColor="#f59e0b">
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Assignment sx={{ fontSize: 32, color: 'white', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: '900', color: 'white' }}>
                      {stats.assigned}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                      Assigned
                    </Typography>
                  </CardContent>
                </GlowingStatCard>
              </Grid>
              <Grid item xs={12} sm={3}>
                <GlowingStatCard gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" glowColor="#ef4444">
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Warning sx={{ fontSize: 32, color: 'white', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: '900', color: 'white' }}>
                      {stats.maintenance}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                      Maintenance
                    </Typography>
                  </CardContent>
                </GlowingStatCard>
              </Grid>
            </Grid>

            <UltraModernCard sx={{ mb: 6 }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <FloatingActionButton startIcon={<AddIcon />} onClick={() => setCurrentView('add')}>
                    Add Item
                  </FloatingActionButton>
                  <FloatingActionButton startIcon={<CheckOutIcon />} onClick={() => setCurrentView('view')}>
                    Check Out
                  </FloatingActionButton>
                  <FloatingActionButton startIcon={<CheckInIcon />} onClick={() => setCurrentView('view')}>
                    Check In
                  </FloatingActionButton>
                  <FloatingActionButton startIcon={<ReportsIcon />} onClick={() => setCurrentView('reports')}>
                    Reports
                  </FloatingActionButton>
                </Box>
              </CardContent>
            </UltraModernCard>

            <UltraModernCard>
              <CardContent sx={{ p: 6, textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 80, color: '#8b5cf6', mb: 3, opacity: 0.7 }} />
                <Typography variant="h5" sx={{ color: '#1f2937', mb: 2, fontWeight: '700' }}>
                  Recent Activity
                </Typography>
                <Typography variant="body1" sx={{ color: '#6b7280' }}>
                  No recent activity to display.
                </Typography>
              </CardContent>
            </UltraModernCard>
          </Box>
        );
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: '8px',
          background: '#2563eb',
          mb: 2,
        }}>
          <AutoAwesome sx={{ fontSize: 24, color: 'white' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: '700', color: '#1f2937', mb: 1 }}>
          Inventory Pro
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: '500' }}>
          Management System
        </Typography>
      </Box>
      
      <List sx={{ flex: 1, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <NavItem
              active={currentView === item.view ? 1 : 0}
              onClick={() => setCurrentView(item.view)}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 48 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: currentView === item.view ? '700' : '500',
                  fontSize: '15px'
                }}
              />
              {currentView === item.view && (
                <Star sx={{ fontSize: 16, color: '#8b5cf6', ml: 1 }} />
              )}
            </NavItem>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 3 }}>
        <Paper sx={{ 
          p: 3, 
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <Typography variant="h4" sx={{ color: '#2563eb', fontWeight: '800', mb: 1 }}>
            {stats.totalItems}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: '600' }}>
            Total Items Managed
          </Typography>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={whiteTheme}>
      <Box sx={{ 
        display: 'flex',
        minHeight: '100vh',
        background: '#f8f9fa',
      }}>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </MuiAlert>
        </Snackbar>

        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <StyledTextField fullWidth label="Item Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField fullWidth label="Brand" value={newItem.brand} onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField fullWidth label="Model" value={newItem.model} onChange={(e) => setNewItem({ ...newItem, model: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField fullWidth label="Serial Number" value={newItem.serialNumber} onChange={(e) => setNewItem({ ...newItem, serialNumber: e.target.value })} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <FloatingActionButton onClick={handleAddItem}>Add Item</FloatingActionButton>
          </DialogActions>
        </Dialog>

        {/* Check Out Dialog */}
        {openCheckOutDialog && (
          <Dialog open onClose={() => setOpenCheckOutDialog(null)} maxWidth="sm" fullWidth>
            <DialogTitle>Check Out Item</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <StyledTextField fullWidth label="Assigned To" value={assignmentData.assignedTo} onChange={(e) => setAssignmentData({ ...assignmentData, assignedTo: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField fullWidth label="Department" value={assignmentData.department} onChange={(e) => setAssignmentData({ ...assignmentData, department: e.target.value })} />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCheckOutDialog(null)}>Cancel</Button>
              <FloatingActionButton onClick={() => handleCheckOut(openCheckOutDialog)}>Check Out</FloatingActionButton>
            </DialogActions>
          </Dialog>
        )}

        {/* Check In Dialog */}
        {openCheckInDialog && (
          <Dialog open onClose={() => setOpenCheckInDialog(null)} maxWidth="sm" fullWidth>
            <DialogTitle>Check In Item</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Condition</InputLabel>
                    <Select
                      value={returnData.condition}
                      label="Condition"
                      onChange={(e) => setReturnData({ ...returnData, condition: e.target.value })}
                    >
                      <MenuItem value="good">Good</MenuItem>
                      <MenuItem value="fair">Fair</MenuItem>
                      <MenuItem value="damaged">Damaged</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Notes"
                    value={returnData.notes}
                    onChange={(e) => setReturnData({ ...returnData, notes: e.target.value })}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCheckInDialog(null)}>Cancel</Button>
              <FloatingActionButton onClick={() => handleCheckIn(openCheckInDialog)}>Check In</FloatingActionButton>
            </DialogActions>
          </Dialog>
        )}

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <Dialog open onClose={() => setDeleteConfirm(null)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete this item? This action cannot be undone.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button color="error" onClick={() => handleDeleteItem(deleteConfirm)}>Delete</Button>
            </DialogActions>
          </Dialog>
        )}

        <ModernAppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: '700' }}>
              {currentView === 'dashboard' ? 'Dashboard' :
               currentView === 'add' ? 'Add Item' :
               currentView === 'view' ? 'View Items' :
               currentView === 'checkout' ? 'Check Out' :
               currentView === 'checkin' ? 'Check In' :
               currentView === 'reports' ? 'Reports' : 'Dashboard'}
            </Typography>
            
            <Chip 
              label="Admin" 
              size="small" 
              sx={{ 
                mr: 2, 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                color: 'white',
                fontWeight: '600'
              }} 
            />
            
            <IconButton
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ 
                width: 36, 
                height: 36, 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' 
              }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  background: 'rgba(31, 31, 62, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                }
              }}
            >
              <MenuItem onClick={handleMenuClose} sx={{ color: 'white' }}>
                <Settings sx={{ mr: 2 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={() => setCurrentView('dashboard')} sx={{ color: 'white' }}>
                <Logout sx={{ mr: 2 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </ModernAppBar>

        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          <ModernDrawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            {drawer}
          </ModernDrawer>
          <ModernDrawer
            variant="permanent"
            sx={{ display: { xs: 'none', md: 'block' } }}
            open
          >
            {drawer}
          </ModernDrawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Toolbar />
          <Box sx={{ 
            flex: 1,
            p: 4,
            maxWidth: '1400px',
            mx: 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {renderCurrentView()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;