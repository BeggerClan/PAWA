import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const roles = [
  { value: "TICKET", label: "Ticket Agent" },
  { value: "ADMIN", label: "Admin" },
  { value: "OPERATOR", label: "Operator" },
];

const UpdateStaff = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    changePassword: "",
    token: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace alert with actual backend API for updating staff
    alert(JSON.stringify(form, null, 2));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="90vh"
      bgcolor="#f4f6f8"
      p={2}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 420,
          borderRadius: 3,
          backgroundColor: "white",
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mb: 2 }}
          onClick={() => navigate("/dashboard/team")}
        >
          Back
        </Button>

        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Update Staff
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.3, fontWeight: "bold", borderRadius: 2 }}
          >
            Update Staff
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default UpdateStaff;
