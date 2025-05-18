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
    setFormData({
      ...formData,
      [name]: value
    });
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
          label="First Departure"
          type="date"
          fullWidth
          variant="standard"
          InputLabelProps={{ shrink: true }}
          value={formData.firstDeparture}
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