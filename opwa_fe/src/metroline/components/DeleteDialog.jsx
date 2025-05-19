import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const DeleteDialog = ({ open, onClose, onDelete, lineName }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      Are you sure you want to delete metro line "{lineName}"?
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onDelete} color="error">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteDialog;