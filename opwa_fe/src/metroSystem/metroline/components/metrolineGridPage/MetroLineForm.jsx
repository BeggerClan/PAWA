import React, { useEffect, useState } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField
} from "@mui/material";

const MetroLineForm = ({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
  affectedStations,
  setAffectedStations,
  lineStations,
  isEdit
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'firstDeparture') {
      // If we have an existing date, preserve it and only update the time
      const existingDate = formData.firstDeparture ? new Date(formData.firstDeparture) : new Date();
      const [hours, minutes] = value.split(':');
      existingDate.setHours(parseInt(hours, 10));
      existingDate.setMinutes(parseInt(minutes, 10));
      setFormData({
        ...formData,
        [name]: existingDate.toISOString()
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEdit ? 'Edit Metro Line' : 'Create Metro Line'}</DialogTitle>
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
          label="First Departure Time"
          type="time"
          fullWidth
          variant="standard"
          InputLabelProps={{ shrink: true }}
          value={formData.firstDeparture ? new Date(formData.firstDeparture).toTimeString().slice(0, 5) : ''}
          onChange={handleInputChange}
        />
        {/* Suspension controls removed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} color="primary">
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MetroLineForm;