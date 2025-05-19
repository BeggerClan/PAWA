import React from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { addUserPermitAll } from "./teamapi";

const roles = [
  { value: "ADMIN", label: "Admin" },
  { value: "OPERATOR", label: "Operator" },
  { value: "TICKET_AGENT", label: "Ticket Agent" },
];

const shifts = [
  { value: "DAY", label: "Day" },
  { value: "EVENING", label: "Evening" },
  { value: "NIGHT", label: "Night" },
];

const checkoutSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(
      /^[\p{L} .'-]{1,50}$/u,
      "First name must only contain letters and be max 50 characters"
    )
    .required("Required"),
  middleName: yup
    .string()
    .matches(
      /^[\p{L} .'-]{0,50}$/u,
      "Middle name must only contain letters and be max 50 characters"
    ),
  lastName: yup
    .string()
    .matches(
      /^[\p{L} .'-]{1,50}$/u,
      "Last name must only contain letters and be max 50 characters"
    )
    .required("Required"),
  email: yup
    .string()
    .email("Invalid email")
    .matches(/^[^\s@]+@[^\s@]+\.(com|vn)$/, "Email must end with .com or .vn")
    .required("Required"),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%]).{8,}$/,
      "Password must be at least 8 characters, include uppercase, lowercase, digit, and special character"
    )
    .required("Required"),
  nationalId: yup
    .string()
    .matches(/^\d{12}$/, "National ID must be exactly 12 digits")
    .required("Required"),
  dateOfBirth: yup
    .string()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Use 'dd/mm/yyyy' format")
    .required("Required"),
  addressNumber: yup
    .string()
    .matches(
      /^[\w\s,.-]{1,100}$/,
      "Address must not contain special symbols except , . -"
    )
    .required("Required"),
  street: yup
    .string()
    .matches(
      /^[\w\s,.-]{1,100}$/,
      "Street must not contain special symbols except , . -"
    )
    .required("Required"),
  ward: yup
    .string()
    .matches(
      /^[\w\s,.-]{1,100}$/,
      "Ward must not contain special symbols except , . -"
    )
    .required("Required"),
  district: yup
    .string()
    .matches(
      /^[\w\s,.-]{1,100}$/,
      "District must not contain special symbols except , . -"
    )
    .required("Required"),
  city: yup
    .string()
    .matches(
      /^[\w\s,.-]{1,100}$/,
      "City must not contain special symbols except , . -"
    )
    .required("Required"),
  phone: yup
    .string()
    .matches(/^0\d{9}$/, "Phone number must be 10 digits and start with 0")
    .required("Required"),
  employed: yup.boolean().required("Required"),
  role: yup
    .string()
    .oneOf(["ADMIN", "OPERATOR", "TICKET_AGENT"])
    .required("Required"),
  shift: yup.string().oneOf(["DAY", "EVENING", "NIGHT"]).required("Required"),
});

const initialValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  password: "",
  nationalId: "",
  dateOfBirth: "",
  addressNumber: "",
  street: "",
  ward: "",
  district: "",
  city: "",
  phone: "",
  employed: true,
  role: "",
  shift: "",
};

const AddStaff = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = { ...values, role: values.role, shift: values.shift };
      await addUserPermitAll(payload);
      alert("Staff created successfully!");
      resetForm();
      navigate("/");
    } catch (error) {
      alert(error.message || "Failed to create staff");
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#f4f6f8",
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
        <Header title="CREATE STAFF" subtitle="Create a New Staff Profile" />

        <Box
          sx={{
            width: { xs: "70%", md: "70%" },
            px: 4,
            background: "white",
            borderRadius: 3,
            boxShadow: 2,
            mx: "auto",
          }}
        >
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
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
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                    p: 0,
                    width: "100%",
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={!!touched.firstName && !!errors.firstName}
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Middle Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.middleName}
                    name="middleName"
                    error={!!touched.middleName && !!errors.middleName}
                    helperText={touched.middleName && errors.middleName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={!!touched.lastName && !!errors.lastName}
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="email"
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="password"
                    label="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="National ID"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.nationalId}
                    name="nationalId"
                    error={!!touched.nationalId && !!errors.nationalId}
                    helperText={touched.nationalId && errors.nationalId}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Date of Birth (dd/mm/yyyy)"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.dateOfBirth}
                    name="dateOfBirth"
                    error={!!touched.dateOfBirth && !!errors.dateOfBirth}
                    helperText={touched.dateOfBirth && errors.dateOfBirth}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Address Number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.addressNumber}
                    name="addressNumber"
                    error={!!touched.addressNumber && !!errors.addressNumber}
                    helperText={touched.addressNumber && errors.addressNumber}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Street"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.street}
                    name="street"
                    error={!!touched.street && !!errors.street}
                    helperText={touched.street && errors.street}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Ward"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.ward}
                    name="ward"
                    error={!!touched.ward && !!errors.ward}
                    helperText={touched.ward && errors.ward}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="District"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.district}
                    name="district"
                    error={!!touched.district && !!errors.district}
                    helperText={touched.district && errors.district}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="City"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.city}
                    name="city"
                    error={!!touched.city && !!errors.city}
                    helperText={touched.city && errors.city}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    name="phone"
                    error={!!touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    select
                    fullWidth
                    variant="filled"
                    label="Role"
                    name="role"
                    value={values.role}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.role && !!errors.role}
                    helperText={touched.role && errors.role}
                    sx={{ gridColumn: "span 2" }}
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
                    variant="filled"
                    label="Shift"
                    name="shift"
                    value={values.shift}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.shift && !!errors.shift}
                    helperText={touched.shift && errors.shift}
                    sx={{ gridColumn: "span 2" }}
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
                        onChange={(e) =>
                          setFieldValue("employed", e.target.checked)
                        }
                        name="employed"
                        color="primary"
                      />
                    }
                    label="Employed"
                    sx={{ gridColumn: "span 2" }}
                  />
                </Box>
                <Box display="flex" justifyContent="end" mt="20px">
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Create New Staff
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default AddStaff;
