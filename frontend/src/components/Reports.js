import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Download,
  BarChart,
  TrendingUp,
  Inventory,
  Assignment
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });
  const [stats, setStats] = useState({
    totalItems: 0,
    assignedItems: 0,
    availableItems: 0,
    maintenanceItems: 0
  });

  // Sample data for demo
  const sampleReportData = {
    inventory: [
      { id: 1, name: 'Dell Laptop', category: 'Electronics', status: 'assigned', assignedTo: 'John Doe' },
      { id: 2, name: 'HP Printer', category: 'Electronics', status: 'available', assignedTo: null },
      { id: 3, name: 'Office Chair', category: 'Furniture', status: 'assigned', assignedTo: 'Jane Smith' }
    ],
    assignments: [
      { id: 1, item: 'Dell Laptop', assignedTo: 'John Doe', date: '2024-01-15', status: 'active' },
      { id: 2, item: 'Office Chair', assignedTo: 'Jane Smith', date: '2024-01-20', status: 'active' }
    ]
  };

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalItems: 150,
      assignedItems: 89,
      availableItems: 45,
      maintenanceItems: 16
    });
    setReportData(sampleReportData);
  }, []);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setReportData(sampleReportData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating report:', error);
      setLoading(false);
    }
  };

  const handleExportReport = (format) => {
    // Simulate export functionality
    console.log(`Exporting report as ${format}`);
    alert(`Report exported as ${format.toUpperCase()}`);
  };

  const renderStatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Inventory sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.totalItems}</Typography>
                <Typography color="text.secondary">Total Items</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.assignedItems}</Typography>
                <Typography color="text.secondary">Assigned</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.availableItems}</Typography>
                <Typography color="text.secondary">Available</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BarChart sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.maintenanceItems}</Typography>
                <Typography color="text.secondary">Maintenance</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderReportFilters = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Report Filters
      </Typography>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              label="Report Type"
            >
              <MenuItem value="inventory">Inventory Report</MenuItem>
              <MenuItem value="assignments">Assignment Report</MenuItem>
              <MenuItem value="maintenance">Maintenance Report</MenuItem>
              <MenuItem value="usage">Usage Report</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={dateRange.startDate}
              onChange={(newValue) => setDateRange(prev => ({ ...prev, startDate: newValue }))}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={dateRange.endDate}
              onChange={(newValue) => setDateRange(prev => ({ ...prev, endDate: newValue }))}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            onClick={handleGenerateReport}
            disabled={loading}
            fullWidth
            sx={{ height: 56 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Report'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderReportTable = () => {
    if (!reportData) return null;

    const data = reportType === 'inventory' ? reportData.inventory : reportData.assignments;
    
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {reportType === 'inventory' ? 'Inventory Report' : 'Assignment Report'}
          </Typography>
          <Box>
            <Button
              startIcon={<Download />}
              onClick={() => handleExportReport('pdf')}
              sx={{ mr: 1 }}
            >
              Export PDF
            </Button>
            <Button
              startIcon={<Download />}
              onClick={() => handleExportReport('excel')}
              variant="outlined"
            >
              Export Excel
            </Button>
          </Box>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {reportType === 'inventory' ? (
                  <>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned To</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>ID</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  {reportType === 'inventory' ? (
                    <>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.875rem',
                            fontWeight: 'medium',
                            backgroundColor: row.status === 'available' ? 'success.light' : 
                                           row.status === 'assigned' ? 'warning.light' : 'error.light',
                            color: row.status === 'available' ? 'success.dark' : 
                                   row.status === 'assigned' ? 'warning.dark' : 'error.dark'
                          }}
                        >
                          {row.status.toUpperCase()}
                        </Box>
                      </TableCell>
                      <TableCell>{row.assignedTo || 'N/A'}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.item}</TableCell>
                      <TableCell>{row.assignedTo}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.875rem',
                            fontWeight: 'medium',
                            backgroundColor: row.status === 'active' ? 'success.light' : 'error.light',
                            color: row.status === 'active' ? 'success.dark' : 'error.dark'
                          }}
                        >
                          {row.status.toUpperCase()}
                        </Box>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>
      
      {renderStatsCards()}
      {renderReportFilters()}
      {renderReportTable()}
    </Box>
  );
};

export default Reports;