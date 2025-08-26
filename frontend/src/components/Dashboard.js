import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Card,
  CardContent,
  Grid,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  ViewList as ViewListIcon,
  Output as CheckOutIcon,
  Input as CheckInIcon,
  Assessment as ReportsIcon,
  Business,
  Inventory,
  Assignment,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Add Item', icon: <AddIcon />, path: '/add-item' },
  { text: 'View Items', icon: <ViewListIcon />, path: '/view-items' },
  { text: 'Check Out Item', icon: <CheckOutIcon />, path: '/check-out' },
  { text: 'Check In Item', icon: <CheckInIcon />, path: '/check-in' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
];

const Dashboard = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  // Mock data for dashboard stats
  const dashboardStats = [
    {
      title: 'Total Items',
      value: '1,234',
      icon: <Inventory sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#e3f2fd',
    },
    {
      title: 'Available',
      value: '892',
      icon: <Business sx={{ fontSize: 40, color: '#388e3c' }} />,
      color: '#e8f5e8',
    },
    {
      title: 'Assigned',
      value: '298',
      icon: <Assignment sx={{ fontSize: 40, color: '#f57c00' }} />,
      color: '#fff3e0',
    },
    {
      title: 'In Maintenance',
      value: '44',
      icon: <TrendingUp sx={{ fontSize: 40, color: '#d32f2f' }} />,
      color: '#ffebee',
    },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Business sx={{ color: 'white', mr: 1 }} />
          <Typography variant="h6" noWrap component="div" color="white">
            Inventory System
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                color: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: 'white',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: 'white',
                  borderRight: '3px solid white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.16)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const DashboardContent = () => (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Welcome to your inventory management system!
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {dashboardStats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      backgroundColor: stat.color,
                      borderRadius: '50%',
                      p: 1,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
              onClick={() => navigate('/add-item')}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6">Add New Item</Typography>
                <Typography variant="body2" color="text.secondary">
                  Register new inventory item
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
              onClick={() => navigate('/check-out')}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <CheckOutIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6">Check Out</Typography>
                <Typography variant="body2" color="text.secondary">
                  Assign item to employee
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
              onClick={() => navigate('/check-in')}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <CheckInIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                <Typography variant="h6">Check In</Typography>
                <Typography variant="body2" color="text.secondary">
                  Return assigned item
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
              onClick={() => navigate('/reports')}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <ReportsIcon sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
                <Typography variant="h6">Reports</Typography>
                <Typography variant="body2" color="text.secondary">
                  View inventory reports
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Recent Activity */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Box>
          <Typography variant="body2" color="text.secondary">
            No recent activity to display. Start by adding some inventory items.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#1976d2',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#1976d2',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          width: { sm: `calc(100% - ${drawerWidth}px)` } 
        }}
      >
        <Toolbar />
        {children || <DashboardContent />}
      </Box>
    </Box>
  );
};

export default Dashboard;