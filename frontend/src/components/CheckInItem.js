import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Autocomplete,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Input as CheckInIcon,
  Search as SearchIcon,
  AssignmentReturn as ReturnIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Dashboard from './Dashboard';

// Mock assigned items
const assignedItems = [
  {
    id: 2,
    name: 'Dell Monitor 27"',
    serialNumber: 'DEL001',
    assignedTo: 'John Doe',
    assignedDate: '2024-01-15',
    department: 'IT Department',
    status: 'assigned'
  },
  {
    id: 3,
    name: 'iPhone 15 Pro',
    serialNumber: 'IPH001',
    assignedTo: 'Jane Smith',
    assignedDate: '2024-02-01',
    department: 'Marketing',
    status: 'assigned'
  },
];

const CheckInItem = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [returnData, setReturnData] = useState({
    condition: 'good',
    notes: '',
    returnDate: new Date().toISOString().split('T')[0],
  });
  const [completed, setCompleted] = useState(false);

  const handleReturn = () => {
    console.log('Returning item:', { selectedItem, returnData });
    setCompleted(true);
  };

  const handleReset = () => {
    setSelectedItem(null);
    setReturnData({
      condition: 'good',
      notes: '',
      returnDate: new Date().toISOString().split('T')[0],
    });
    setCompleted(false);
  };

  const CheckInContent = () => (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <CheckInIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5">Check In Item</Typography>
      </Box>

      {completed ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Return Completed!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {selectedItem?.name} has been successfully returned and is now available.
            </Typography>
            <Button variant="contained" onClick={handleReset}>
              Return Another Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {/* Item Selection */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Select Item to Return
                </Typography>
                <Autocomplete
                  options={assignedItems}
                  getOptionLabel={(option) => `${option.name} (${option.serialNumber}) - ${option.assignedTo}`}
                  value={selectedItem}
                  onChange={(event, newValue) => setSelectedItem(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search assigned items"
                      placeholder="Type item name, serial number, or employee name..."
                      fullWidth
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body1">{option.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          S/N: {option.serialNumber} | Assigned to: {option.assignedTo}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Since: {new Date(option.assignedDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />

                {selectedItem && (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="info">
                      Selected: <strong>{selectedItem.name}</strong> assigned to <strong>{selectedItem.assignedTo}</strong>
                    </Alert>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Assignment Details */}
          {selectedItem && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Assignment Details
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell><strong>Item Name</strong></TableCell>
                          <TableCell>{selectedItem.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Serial Number</strong></TableCell>
                          <TableCell>{selectedItem.serialNumber}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Assigned To</strong></TableCell>
                          <TableCell>{selectedItem.assignedTo}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Department</strong></TableCell>
                          <TableCell>{selectedItem.department}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Assigned Date</strong></TableCell>
                          <TableCell>{new Date(selectedItem.assignedDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Days Assigned</strong></TableCell>
                          <TableCell>
                            {Math.floor((new Date() - new Date(selectedItem.assignedDate)) / (1000 * 60 * 60 * 24))} days
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Return Information */}
          {selectedItem && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Return Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Return Date"
                        type="date"
                        value={returnData.returnDate}
                        onChange={(e) => setReturnData({...returnData, returnDate: e.target.value})}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Item Condition</InputLabel>
                        <Select
                          value={returnData.condition}
                          label="Item Condition"
                          onChange={(e) => setReturnData({...returnData, condition: e.target.value})}
                        >
                          <MenuItem value="new">New</MenuItem>
                          <MenuItem value="good">Good</MenuItem>
                          <MenuItem value="fair">Fair</MenuItem>
                          <MenuItem value="poor">Poor</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Chip
                        label={`Condition: ${returnData.condition}`}
                        color={
                          returnData.condition === 'new' ? 'success' :
                          returnData.condition === 'good' ? 'primary' :
                          returnData.condition === 'fair' ? 'warning' : 'error'
                        }
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Return Notes"
                        multiline
                        rows={3}
                        value={returnData.notes}
                        onChange={(e) => setReturnData({...returnData, notes: e.target.value})}
                        placeholder="Any issues, damages, or notes about the returned item..."
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setSelectedItem(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleReturn}
                      startIcon={<ReturnIcon />}
                    >
                      Complete Return
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );

  return <Dashboard>{<CheckInContent />}</Dashboard>;
};

export default CheckInItem;