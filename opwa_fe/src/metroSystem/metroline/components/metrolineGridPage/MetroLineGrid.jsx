import React, { useState, useEffect } from 'react';
import { getAllMetroLines, createMetroLine, updateMetroLine, deleteMetroLine, getStationsForLine } from '../../../services/metroLineApi';
import { getSuspensionsForLine } from '../../../services/suspensionApi';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Chip, Tabs, Tab, Box } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import MetroLineForm from './MetroLineForm';
import DeleteDialog from './DeleteDialog';
import NotificationSnackbar from '../NotificationSnackbar';
import MetroLineStations from '../metrolineStationGridPage/MetroLineStations';
import MetroLineTripsGrid from './MetroLineTripsGrid';

const MetroLineGrid = ({ onShowStations }) => {
  const [metroLines, setMetroLines] = useState([]);
  const [suspensionsMap, setSuspensionsMap] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({ lineName: '', totalDuration: 0, firstDeparture: '', frequencyMinutes: '10', isSuspended: false, suspensionReason: '', affectedStationIds: [] });
  const [affectedStations, setAffectedStations] = useState([]);
  const [lineStations, setLineStations] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [selectedLineId, setSelectedLineId] = useState(null);
  const [selectedLineName, setSelectedLineName] = useState('');
  const [selectedView, setSelectedView] = useState('stations');

  useEffect(() => { 
    setMetroLines([]); // Clear grid before fetching new data
    fetchMetroLines(); 
  }, [refresh]);
  useEffect(() => { fetchAllSuspensions(); }, [metroLines]);

  const fetchMetroLines = async () => {
    try {
      const response = await getAllMetroLines();
      setMetroLines(response.data);
    } catch (error) {
      showSnackbar('Failed to fetch metro lines', 'error');
    }
  };

  // Fetch suspensions for all lines and build a map: { lineId: [suspensions] }
  const fetchAllSuspensions = async () => {
    const map = {};
    await Promise.all(
      metroLines.map(async (line) => {
        try {
          const res = await getSuspensionsForLine(line.lineId);
          map[line.lineId] = res.data || [];
        } catch {
          map[line.lineId] = [];
        }
      })
    );
    setSuspensionsMap(map);
  };

  const handleOpenCreateDialog = () => {
    setCurrentLine(null);
    setFormData({ lineName: '', totalDuration: 0, firstDeparture: '', frequencyMinutes: '10', isSuspended: false, suspensionReason: '', affectedStationIds: [] });
    setAffectedStations([]);
    setLineStations([]);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = async (line) => {
    setCurrentLine(line);
    setFormData({
      lineName: line.lineName,
      totalDuration: line.totalDuration,
      firstDeparture: line.firstDeparture ?
        (typeof line.firstDeparture === 'string' && line.firstDeparture.includes('T')
          ? line.firstDeparture.slice(0, 16) // 'YYYY-MM-DDTHH:mm'
          : line.firstDeparture)
        : '',
      frequencyMinutes: line.frequencyMinutes,
      isSuspended: line.isSuspended || false,
      suspensionReason: line.suspensionReason || "",
      affectedStationIds: line.affectedStationIds || [],
    });
    setAffectedStations(line.affectedStationIds || []);
    try {
      const res = await getStationsForLine(line.lineId);
      setLineStations(res.data);
    } catch {
      setLineStations([]);
    }
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
      let data = {
        ...formData,
        firstDeparture: formData.firstDeparture ? formData.firstDeparture : null,
        isActive: !(formData.isSuspended && affectedStations.length >= 2)
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
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Helper: determine active status based on suspensions
  const isLineActive = (line) => {
    const suspensions = suspensionsMap[line.lineId] || [];
    // Get all active suspensions and collect unique affected station IDs
    const affectedStationsSet = new Set();
    suspensions.forEach(susp => {
      if (susp.active && Array.isArray(susp.affectedStationIds)) {
        susp.affectedStationIds.forEach(id => affectedStationsSet.add(id));
      }
    });
    return affectedStationsSet.size < 3;
  };

  const handleStationsChanged = () => {
    setRefresh(r => r + 1);
  };

  const handleShowStationsOrTrips = (lineId) => {
    setSelectedLineId(lineId);
    const line = metroLines.find(l => l.lineId === lineId);
    setSelectedLineName(line ? line.lineName : '');
    setSelectedView('stations');
    if (onShowStations) onShowStations(lineId);
  };

  const handleBackToGrid = () => {
    setSelectedLineId(null);
    setSelectedLineName('');
    setSelectedView('stations');
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
        <Table sx={{ border: 1, borderColor: 'divider' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Line ID</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Name</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>First Station</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Last Station</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Duration (min)</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Frequency</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>First Departure</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Status</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Suspended</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Stations</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metroLines.map((line) => {
              const stations = line.stations || [];
              // Sort stations by stationId numerically (lowest to largest)
              const sortedStations = [...stations].sort((a, b) => {
                const numA = parseInt(a.stationId.replace(/^ST/, ''), 10);
                const numB = parseInt(b.stationId.replace(/^ST/, ''), 10);
                return numA - numB;
              });
              const firstStation = sortedStations[0]?.stationName || '-';
              const lastStation = sortedStations.length > 0 ? sortedStations[sortedStations.length - 1]?.stationName : '-';
              return (
                <TableRow key={line.lineId} hover>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }}>{line.lineId}</TableCell>
                  <TableCell
                    sx={{ border: 1, borderColor: 'divider', cursor: 'pointer', color: '#1976d2', fontWeight: 500 }}
                    onClick={() => handleShowStationsOrTrips(line.lineId)}
                  >
                    {line.lineName}
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }}>{firstStation}</TableCell>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }}>{lastStation}</TableCell>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }}>{line.totalDuration} minutes (One-way-trip)</TableCell>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }}>{line.frequencyMinutes} minutes</TableCell>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }}>
                    {line.firstDeparture ? new Date(line.firstDeparture).toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }}>
                    <Chip
                      label={isLineActive(line) ? "Active" : "Inactive"}
                      color={isLineActive(line) ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }}>
                    <Chip
                      label={line.suspended ? "Yes" : "No"}
                      color={line.suspended ? "warning" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }}>
                    {line.stations ? line.stations.length : 0}
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }}>
                    <IconButton onClick={() => handleOpenEditDialog(line)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(line)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <MetroLineForm
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        affectedStations={affectedStations}
        setAffectedStations={setAffectedStations}
        lineStations={lineStations}
        isEdit={!!currentLine}
      />

      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        onDelete={handleDelete}
        lineName={currentLine?.lineName}
      />

      <NotificationSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        severity={snackbar.severity}
        message={snackbar.message}
      />

      {selectedLineId && (
        <Box sx={{ mt: 4, mb: 4, p: 2, border: '2px solid #1976d2', borderRadius: 2, background: '#f8fafd' }}>
          <h2 style={{ color: '#1976d2', marginBottom: 16 }}>Metro Line: {selectedLineName} ({selectedLineId})</h2>
          <Tabs
            value={selectedView}
            onChange={(_, v) => setSelectedView(v)}
            indicatorColor="primary"
            textColor="primary"
            sx={{ mb: 2 }}
          >
            <Tab label="Stations" value="stations" />
            <Tab label="Trips" value="trips" />
          </Tabs>
          {selectedView === 'stations' && (
            <MetroLineStations
              lineId={selectedLineId}
              onBack={handleBackToGrid}
              onStationChanged={handleStationsChanged}
              onStationSelect={() => {}}
            />
          )}
          {selectedView === 'trips' && (
            <MetroLineTripsGrid lineId={selectedLineId} />
          )}
        </Box>
      )}
    </div>
  );
};

export default MetroLineGrid;