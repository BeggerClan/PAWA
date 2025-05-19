import React, { useState, useEffect } from "react";
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
import Autocomplete from "@mui/material/Autocomplete";
import {
  fetchTicketPolicies,
  fetchPassengerIds,
  purchaseTicket,
  createTicket,
} from "./ticketAPI";

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
  const [ticketTypes, setTicketTypes] = useState([]);
  const [passengerIds, setPassengerIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy token từ localStorage
  const token = localStorage.getItem("token");

  // Lấy danh sách loại vé và passenger id
  useEffect(() => {
    async function fetchData() {
      try {
        const [tickets, passengers] = await Promise.all([
          fetchTicketPolicies(token),
          fetchPassengerIds(token),
        ]);
        setTicketTypes(
          tickets.map((t) => ({
            value: t.code,
            id: t.id, // hoặc t.ticketId nếu backend trả về tên này
            displayName: t.displayName,
            price: t.price,
          }))
        );
        setPassengerIds(passengers);
      } catch (err) {
        alert("Lỗi tải dữ liệu: " + err.message);
      }
    }
    fetchData();
  }, [token]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedTicket = ticketTypes.find(
        (t) => t.value === form.ticketType
      );

      // 1. Tạo vé trước
      const ticketCreateData = {
        ticketPolicyId: selectedTicket.id, // id của policy
        // các trường khác nếu cần, ví dụ:
        nationalId: form.idType === "national" ? form.nationalId : undefined,
        passengerId: form.idType === "passenger" ? form.passengerId : undefined,
      };
      const ticket = await createTicket(ticketCreateData, token);

      // 2. Thanh toán vé vừa tạo
      const paymentData = {
        ticketId: ticket.id || ticket._id, // id của vé vừa tạo
        paymentMethod: form.paymentMethod,
        amount: ticketPrice,
      };
      if (form.paymentMethod === "cash") {
        paymentData.cashReceived = form.cashReceived;
      }
      await purchaseTicket(paymentData, token);

      alert("Ticket purchased successfully!");
      setForm({
        idType: "national",
        nationalId: "",
        passengerId: "",
        ticketType: "",
        paymentMethod: "cash",
        cashReceived: "",
      });
    } catch (err) {
      alert("Mua vé thất bại: " + err.message);
    } finally {
      setLoading(false);
    }
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
            <Autocomplete
              options={passengerIds}
              value={
                passengerIds.find((p) => p.passengerId === form.passengerId) ||
                null
              }
              onChange={(_, value) =>
                setForm({
                  ...form,
                  passengerId: value ? value.passengerId : "",
                })
              }
              getOptionLabel={(option) =>
                typeof option === "string"
                  ? option
                  : `${option.name || ""} : ${option.passengerId || ""}`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Passenger ID"
                  margin="normal"
                  required
                />
              )}
              fullWidth
              isOptionEqualToValue={(option, value) =>
                (typeof option === "object" ? option.passengerId : option) ===
                (typeof value === "object" ? value.passengerId : value)
              }
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
                {option.displayName} ({option.price?.toLocaleString()} VND)
              </MenuItem>
            ))}
          </TextField>

          {/* Hiện giá tiền động khi chọn loại vé */}
          {form.ticketType && (
            <Typography sx={{ mt: 1, mb: 2 }}>
              <b>Ticket Price:</b>{" "}
              {ticketTypes
                .find((t) => t.value === form.ticketType)
                ?.price?.toLocaleString() || "--"}{" "}
              VND
            </Typography>
          )}

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
              loading ||
              !form.ticketType ||
              (form.idType === "national" && !form.nationalId) ||
              (form.idType === "passenger" && !form.passengerId) ||
              (form.paymentMethod === "cash" &&
                (!form.cashReceived ||
                  parseInt(form.cashReceived, 10) < ticketPrice))
            }
          >
            {loading ? "Processing..." : "Purchase Ticket"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketPurchase;
