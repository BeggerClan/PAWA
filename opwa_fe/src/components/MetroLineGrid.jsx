import React, { useState, useEffect } from 'react';
import { getAllMetroLines, createMetroLine, updateMetroLine, deleteMetroLine } from '../services/metroLineApi';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Chip,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MetroLineGrid = () => {
  const [metroLines, setMetroLines] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formData, setFormData] = useState({
    lineName: '',
    totalDuration: 0,
    isActive: true,
    firstDeparture: '',
    frequencyMinutes: '10'
  });

  useEffect(() => {
    fetchMetroLines();
  }, []);

  const fetchMetroLines = async () => {
    try {
      const response = await getAllMetroLines();
      setMetroLines(response.data);
    } catch (error) {
      showSnackbar('Failed to fetch metro lines', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleOpenCreateDialog = () => {
    setCurrentLine(null);
    setFormData({
      lineName: '',
      totalDuration: 0,
      isActive: true,
      firstDeparture: '',
      frequencyMinutes: '10'
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (line) => {
    setCurrentLine(line);
    setFormData({
      lineName: line.lineName,
      totalDuration: line.totalDuration,
      isActive: line.isActive,
      firstDeparture: line.firstDeparture ? line.firstDeparture.split('T')[0] : '',
      frequencyMinutes: line.frequencyMinutes
    });
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (line) => {
    setCurrentLine(line);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDeleteDialog(false);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        firstDeparture: formData.firstDeparture ? `${formData.firstDeparture}T00:00:00` : null
      };

      if (currentLine) {
        await updateMetroLine(currentLine.lineId, data);
        showSnackbar('Metro line updated successfully', 'success');
      } else {
        await createMetroLine(data);
        showSnackbar('Metro line created successfully', 'success');
      }
      fetchMetroLines();
      handleCloseDialog();
    } catch (error) {
      showSnackbar(`Failed to ${currentLine ? 'update' : 'create'} metro line`, 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMetroLine(currentLine.lineId);
      showSnackbar('Metro line deleted successfully', 'success');
      fetchMetroLines();
      handleCloseDialog();
    } catch (error) {
      showSnackbar('Failed to delete metro line', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleOpenCreateDialog}
        style={{ marginBottom: '20px' }}
      >
        Add Metro Line
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Line ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Duration (min)</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>First Departure</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Stations</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metroLines.map((line) => (
              <TableRow key={line.lineId}>
                <TableCell>{line.lineId}</TableCell>
                <TableCell>{line.lineName}</TableCell>
                <TableCell>{line.totalDuration}</TableCell>
                <TableCell>{line.frequencyMinutes}</TableCell>
                <TableCell>
                  {line.firstDeparture ? new Date(line.firstDeparture).toLocaleString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={String(line.isActive) === "true" ? "Active" : "Inactive"}
                    color={String(line.isActive) === "true" ? "success" : "error"}
                    size="small"
                  />
                  {line.isSuspended && (
                    <Chip
                      label="Suspended"
                      color="warning"
                      size="small"
                      style={{ marginLeft: '5px' }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {line.stations ? line.stations.length : 0}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEditDialog(line)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(line)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentLine ? 'Edit Metro Line' : 'Create Metro Line'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="lineName"
            label="Line Name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.lineName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="totalDuration"
            label="Total Duration (minutes)"
            type="number"
            fullWidth
            variant="standard"
            value={formData.totalDuration}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="frequencyMinutes"
            label="Frequency (minutes)"
            type="text"
            fullWidth
            variant="standard"
            value={formData.frequencyMinutes}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="firstDeparture"
            label="First Departure"
            type="date"
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            value={formData.firstDeparture}
            onChange={handleInputChange}
          />
          <FormControlLabel
            control={
              <Switch
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                color="primary"
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {currentLine ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete metro line "{currentLine?.lineName}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MetroLineGrid;