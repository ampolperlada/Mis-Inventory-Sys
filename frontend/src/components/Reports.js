import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Assessment as ReportsIcon,
  GetApp as ExportIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  BarChart as ChartIcon,
} from '@mui/icons-material';
import Dashboard from './Dashboard';

const Reports = () => {
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [category, setCategory] = useState('all');

  // Mock report data
  const inventoryStats = {
    totalItems: 1234,
    available: 892,
    assigned: 298,
    maintenance: 44,
    totalValue: 125450.00,
  };

  const categoryStats = [
    { category: 'Laptops', count: 245, value: 485750 },
    { category: 'Monitors', count: 189, value: 94500 },
    { category: 'Phones', count: 156, value: 234000 },
    { category: 'Furniture', count: 89, value: 178000 },
    { category: 'Peripherals', count: 234, value: 46800 },
  ];

  const recentAssignments = [
    { id: 1, item: 'MacBook Pro 14"', assignedTo: 'John Doe', date: '2024-01-15', status: 'active' },
    { id: 2, item: 'Dell Monitor', assignedTo: 'Jane Smith', date: '2024-01-14', status: 'active' },
    { id: 3, item: 'iPhone 15', assignedTo: 'Bob Wilson', date: '2024-01-13', status: 'returned' },
  ];

  const handleExport = (format) => {
    console.log(`Exporting report in ${format} format`);
    // Mock export functionality
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}...`);
  };

  const ReportsContent = () => (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ReportsIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5">Reports & Analytics</Typography>
      </Box>

      {/* Report Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Report Parameters
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="inventory">Inventory Summary</MenuItem>
                <MenuItem value="assignments">Assignment Report</MenuItem>
                <MenuItem value="financial">Financial Report</MenuItem>
                <MenuItem value="maintenance">Maintenance Log</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="laptops">Laptops</MenuItem>
                <MenuItem value="monitors">Monitors</MenuItem>
                <MenuItem value="phones">Phones</MenuItem>
                <MenuItem value="furniture">Furniture</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PdfIcon />}
                onClick={() => handleExport('pdf')}
              >
                PDF
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ExcelIcon />}
                onClick={() => handleExport('excel')}
              >
                Excel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inventory Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">
                      {inventoryStats.totalItems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Items
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {inventoryStats.available}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Available
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {inventoryStats.assigned}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Assigned
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main">
                      {inventoryStats.maintenance}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Maintenance
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Value
              </Typography>
              <Typography variant="h3" color="primary.main">
                ${inventoryStats.totalValue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current inventory valuation
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Breakdown */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Items by Category
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoryStats.map((stat) => (
                      <TableRow key={stat.category}>
                        <TableCell>{stat.category}</TableCell>
                        <TableCell align="right">{stat.count}</TableCell>
                        <TableCell align="right">
                          ${stat.value.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Assignments
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Assigned To</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>{assignment.item}</TableCell>
                        <TableCell>{assignment.assignedTo}</TableCell>
                        <TableCell>{assignment.date}</TableCell>
                        <TableCell>
                          <Chip
                            label={assignment.status}
                            size="small"
                            color={assignment.status === 'active' ? 'warning' : 'success'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Report Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ChartIcon />}
              onClick={() => handleExport('chart')}
            >
              Generate Chart
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={() => handleExport('detailed')}
            >
              Detailed Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Email report functionality coming soon')}
            >
              Email Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Schedule report functionality coming soon')}
            >
              Schedule Report
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  return <Dashboard>{<ReportsContent />}</Dashboard>;