import React, { useEffect, useState } from "react";
import { getAllStations } from "../../../services/stationApi";
import { addStationToLine } from "../../../services/metroLineApi";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";

const AddStationDialog = ({ open, onClose, lineId, existingStations, onStationAdded }) => {
  const [allStations, setAllStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState("");

  useEffect(() => {
    if (open) {
      getAllStations().then(res => setAllStations(res.data));
      setSelectedStationId("");
    }
  }, [open]);

  const availableStations = allStations.filter(
    s => !existingStations.some(ls => ls.stationId === s.stationId)
  );

  const handleAdd = async () => {
    if (selectedStationId) {
      await addStationToLine(lineId, { stationId: selectedStationId });
      onStationAdded();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Station</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel id="select-station-label">Select Station</InputLabel>
          <Select
            labelId="select-station-label"
            value={selectedStationId}
            label="Select Station"
            onChange={e => setSelectedStationId(e.target.value)}
          >
            {availableStations.map(station => (
              <MenuItem key={station.stationId} value={station.stationId}>
                {station.stationName} ({station.stationId})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} color="primary" disabled={!selectedStationId}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStationDialog;