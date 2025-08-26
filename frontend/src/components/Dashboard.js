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
  Paper
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
  AssignmentTurnedIn as Assignment
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 300;

// Create custom dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8b5cf6',
    },
    secondary: {
      main: '#06b6d4',
    },
    background: {
      default: '#0f0f23',
      paper: 'rgba(139, 92, 246, 0.1)',
    },
  },
});

// Ultra-modern styled components
const ModernDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
    backdropFilter: 'blur(20px)',
    border: 'none',
    boxShadow: '20px 0 40px rgba(0, 0, 0, 0.3)',
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
        radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
      `,
      pointerEvents: 'none',
    },
  },
}));

const ModernAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(15, 15, 35, 0.95)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
  border: '1px solid rgba(139, 92, 246, 0.1)',
}));

const NavItem = styled(ListItemButton)(({ theme, active }) => ({
  margin: '8px 16px',
  borderRadius: '16px',
  background: active 
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)'
    : 'transparent',
  border: active ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
  color: active ? '#8b5cf6' : 'rgba(255, 255, 255, 0.7)',
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
    background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
    transition: 'left 0.6s',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
    transform: 'translateX(8px) scale(1.02)',
    color: '#ffffff',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateX(8px) scale(0.98)',
  },
}));

const UltraModernCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
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
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'translateY(-12px) rotateX(5deg)',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(139, 92, 246, 0.4)',
    boxShadow: '0 25px 50px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.2)',
  },
}));

const GlowingStatCard = styled(Card)(({ gradient, glowColor }) => ({
  background: gradient,
  borderRadius: '24px',
  border: 'none',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
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
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `conic-gradient(from 0deg, transparent, ${glowColor}20, transparent)`,
    animation: 'spin 4s linear infinite',
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.05)',
    boxShadow: `0 25px 50px ${glowColor}40, 0 0 0 1px ${glowColor}30`,
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}));

const FloatingActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: '16px 32px',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
  color: 'white',
  fontWeight: '700',
  fontSize: '16px',
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.6s',
  },
  '&:hover': {
    transform: 'translateY(-4px) scale(1.05)',
    boxShadow: '0 20px 40px rgba(139, 92, 246, 0.6)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(-2px) scale(1.02)',
  },
}));

const MainContainer = styled(Box)(({ theme }) => ({
  background: `
    radial-gradient(circle at 20% 80%, #1a1a2e 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, #16213e 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, #0f0f23 0%, transparent 50%),
    linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)
  `,
  minHeight: '100vh',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 30%),
      radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 30%),
      radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
    animation: 'float 20s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' },
  },
}));

const Dashboard = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Add Item', icon: <AddIcon />, path: '/add-item' },
    { text: 'View Items', icon: <ViewListIcon />, path: '/view-items' },
    { text: 'Check Out', icon: <CheckOutIcon />, path: '/check-out' },
    { text: 'Check In', icon: <CheckInIcon />, path: '/check-in' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    navigate('/login');
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
          background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
          mb: 2,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: -2,
            borderRadius: '22px',
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }
        }}>
          <AutoAwesome sx={{ fontSize: 28, color: 'white' }} />
        </Box>
        <Typography variant="h5" sx={{ 
          fontWeight: '800', 
          color: 'white',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
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
              active={location.pathname === item.path ? 1 : 0}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
            >
              <ListItemIcon sx={{ 
                color: 'inherit', 
                minWidth: 48,
                '& svg': {
                  fontSize: 24,
                  filter: location.pathname === item.path ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                }
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? '700' : '500',
                  fontSize: '15px'
                }}
              />
              {location.pathname === item.path && (
                <Star sx={{ fontSize: 16, color: '#8b5cf6', ml: 1 }} />
              )}
            </NavItem>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 3 }}>
        <Paper sx={{ 
          p: 3, 
          background: 'rgba(139, 92, 246, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <Typography variant="h4" sx={{ color: '#8b5cf6', fontWeight: '800', mb: 1 }}>
            1,234
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>
            Total Items Managed
          </Typography>
        </Paper>
      </Box>
    </Box>
  );

  const dashboardContent = (
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ 
          fontWeight: '900', 
          color: 'white', 
          mb: 2,
          background: 'linear-gradient(135deg, #ffffff 0%, #8b5cf6 50%, #06b6d4 100%)',
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

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <GlowingStatCard gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" glowColor="#8b5cf6">
            <CardContent sx={{ position: 'relative', zIndex: 1, p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: '900', mb: 1, color: 'white' }}>
                    1,234
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                    Total Items
                  </Typography>
                </Box>
                <Inventory2 sx={{ fontSize: 56, opacity: 0.8, color: 'white' }} />
              </Box>
            </CardContent>
          </GlowingStatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GlowingStatCard gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" glowColor="#06b6d4">
            <CardContent sx={{ position: 'relative', zIndex: 1, p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: '900', mb: 1, color: 'white' }}>
                    892
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                    Available
                  </Typography>
                </Box>
                <CheckCircleOutline sx={{ fontSize: 56, opacity: 0.8, color: 'white' }} />
              </Box>
            </CardContent>
          </GlowingStatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GlowingStatCard gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" glowColor="#f59e0b">
            <CardContent sx={{ position: 'relative', zIndex: 1, p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: '900', mb: 1, color: 'white' }}>
                    298
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                    Assigned
                  </Typography>
                </Box>
                <Assignment sx={{ fontSize: 56, opacity: 0.8, color: 'white' }} />
              </Box>
            </CardContent>
          </GlowingStatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GlowingStatCard gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" glowColor="#ef4444">
            <CardContent sx={{ position: 'relative', zIndex: 1, p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: '900', mb: 1, color: 'white' }}>
                    44
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: '600', color: 'white' }}>
                    Maintenance
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 56, opacity: 0.8, color: 'white' }} />
              </Box>
            </CardContent>
          </GlowingStatCard>
        </Grid>
      </Grid>

      <UltraModernCard sx={{ mb: 6 }}>
        <CardContent sx={{ p: 6, position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: '800', 
            mb: 4, 
            color: 'white',
            textAlign: 'center'
          }}>
            Quick Actions
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <FloatingActionButton
                fullWidth
                startIcon={<AddIcon />}
                onClick={() => navigate('/add-item')}
              >
                Add Item
              </FloatingActionButton>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FloatingActionButton
                fullWidth
                startIcon={<CheckOutIcon />}
                onClick={() => navigate('/check-out')}
              >
                Check Out
              </FloatingActionButton>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FloatingActionButton
                fullWidth
                startIcon={<CheckInIcon />}
                onClick={() => navigate('/check-in')}
              >
                Check In
              </FloatingActionButton>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FloatingActionButton
                fullWidth
                startIcon={<ReportsIcon />}
                onClick={() => navigate('/reports')}
              >
                Reports
              </FloatingActionButton>
            </Grid>
          </Grid>
        </CardContent>
      </UltraModernCard>

      <UltraModernCard>
        <CardContent sx={{ p: 6, textAlign: 'center', position: 'relative', zIndex: 1 }}>
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

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex' }}>
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
              {location.pathname === '/' ? 'Dashboard' :
               location.pathname === '/add-item' ? 'Add Item' :
               location.pathname === '/view-items' ? 'View Items' :
               location.pathname === '/check-out' ? 'Check Out' :
               location.pathname === '/check-in' ? 'Check In' :
               location.pathname === '/reports' ? 'Reports' : 'Dashboard'}
            </Typography>
            
            <Chip 
              label="Admin" 
              size="small" 
              sx={{ 
                mr: 2, 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
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
                background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' 
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
                  background: 'rgba(26, 26, 46, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
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
            {location.pathname === '/' ? dashboardContent : children}
          </Box>
        </MainContainer>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;