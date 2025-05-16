import React, { useEffect, useState } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField,
  FormControlLabel, Switch, Typography, MenuItem, Autocomplete
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

  const handleSuspensionChange = (e) => {
    const checked = e.target.checked;
    setFormData(f => ({
      ...f,
      isSuspended: checked,
      suspensionReason: checked ? f.suspensionReason : "",
      affectedStationIds: checked ? f.affectedStationIds : [],
    }));
    if (!checked) setAffectedStations([]);
  };

  const handleAffectedStationsChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setAffectedStations(selected);
    setFormData(f => ({
      ...f,
      affectedStationIds: selected
    }));
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

        {/* Suspension controls only visible when editing */}
        {isEdit && (
          <>
            <FormControlLabel
              control={
                <Switch
                  name="isSuspended"
                  checked={formData.isSuspended}
                  onChange={handleSuspensionChange}
                  color="warning"
                />
              }
              label="Suspended"
            />
            {formData.isSuspended && (
              <>
                <TextField
                  margin="dense"
                  name="suspensionReason"
                  label="Suspension Reason"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={formData.suspensionReason}
                  onChange={handleInputChange}
                />
                <Autocomplete
                  multiple
                  options={lineStations}
                  getOptionLabel={option => `${option.stationName} (${option.stationId})`}
                  value={lineStations.filter(station => affectedStations.includes(station.stationId))}
                  onChange={(_, value) => {
                    const selectedIds = value.map(station => station.stationId);
                    setAffectedStations(selectedIds);
                    setFormData(f => ({
                      ...f,
                      affectedStationIds: selectedIds
                    }));
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      margin="dense"
                      label="Affected Stations"
                      variant="standard"
                      helperText="Select affected stations"
                    />
                  )}
                  sx={{ mt: 2 }}
                />
                {affectedStations.length >= 3 && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    Metro line will be set to inactive because 3 or more stations are affected.
                  </Typography>
                )}
              </>
            )}
          </>
        )}
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