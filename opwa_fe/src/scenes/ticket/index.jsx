import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";

// Mock ticket types (would be fetched from PAWA system)
const ticketTypes = [
  { value: "DAILY", label: "Daily Ticket", price: 40000 },
  { value: "WEEKLY", label: "Weekly Ticket", price: 200000 },
  { value: "MONTHLY", label: "Monthly Ticket", price: 600000 },
  { value: "STUDENT", label: "Student Ticket", price: 300000 },
  { value: "SENIOR", label: "Senior Ticket", price: 250000 },
  { value: "TOURIST", label: "Tourist Ticket", price: 100000 },
];

const paymentMethods = [
  { value: "ewallet", label: "e-Wallet (Registered Passenger Only)" },
  { value: "cash", label: "Cash" },
];

const TicketPurchase = () => {
  const [form, setForm] = useState({
    idType: "national", // 'national' or 'passenger'
    nationalId: "",
    passengerId: "",
    ticketType: "",
    paymentMethod: "cash",
    cashReceived: "",
  });

  // Get selected ticket price
  const selectedTicket = ticketTypes.find((t) => t.value === form.ticketType);
  const ticketPrice = selectedTicket ? selectedTicket.price : 0;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIdTypeChange = (e) => {
    setForm({
      ...form,
      idType: e.target.value,
      nationalId: "",
      passengerId: "",
      paymentMethod: e.target.value === "national" ? "cash" : "ewallet",
      cashReceived: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send purchase data to backend
    alert("Ticket purchased!\n" + JSON.stringify(form, null, 2));
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
        p: 0,
        m: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          py: 6,
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Ticket Purchase
        </Typography>
        <Divider sx={{ mb: 3, width: "100%" }} />
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 600,
            mx: "auto",
            background: "white",
            p: 4,
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <FormLabel component="legend" sx={{ mb: 1 }}>
            Passenger Type
          </FormLabel>
          <RadioGroup
            row
            value={form.idType}
            onChange={handleIdTypeChange}
            sx={{ mb: 2 }}
          >
            <FormControlLabel
              value="national"
              control={<Radio />}
              label="Guest (National ID)"
            />
            <FormControlLabel
              value="passenger"
              control={<Radio />}
              label="Registered Passenger (Passenger ID)"
            />
          </RadioGroup>

          {form.idType === "national" ? (
            <TextField
              fullWidth
              margin="normal"
              label="National ID"
              name="nationalId"
              value={form.nationalId}
              onChange={handleChange}
              required
            />
          ) : (
            <TextField
              fullWidth
              margin="normal"
              label="Passenger ID"
              name="passengerId"
              value={form.passengerId}
              onChange={handleChange}
              required
            />
          )}

          <TextField
            select
            fullWidth
            margin="normal"
            label="Ticket Type"
            name="ticketType"
            value={form.ticketType}
            onChange={handleChange}
            required
          >
            {ticketTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label} ({option.price.toLocaleString()} VND)
              </MenuItem>
            ))}
          </TextField>

          <Typography sx={{ mt: 1, mb: 2 }}>
            <b>Ticket Price:</b>{" "}
            {ticketPrice ? ticketPrice.toLocaleString() + " VND" : "--"}
          </Typography>

          <TextField
            select
            fullWidth
            margin="normal"
            label="Payment Method"
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            required
            disabled={form.idType === "national"}
          >
            {paymentMethods
              .filter((m) =>
                form.idType === "national" ? m.value === "cash" : true
              )
              .map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
          </TextField>

          {form.paymentMethod === "cash" && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Cash Received (VND)"
                name="cashReceived"
                type="number"
                value={form.cashReceived}
                onChange={handleChange}
                required
                inputProps={{ min: ticketPrice }}
              />
              <Typography sx={{ mt: 1 }}>
                <b>Change:</b>{" "}
                {form.cashReceived
                  ? (parseInt(form.cashReceived, 10) >= ticketPrice
                      ? (
                          parseInt(form.cashReceived, 10) - ticketPrice
                        ).toLocaleString()
                      : "0") + " VND"
                  : "--"}
              </Typography>
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.3, fontWeight: "bold", borderRadius: 2 }}
            disabled={
              !form.ticketType ||
              (form.idType === "national" && !form.nationalId) ||
              (form.idType === "passenger" && !form.passengerId) ||
              (form.paymentMethod === "cash" &&
                (!form.cashReceived ||
                  parseInt(form.cashReceived, 10) < ticketPrice))
            }
          >
            Purchase Ticket
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketPurchase;
