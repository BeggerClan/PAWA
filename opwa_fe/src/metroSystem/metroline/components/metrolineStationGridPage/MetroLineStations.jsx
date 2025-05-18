import React, { useEffect, useState } from "react";
import { getStationsForLine, deleteStationFromLine } from "../../../services/metroLineApi";
import { getSuspensionsForLine, removeStationFromSuspension } from "../../../services/suspensionApi";
import AddStationDialog from "./AddStationDialog";
import SuspendStationDialog from "./SuspendStationDialog";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
  Button, IconButton, Stack, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const MetroLineStations = ({ lineId, onBack, onStationChanged, onStationSelect }) => {
  if (!lineId) return null;
  const [stations, setStations] = useState([]);
  const [suspensions, setSuspensions] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stationToDelete, setStationToDelete] = useState(null);

  useEffect(() => {
    if (!lineId) return;
    fetchStations();
    fetchSuspensions();
    // eslint-disable-next-line
  }, [lineId]);

  const fetchStations = async () => {
    const res = await getStationsForLine(lineId);
    setStations(res.data);
  };

  const fetchSuspensions = async () => {
    const res = await getSuspensionsForLine(lineId);
    setSuspensions(res.data || []);
  };

  const handleAdd = () => setAddOpen(true);

  const handleSuspend = (station) => {
    setSelectedStation(station);
    setSuspendOpen(true);
  };

  const handleDeleteClick = (station) => {
    setStationToDelete(station);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (stationToDelete) {
      const res = await deleteStationFromLine(lineId, stationToDelete.stationId);
      console.log('Delete response:', res);
      fetchStations();
      if (onStationChanged) {
        console.log('Calling onStationChanged after delete');
        onStationChanged();
      }
      setDeleteDialogOpen(false);
      setStationToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setStationToDelete(null);
  };

  // Refresh grid after dialog actions
  const handleRefresh = () => {
    fetchStations();
    fetchSuspensions();
    if (onStationChanged) onStationChanged();
  };

  // Helper: find active suspension for a station
  const getActiveSuspensionForStation = (stationId) => {
    return suspensions.find(
      s => s.active && Array.isArray(s.affectedStationIds) && s.affectedStationIds.includes(stationId)
    );
  };

  // Handler to remove station from a suspension
  const handleRemoveStationFromSuspension = async (stationId) => {
    const suspension = getActiveSuspensionForStation(stationId);
    if (suspension) {
      await removeStationFromSuspension(suspension.id || suspension.suspensionId, stationId);
      handleRefresh();
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <Button variant="outlined" onClick={onBack} sx={{ mb: 2 }}>
        Back
      </Button>
      <Typography variant="h5" gutterBottom>
        Stations for Metro Line {lineId}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
        Add Station
      </Button>
      <TableContainer component={Paper}>
        <Table size="small" sx={{ border: 1, borderColor: 'divider' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Station ID</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Station Name</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Latitude</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Longitude</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Suspended</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }}>Suspension Reason</TableCell>
              <TableCell sx={{ border: 1, borderColor: 'divider' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stations.length > 0 ? (
              stations.map(station => {
                const suspension = getActiveSuspensionForStation(station.stationId);
                return (
                  <TableRow key={station.stationId} hover>
                    <TableCell sx={{ border: 1, borderColor: 'divider' }}>{station.stationId}</TableCell>
                    <TableCell
                      sx={{ border: 1, borderColor: 'divider', cursor: 'pointer', color: '#1976d2', fontWeight: 500 }}
                      onClick={() => onStationSelect && onStationSelect(station)}
                    >
                      {station.stationName}
                    </TableCell>
                    <TableCell sx={{ border: 1, borderColor: 'divider' }}>{station.latitude}</TableCell>
                    <TableCell sx={{ border: 1, borderColor: 'divider' }}>{station.longitude}</TableCell>
                    <TableCell sx={{ border: 1, borderColor: 'divider' }}>{suspension ? "Yes" : "No"}</TableCell>
                    <TableCell sx={{ border: 1, borderColor: 'divider' }}>{suspension ? suspension.reason : "-"}</TableCell>
                    <TableCell sx={{ border: 1, borderColor: 'divider' }} align="center">
                      <Stack direction="column" spacing={0.5} alignItems="center">
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(station)} title="Delete">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="warning" onClick={() => handleSuspend(station)} title="Suspend">
                          <PauseCircleIcon fontSize="small" />
                        </IconButton>
                        {suspension && (
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleRemoveStationFromSuspension(station.stationId)}
                            title="Remove Suspension for this Station"
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell sx={{ border: 1, borderColor: 'divider' }} colSpan={7}>No stations found for this line.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <AddStationDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        lineId={lineId}
        existingStations={stations}
        onStationAdded={() => {
          handleRefresh();
          if (onStationChanged) onStationChanged();
        }}
      />
      <SuspendStationDialog
        open={suspendOpen}
        onClose={() => setSuspendOpen(false)}
        lineId={lineId}
        station={selectedStation}
        onSuspended={handleRefresh}
      />
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to remove station <b>{stationToDelete?.stationName}</b> from this metro line?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MetroLineStations;