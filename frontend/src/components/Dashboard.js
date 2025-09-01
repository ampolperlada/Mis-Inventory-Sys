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
  InputLabel
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
  Search,
  PersonAdd,
  Business,
  CalendarToday,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';

const drawerWidth = 300;

// Create custom dark purple theme
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

// Styled components
const ModernDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    background: 'linear-gradient(145deg, #312e81 0%, #1e1b4b 50%, #1a1856 100%)',
    backdropFilter: 'blur(20px)',
    border: 'none',
    boxShadow: '20px 0 40px rgba(0, 0, 0, 0.5)',
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
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)',
    transform: 'translateX(8px) scale(1.02)',
    color: '#ffffff',
  },
}));

const UltraModernCard = styled(Card)(({ theme }) => ({
  background: 'rgba(31, 31, 62, 0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '24px',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
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
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  height: '140px',
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

const Dashboard = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
    { text: 'Dashboard', icon: <DashboardIcon />, view: 'dashboard' },
    { text: 'Add Item', icon: <AddIcon />, view: 'add' },
    { text: 'View Items', icon: <ViewListIcon />, view: 'view' },
    { text: 'Check Out', icon: <CheckOutIcon />, view: 'checkout' },
    { text: 'Check In', icon: <CheckInIcon />, view: 'checkin' },
    { text: 'Reports', icon: <ReportsIcon />, view: 'reports' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Simple Add Item Form
  const AddItemForm = () => (
    <UltraModernCard sx={{ mb: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <AddIcon sx={{ color: '#8b5cf6', fontSize: 32 }} />
          <Typography variant="h3" sx={{ color: 'white', fontWeight: '900' }}>
            Add New Item
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Item Name"
              placeholder="Enter item name"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Brand"
              placeholder="Enter brand"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Model"
              placeholder="Enter model"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Serial Number"
              placeholder="Enter serial number"
            />
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
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
      </CardContent>
    </UltraModernCard>
  );

  // Simple View Items
  const ViewItems = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: '900', mb: 1 }}>
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
          <Box sx={{ textAlign: 'center', py: 8, color: '#c4b5fd' }}>
            <Inventory2 sx={{ fontSize: 80, mb: 3, opacity: 0.5 }} />
            <Typography variant="h5" sx={{ fontWeight: '700', mb: 2 }}>
              No assets found
            </Typography>
            <Typography>
              Add new assets to see them listed here
            </Typography>
          </Box>
        </CardContent>
      </UltraModernCard>
    </Box>
  );

  // Simple Check Out
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

  // Simple Check In
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
      </CardContent>
    </UltraModernCard>
  );

  // Simple Reports
  const Reports = () => (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: 'white', fontWeight: '900', mb: 1 }}>
          Reports & Analytics
        </Typography>
        <Typography sx={{ color: '#c4b5fd' }}>
          Generate comprehensive reports and analyze your inventory data
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <GlowingStatCard gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" glowColor="#8b5cf6">
            <CardContent sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <Inventory2 sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white' }}>
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
            <CardContent sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <CheckCircleOutline sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white' }}>
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
            <CardContent sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <Assignment sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white' }}>
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
            <CardContent sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <Warning sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white' }}>
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
        <Box sx={{ width: '100%' }}>
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
              Welcome to the future of inventory management
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <GlowingStatCard gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" glowColor="#8b5cf6">
                <CardContent sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                  <Inventory2 sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
                  <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white' }}>
                    {stats.totalItems.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                    Total Items
                  </Typography>
                </CardContent>
              </GlowingStatCard>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <GlowingStatCard gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" glowColor="#06b6d4">
                <CardContent sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                  <CheckCircleOutline sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
                  <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white' }}>
                    {stats.available.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                    Available
                  </Typography>
                </CardContent>
              </GlowingStatCard>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <GlowingStatCard gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" glowColor="#f59e0b">
                <CardContent sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                  <Assignment sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
                  <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white' }}>
                    {stats.assigned.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                    Assigned
                  </Typography>
                </CardContent>
              </GlowingStatCard>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <GlowingStatCard gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" glowColor="#ef4444">
                <CardContent sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                  <Warning sx={{ fontSize: 40, color: 'white', mb: 1, opacity: 0.9 }} />
                  <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, color: 'white' }}>
                    {stats.maintenance.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                    Maintenance
                  </Typography>
                </CardContent>
              </GlowingStatCard>
            </Grid>
          </Grid>

          <UltraModernCard sx={{ mb: 6 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: '800', 
                mb: 4, 
                color: 'white',
                textAlign: 'center'
              }}>
                Quick Actions
              </Typography>
              <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
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
            </CardContent>
          </UltraModernCard>

          <UltraModernCard>
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 80, color: '#8b5cf6', mb: 3, opacity: 0.7 }} />
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
        }}>
          <AutoAwesome sx={{ fontSize: 28, color: 'white' }} />
        </Box>
        <Typography variant="h5" sx={{ 
          fontWeight: '800', 
          color: 'white',
          mb: 1
        }}>
          Inventory Pro
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: '500' }}>
          Next-Gen Management
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
        background: 'linear-gradient(135deg, #1a1856 0%, #312e81 50%, #1e1b4b 100%)',
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