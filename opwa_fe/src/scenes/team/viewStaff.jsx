import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "./teamapi";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";

const ViewStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserById(id)
      .then(setUser)
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Typography color="error">User not found.</Typography>;
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600, margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom>
        Staff Details
      </Typography>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <b>Email</b>
            </TableCell>
            <TableCell>{user.email}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <b>First Name</b>
            </TableCell>
            <TableCell>{user.firstName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <b>Middle Name</b>
            </TableCell>
            <TableCell>{user.middleName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <b>Last Name</b>
            </TableCell>
            <TableCell>{user.lastName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <b>National ID</b>
            </TableCell>
            <TableCell>{user.nationalId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <b>Date of Birth</b>
            </TableCell>
            <TableCell>{user.dateOfBirth}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <b>Phone</b>
            </TableCell>
            <TableCell>{user.phone}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <b>Role</b>
            </TableCell>
            <TableCell>{user.role}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <b>Employed</b>
            </TableCell>
            <TableCell>{user.employed ? "Yes" : "No"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <b>Shift</b>
            </TableCell>
            <TableCell>{user.shift}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <b>Address</b>
            </TableCell>
            <TableCell>
              {user.addressNumber} {user.street}, {user.ward}, {user.district},{" "}
              {user.city}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard/team")}
        >
          Back to Team
        </Button>
      </Box>
    </Paper>
  );
};

export default ViewStaff;
