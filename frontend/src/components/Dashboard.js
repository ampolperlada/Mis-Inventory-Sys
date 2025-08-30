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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
  TextareaAutosize
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
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
  Search
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 300;

// Create custom dark purple theme with no white elements
const darkPurpleTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8b5cf6',
    },
    secondary: {
      main: '#a855f7',
    },
    background: {
      default: '#1e1b4b',
      paper: '#1f1f3e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#c4b5fd',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  }
});

// Ultra-modern styled components with dark purple theme
const ModernDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    background: 'linear-gradient(145deg, #312e81 0%, #1e1b4b 50%, #1a1856 100%)',
    backdropFilter: 'blur(20px)',
    border: 'none',
    boxShadow: '20px 0 40px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
      `,
      pointerEvents: 'none',
    },
  },
}));

const ModernAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(31, 31, 62, 0.95)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
}));

const NavItem = styled(ListItemButton)(({ theme, active }) => ({
  margin: '8px 16px',
  borderRadius: '16px',
  background: active 
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(168, 85, 247, 0.2) 100%)'
    : 'transparent',
  border: active ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
  color: active ? '#c4b5fd' : 'rgba(255, 255, 255, 0.7)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.15), transparent)',
    transition: 'left 0.6s',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)',
    transform: 'translateX(8px) scale(1.02)',
    color: '#ffffff',
    '&::before': {
      left: '100%',
    },
  },
}));

const UltraModernCard = styled(Card)(({ theme }) => ({
  background: 'rgba(31, 31, 62, 0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '24px',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    background: 'rgba(31, 31, 62, 0.8)',
    border: '1px solid rgba(139, 92, 246, 0.5)',
    boxShadow: '0 25px 50px rgba(139, 92, 246, 0.4)',
  },
}));

const GlowingStatCard = styled(Card)(({ gradient, glowColor }) => ({
  background: gradient,
  borderRadius: '24px',
  border: 'none',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  height: '140px',
  width: '100%',
  minWidth: '200px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.05)',
    boxShadow: `0 25px 50px ${glowColor}60`,
  },
}));

const FloatingActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: '16px 32px',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
  color: 'white',
  fontWeight: '700',
  fontSize: '16px',
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.5)',
  '&:hover': {
    transform: 'translateY(-4px) scale(1.05)',
    boxShadow: '0 20px 40px rgba(139, 92, 246, 0.7)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(31, 31, 62, 0.6)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8b5cf6',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#c4b5fd',
    fontWeight: 500,
  },
  '& .MuiOutlinedInput-input': {
    color: 'white',
  },
}));

const MainContainer = styled(Box)(({ theme }) => ({
  background: `
    radial-gradient(circle at 20% 80%, #312e81 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, #1e1b4b 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, #1a1856 0%, transparent 50%),
    linear-gradient(135deg, #1a1856 0%, #312e81 50%, #1e1b4b 100%)
  `,
  minHeight: '100vh',
  position: 'relative',
  overflow: 'hidden',
  backgroundAttachment: 'fixed',
}));

const Dashboard = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  // No sample data - all counters start at 0
  const stats = {
    totalItems: 0,
    available: 0,
    assigned: 0,
    maintenance: 0
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', view: 'dashboard' },
    { text: 'Add Item', icon: <AddIcon />, path: '/add-item', view: 'add' },
    { text: 'View Items', icon: <ViewListIcon />, path: '/view-items', view: 'view' },
    { text: 'Check Out', icon: <CheckOutIcon />, path: '/check-out', view: 'checkout' },
    { text: 'Check In', icon: <CheckInIcon />, path: '/check-in', view: 'checkin' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/reports', view: 'reports' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    navigate('/login');
  };

  const AddItemForm = () => (
    <UltraModernCard sx={{ mb: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <AddIcon sx={{ color: '#8b5cf6', fontSize: 28 }} />
          <Typography variant="h4" sx={{ color: 'white', fontWeight: '800' }}>
            Add New Item
          </Typography>
        </Box>
        
        <Box sx={{ space: 6 }}>
          {/* Basic Information */}
          <UltraModernCard sx={{ mb: 4, background: 'rgba(139, 92, 246, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: '700', mb: 3 }}>
                Basic Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    label="Item Name *"
                    placeholder="Enter item name"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    label="Brand"
                    placeholder="Enter brand"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    label="Model"
                    placeholder="Enter model"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </UltraModernCard>

          {/* Technical Details */}
          <UltraModernCard sx={{ mb: 4, background: 'rgba(139, 92, 246, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: '700', mb: 3 }}>
                Technical Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <StyledTextField
                    fullWidth
                    label="Serial Number"
                    placeholder="Enter serial number"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StyledTextField
                    fullWidth
                    label="Location"
                    placeholder="Enter location"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#c4b5fd' }}>Status</InputLabel>
                    <Select
                      sx={{
                        background: 'rgba(31, 31, 62, 0.6)',
                        borderRadius: '12px',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(139, 92, 246, 0.3)',
                        },
                      }}
                    >
                      <MenuItem value="available">Available</MenuItem>
                      <MenuItem value="assigned">Assigned</MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#c4b5fd' }}>Condition</InputLabel>
                    <Select
                      sx={{
                        background: 'rgba(31, 31, 62, 0.6)',
                        borderRadius: '12px',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(139, 92, 246, 0.3)',
                        },
                      }}
                    >
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="good">Good</MenuItem>
                      <MenuItem value="fair">Fair</MenuItem>
                      <MenuItem value="poor">Poor</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </UltraModernCard>

          {/* Purchase Information */}
          <UltraModernCard sx={{ mb: 4, background: 'rgba(139, 92, 246, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: '700', mb: 3 }}>
                Purchase Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="Purchase Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="Purchase Price"
                    type="number"
                    placeholder="0.00"
                    InputProps={{ startAdornment: '$' }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </UltraModernCard>

          {/* Additional Information */}
          <UltraModernCard sx={{ mb: 4, background: 'rgba(139, 92, 246, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: '700', mb: 3 }}>
                Additional Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    placeholder="Enter item description"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={4}
                    placeholder="Additional notes"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </UltraModernCard>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              sx={{ color: '#c4b5fd', fontWeight: '600' }}
              onClick={() => setCurrentView('dashboard')}
            >
              Cancel
            </Button>
            <FloatingActionButton>
              Add Item
            </FloatingActionButton>
          </Box>
        </Box>
      </CardContent>
    </UltraModernCard>
  );

  const ViewItems = () => (
    <Box sx={{ space: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: '800', mb: 1 }}>
            Inventory Items
          </Typography>
          <Typography sx={{ color: '#c4b5fd' }}>
            Manage and view all your inventory items
          </Typography>
        </Box>
        <FloatingActionButton
          startIcon={<AddIcon />}
          onClick={() => setCurrentView('add')}
        >
          Add Item
        </FloatingActionButton>
      </Box>

      <UltraModernCard>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                placeholder="Search assets..."
                InputProps={{
                  startAdornment: <Search sx={{ color: '#c4b5fd', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#c4b5fd' }}>All Status</InputLabel>
                <Select
                  sx={{
                    background: 'rgba(31, 31, 62, 0.6)',
                    borderRadius: '12px',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                    },
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="assigned">Assigned</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#c4b5fd' }}>All Types</InputLabel>
                <Select
                  sx={{
                    background: 'rgba(31, 31, 62, 0.6)',
                    borderRadius: '12px',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                    },
                  }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#c4b5fd' }}>All Departments</InputLabel>
                <Select
                  sx={{
                    background: 'rgba(31, 31, 62, 0.6)',
                    borderRadius: '12px',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                    },
                  }}
                >
                  <MenuItem value="all">All Departments</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center', py: 8, color: '#c4b5fd' }}>
            <Inventory2 sx={{ fontSize: 80, mb: 3, opacity: 0.5 }} />
            <Typography variant="h5" sx={{ fontWeight: '700', mb: 2 }}>
              No assets found
            </Typography>
            <Typography>
              Add new assets or connect to your backend to populate inventory data
            </Typography>
          </Box>
        </CardContent>
      </UltraModernCard>
    </Box>
  );

  const CheckOut = () => (
    <UltraModernCard>
      <CardContent sx={{ p: 6, textAlign: 'center' }}>
        <CheckOutIcon sx={{ fontSize: 80, color: '#c4b5fd', mb: 3, opacity: 0.5 }} />
        <Typography variant="h4" sx={{ color: 'white', fontWeight: '800', mb: 2 }}>
          Check Out Item
        </Typography>
        <Typography sx={{ color: '#c4b5fd', mb: 4 }}>
          No items available for checkout. Add inventory items first.
        </Typography>
      </CardContent>
    </UltraModernCard>
  );

  const CheckIn = () => (
    <UltraModernCard>
      <CardContent sx={{ p: 6, textAlign: 'center' }}>
        <CheckInIcon sx={{ fontSize: 80, color: '#c4b5fd', mb: 3, opacity: 0.5 }} />
        <Typography variant="h4" sx={{ color: 'white', fontWeight: '800', mb: 2 }}>
          Check In Item
        </Typography>
        <Typography sx={{ color: '#c4b5fd', mb: 4 }}>
          Return assigned items to inventory
        </Typography>
        <Typography sx={{ color: '#c4b5fd' }}>
          No items currently assigned for check-in.
        </Typography>
      </CardContent>
    </UltraModernCard>
  );

  const Reports = () => (
    <Box sx={{ space: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: '800', mb: 1 }}>
          Reports & Analytics
        </Typography>
        <Typography sx={{ color: '#c4b5fd' }}>
          Generate comprehensive reports and analyze your inventory data
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <GlowingStatCard gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" glowColor="#8b5cf6">
            <CardContent sx={{ position: 'relative', zIndex: 1, p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <PackageIcon sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white', lineHeight: 1 }}>
                {stats.totalItems}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                Total Items
              </Typography>
            </CardContent>
          </GlowingStatCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <GlowingStatCard gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" glowColor="#06b6d4">
            <CardContent sx={{ position: 'relative', zIndex: 1, p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <CheckCircleOutline sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white', lineHeight: 1 }}>
                {stats.available}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                Available
              </Typography>
            </CardContent>
          </GlowingStatCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <GlowingStatCard gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" glowColor="#f59e0b">
            <CardContent sx={{ position: 'relative', zIndex: 1, p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <Assignment sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white', lineHeight: 1 }}>
                {stats.assigned}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                Assigned
              </Typography>
            </CardContent>
          </GlowingStatCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <GlowingStatCard gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" glowColor="#ef4444">
            <CardContent sx={{ position: 'relative', zIndex: 1, p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <Warning sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white', lineHeight: 1 }}>
                {stats.maintenance}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                Maintenance
              </Typography>
            </CardContent>
          </GlowingStatCard>
        </Grid>
      </Grid>

      <UltraModernCard>
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          <ReportsIcon sx={{ fontSize: 80, color: '#c4b5fd', mb: 3, opacity: 0.5 }} />
          <Typography variant="h5" sx={{ color: 'white', fontWeight: '700', mb: 2 }}>
            No data to display
          </Typography>
          <Typography sx={{ color: '#c4b5fd' }}>
            Add inventory items to generate comprehensive reports
          </Typography>
        </CardContent>
      </UltraModernCard>
    </Box>
  );

  const renderCurrentView = () => {
    switch(currentView) {
      case 'add': return <AddItemForm />;
      case 'view': return <ViewItems />;
      case 'checkout': return <CheckOut />;
      case 'checkin': return <CheckIn />;
      case 'reports': return <Reports />;
      default: return (
        <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h2" sx={{ 
              fontWeight: '900', 
              color: 'white', 
              mb: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #8b5cf6 50%, #a855f7 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Dashboard
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontWeight: '400',
              maxWidth: '600px',
              mx: 'auto'
            }}>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6, width: '100%' }}>
            <Grid container spacing={3} sx={{ maxWidth: '1000px', justifyContent: 'center' }}>
              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex' }}>
                <GlowingStatCard gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" glowColor="#8b5cf6" sx={{ width: '100%' }}>
                  <CardContent sx={{ 
                    position: 'relative', 
                    zIndex: 1, 
                    p: 3, 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%'
                  }}>
                    <Inventory2 sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
                    <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white', lineHeight: 1 }}>
                      {stats.totalItems.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                      Total Items
                    </Typography>
                  </CardContent>
                </GlowingStatCard>
              </Grid>

              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex' }}>
                <GlowingStatCard gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" glowColor="#06b6d4" sx={{ width: '100%' }}>
                  <CardContent sx={{ 
                    position: 'relative', 
                    zIndex: 1, 
                    p: 3, 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%'
                  }}>
                    <CheckCircleOutline sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
                    <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white', lineHeight: 1 }}>
                      {stats.available.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                      Available
                    </Typography>
                  </CardContent>
                </GlowingStatCard>
              </Grid>

              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex' }}>
                <GlowingStatCard gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" glowColor="#f59e0b" sx={{ width: '100%' }}>
                  <CardContent sx={{ 
                    position: 'relative', 
                    zIndex: 1, 
                    p: 3, 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%'
                  }}>
                    <Assignment sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
                    <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white', lineHeight: 1 }}>
                      {stats.assigned.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                      Assigned
                    </Typography>
                  </CardContent>
                </GlowingStatCard>
              </Grid>

              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex' }}>
                <GlowingStatCard gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" glowColor="#ef4444" sx={{ width: '100%' }}>
                  <CardContent sx={{ 
                    position: 'relative', 
                    zIndex: 1, 
                    p: 3, 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%'
                  }}>
                    <Warning sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
                    <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white', lineHeight: 1 }}>
                      {stats.maintenance.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                      Maintenance
                    </Typography>
                  </CardContent>
                </GlowingStatCard>
              </Grid>
            </Grid>
          </Box>

          <UltraModernCard sx={{ mb: 6, width: '100%' }}>
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: '800', 
                mb: 4, 
                color: 'white',
                textAlign: 'center'
              }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Grid container spacing={3} sx={{ maxWidth: '800px', justifyContent: 'center' }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <FloatingActionButton
                      fullWidth
                      startIcon={<AddIcon />}
                      onClick={() => setCurrentView('add')}
                    >
                      Add Item
                    </FloatingActionButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FloatingActionButton
                      fullWidth
                      startIcon={<CheckOutIcon />}
                      onClick={() => setCurrentView('checkout')}
                    >
                      Check Out
                    </FloatingActionButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FloatingActionButton
                      fullWidth
                      startIcon={<CheckInIcon />}
                      onClick={() => setCurrentView('checkin')}
                    >
                      Check In
                    </FloatingActionButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FloatingActionButton
                      fullWidth
                      startIcon={<ReportsIcon />}
                      onClick={() => setCurrentView('reports')}
                    >
                      Reports
                    </FloatingActionButton>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </UltraModernCard>

          <UltraModernCard sx={{ width: '100%' }}>
            <CardContent sx={{ p: 6, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Inventory2 sx={{ fontSize: 80, color: '#c4b5fd', mb: 3, opacity: 0.7 }} />
              <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: '700' }}>
                Recent Activity
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)', maxWidth: '400px', mx: 'auto' }}>
                No recent activity to display. Start by adding inventory items or making assignments to see your activity feed here.
              </Typography>
            </CardContent>
          </UltraModernCard>
        </Box>
      );
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: 64,
          height: 64,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
          mb: 2,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: -2,
            borderRadius: '22px',
            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }
        }}>
          <AutoAwesome sx={{ fontSize: 28, color: 'white' }} />
        </Box>
        <Typography variant="h5" sx={{ 
          fontWeight: '800', 
          color: 'white',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1
        }}>
         MIS Inventory System
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: '500' }}>
        </Typography>
      </Box>
      
      <List sx={{ flex: 1, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <NavItem
              active={currentView === item.view ? 1 : 0}
              onClick={() => setCurrentView(item.view)}
            >
              <ListItemIcon sx={{ 
                color: 'inherit', 
                minWidth: 48,
                '& svg': {
                  fontSize: 24,
                  filter: currentView === item.view ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                }
              }}>
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
          background: 'rgba(139, 92, 246, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <Typography variant="h4" sx={{ color: '#8b5cf6', fontWeight: '800', mb: 1 }}>
            {stats.totalItems.toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>
            Total Items Managed
          </Typography>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={darkPurpleTheme}>
      <Box sx={{ 
        display: 'flex',
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 80%, #312e81 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #1e1b4b 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, #1a1856 0%, transparent 50%),
          linear-gradient(135deg, #1a1856 0%, #312e81 50%, #1e1b4b 100%)
        `,
      }}>
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
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: '700' }}>
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
              size="large"
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
              <MenuItem onClick={handleLogout} sx={{ color: 'white' }}>
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

        <MainContainer
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: 'transparent',
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
            minHeight: 'calc(100vh - 64px)',
          }}>
            {renderCurrentView()}
          </Box>
        </MainContainer>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;