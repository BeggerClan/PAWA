import React from "react";
import { createSuspension } from "../../../services/suspensionApi";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography
} from "@mui/material";

const SuspendStationDialog = ({ open, onClose, lineId, station, onSuspended }) => {
  const handleSuspend = async () => {
    await createSuspension({
      metroLineId: lineId,
      stationId: station.stationId,
      reason: "Suspended from UI"
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSuspend} color="warning">Suspend</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuspendStationDialog;