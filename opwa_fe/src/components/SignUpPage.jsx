import React, { useState } from "react";
import { signUp } from "../services/authService";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

const SignUpPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await signUp(form);
      setSuccess("User registered successfully!");
    } catch (err) {
      setError("Registration failed.");
    }
  };

  return (
    <AuthLayout
      rightImage="https://apicms.thestar.com.my/uploads/images/2023/07/12/2173520.jpg"
      rightAlt="Metroline"
    >
      <div className="text-center mb-4">
        <h2 className="fw-bold">Sign Up for OPWA</h2>
        <p className="text-muted">Create your account</p>
      </div>
      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}
      {success && (
        <div className="alert alert-success text-center">{success}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">First Name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="form-control form-control-lg"
            style={{ borderRadius: "5px", border: "1px solid #ced4da" }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Last Name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="form-control form-control-lg"
            style={{ borderRadius: "5px", border: "1px solid #ced4da" }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="form-control form-control-lg"
            style={{ borderRadius: "5px", border: "1px solid #ced4da" }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="form-control form-control-lg"
            style={{ borderRadius: "5px", border: "1px solid #ced4da" }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="form-control form-control-lg"
            style={{ borderRadius: "5px", border: "1px solid #ced4da" }}
          >
            <option value="USER">User</option>
            <option value="OPERATOR">Operator</option>
            <option value="TICKET_AGENT">Ticket Agent</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-lg w-100"
          style={{
            borderRadius: "5px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            fontSize: "1.2rem",
          }}
        >
          Sign Up
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        Already have an account? <Link to="/">Login</Link>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;