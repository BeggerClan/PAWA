import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "./teamapi";

const roles = [
  { value: "ADMIN", label: "Admin" },
  { value: "OPERATOR", label: "Operator" },
  { value: "TICKET", label: "Ticket Agent" },
];

const shifts = [
  { value: "DAY", label: "Day" },
  { value: "EVENING", label: "Evening" },
  { value: "NIGHT", label: "Night" },
];

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  middleName: yup.string(),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string(),
  nationalId: yup.string().required("Required"),
  dateOfBirth: yup.string().required("Required"),
  addressNumber: yup.string().required("Required"),
  street: yup.string().required("Required"),
  ward: yup.string().required("Required"),
  district: yup.string().required("Required"),
  city: yup.string().required("Required"),
  phone: yup.string().required("Required"),
  employed: yup.boolean().required("Required"),
  role: yup
    .string()
    .oneOf(["ADMIN", "OPERATOR", "TICKET"])
    .required("Required"),
  shift: yup.string().oneOf(["DAY", "EVENING", "NIGHT"]).required("Required"),
});

export default function UpdateStaff() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserById(id)
      .then((user) => {
        setInitialValues({
          firstName: user.firstName || "",
          middleName: user.middleName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          password: "", // Leave blank for security
          nationalId: user.nationalId || "",
          dateOfBirth: user.dateOfBirth || "",
          addressNumber: user.addressNumber || "",
          street: user.street || "",
          ward: user.ward || "",
          district: user.district || "",
          city: user.city || "",
          phone: user.phone || "",
          employed: user.employed ?? true,
          role: user.role || "",
          shift: user.shift || "",
        });
      })
      .catch(() => alert("Failed to load user"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      await updateUser(id, values);
      alert("Staff updated successfully!");
      navigate("/dashboard/team");
    } catch (error) {
      alert(error.message || "Failed to update staff");
      setSubmitting(false);
    }
  };

  if (loading || !initialValues) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5" mb={3}>
        Update Staff
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!touched.firstName && !!errors.firstName}
              helperText={touched.firstName && errors.firstName}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Middle Name"
              name="middleName"
              value={values.middleName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!touched.middleName && !!errors.middleName}
              helperText={touched.middleName && errors.middleName}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!touched.lastName && !!errors.lastName}
              helperText={touched.lastName && errors.lastName}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              type="password"
              error={!!touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              margin="normal"
            />
            <TextField
              fullWidth
              label="National ID"
              name="nationalId"
              value={values.nationalId}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!touched.nationalId && !!errors.nationalId}
              helperText={touched.nationalId && errors.nationalId}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              value={values.dateOfBirth}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!touched.dateOfBirth && !!errors.dateOfBirth}
              helperText={touched.dateOfBirth && errors.dateOfBirth}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Address Number"
              name="addressNumber"
              value={values.addressNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!touched.addressNumber && !!errors.addressNumber}
              helperText={touched.addressNumber && errors.addressNumber}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Street"
              name="street"
              value={values.street}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!touched.street && !!errors.street}
              helperText={touched.street && errors.street}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Ward"
              name="ward"
              value={values.ward}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!touched.ward && !!errors.ward}
              helperText={touched.ward && errors.ward}
              margin="normal"
            />
            <TextField
              fullWidth
              label="District"
              name="district"
              value={values.district}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!touched.district && !!errors.district}
              helperText={touched.district && errors.district}
              margin="normal"
            />
            <TextField
              fullWidth
              label="City"
              name="city"
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!touched.city && !!errors.city}
              helperText={touched.city && errors.city}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!touched.phone && !!errors.phone}
              helperText={touched.phone && errors.phone}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Role"
              name="role"
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!touched.role && !!errors.role}
              helperText={touched.role && errors.role}
              margin="normal"
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Shift"
              name="shift"
              value={values.shift}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!touched.shift && !!errors.shift}
              helperText={touched.shift && errors.shift}
              margin="normal"
            >
              {shifts.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={values.employed}
                  onChange={(e) => setFieldValue("employed", e.target.checked)}
                  name="employed"
                  color="primary"
                />
              }
              label="Employed"
              sx={{ mt: 2 }}
            />
            <Box mt={3} textAlign="right">
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                Update
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}
