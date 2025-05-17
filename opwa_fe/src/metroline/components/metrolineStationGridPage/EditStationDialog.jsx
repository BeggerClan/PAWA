import React, { useState, useEffect } from "react";
import { updateStationInLine } from "../../../services/metroLineApi";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField
} from "@mui/material";

const EditStationDialog = ({ open, onClose, lineId, station, onStationUpdated }) => {
  const [form, setForm] = useState(station || {});

  useEffect(() => {
    setForm(station || {});
  }, [station]);

  const handleSave = async () => {
    await updateStationInLine(lineId, station.stationId, form);
    onStationUpdated();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Station</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Station Name"
          fullWidth
          value={form.stationName || ""}
          onChange={e => setForm({ ...form, stationName: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Latitude"
          fullWidth
          value={form.latitude || ""}
          onChange={e => setForm({ ...form, latitude: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Longitude"
          fullWidth
          value={form.longitude || ""}
          onChange={e => setForm({ ...form, longitude: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStationDialog;