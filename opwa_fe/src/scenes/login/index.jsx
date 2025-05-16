import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Hàm gọi API login
async function loginApi(email, password) {
  const response = await fetch("http://localhost:8081/api/v1/auth/authenticate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Invalid email or password");
  }

  return response.json();
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setError(""); // Clear error
      const data = await loginApi(email, password);

      // Ví dụ: lưu token vào localStorage nếu có
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: "flex", overflow: "hidden" }}>
      {/* Left Side - Login Form */}
      <div
        style={{
          width: "30vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 800, width: "100%" }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold">Welcome To OPWA</h2>
            <p className="text-muted">Please login to your account</p>
          </div>

          {error && <div className="alert alert-danger text-center">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email address
              </label>
              <input
                type="email"
                className="form-control form-control-lg"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{ borderRadius: "5px", border: "1px solid #ced4da" }}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">
                Password
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{ borderRadius: "5px", border: "1px solid #ced4da" }}
              />
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
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div
        style={{
          width: "50vw",
          height: "100vh",
          backgroundImage: `url('https://apicms.thestar.com.my/uploads/images/2023/07/12/2173520.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.9) contrast(1.1)",
        }}
      ></div>
    </div>
  );
};

export default LoginPage;
