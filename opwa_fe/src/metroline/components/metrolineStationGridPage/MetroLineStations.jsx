import React, { useEffect, useState } from "react";
import { getStationsForLine, deleteStationFromLine } from "../../../services/metroLineApi";
import AddStationDialog from "./AddStationDialog";
import EditStationDialog from "./EditStationDialog";
import SuspendStationDialog from "./SuspendStationDialog";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
  Button, IconButton, Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

const MetroLineStations = ({ lineId, onBack }) => {
  const [stations, setStations] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    fetchStations();
    // eslint-disable-next-line
  }, [lineId]);

  const fetchStations = async () => {
    const res = await getStationsForLine(lineId);
    setStations(res.data);
  };

  const handleAdd = () => setAddOpen(true);

  const handleEdit = (station) => {
    setSelectedStation(station);
    setEditOpen(true);
  };

  const handleSuspend = (station) => {
    setSelectedStation(station);
    setSuspendOpen(true);
  };

  const handleDelete = async (stationId) => {
    await deleteStationFromLine(lineId, stationId);
    fetchStations();
  };

  // Refresh grid after dialog actions
  const handleRefresh = () => fetchStations();

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
              <TableCell sx={{ border: 1, borderColor: 'divider' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stations.length > 0 ? (
              stations.map(station => (
                <TableRow key={station.stationId} hover>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }}>{station.stationId}</TableCell>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }}>{station.stationName}</TableCell>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }}>{station.latitude}</TableCell>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }}>{station.longitude}</TableCell>
                  <TableCell sx={{ border: 1, borderColor: 'divider' }} align="center">
                    <Stack direction="column" spacing={0.5} alignItems="center">
                      <IconButton size="small" onClick={() => handleEdit(station)} title="Edit">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(station.stationId)} title="Delete">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="warning" onClick={() => handleSuspend(station)} title="Suspend">
                        <PauseCircleIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell sx={{ border: 1, borderColor: 'divider' }} colSpan={5}>No stations found for this line.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogs */}
      <AddStationDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        lineId={lineId}
        existingStations={stations}
        onStationAdded={handleRefresh}
      />
      <EditStationDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        lineId={lineId}
        station={selectedStation}
        onStationUpdated={handleRefresh}
      />
      <SuspendStationDialog
        open={suspendOpen}
        onClose={() => setSuspendOpen(false)}
        lineId={lineId}
        station={selectedStation}
        onSuspended={handleRefresh}
      />
    </div>
  );
};

export default MetroLineStations;