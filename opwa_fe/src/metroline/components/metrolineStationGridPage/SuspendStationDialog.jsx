import React, { useState, useEffect } from "react";
import { createSuspension } from "../../../services/suspensionApi";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField
} from "@mui/material";

const SuspendStationDialog = ({ open, onClose, lineId, station, onSuspended }) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  const handleSuspend = async () => {
    await createSuspension({
      metroLineId: lineId,
      affectedStationIds: [station.stationId],
      reason: reason || "Suspended from UI"
    });
    onSuspended();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Suspend Station</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to suspend <b>{station?.stationName}</b> from this line?
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Reason for suspension"
          type="text"
          fullWidth
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSuspend} color="warning" disabled={!reason.trim()}>Suspend</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuspendStationDialog;