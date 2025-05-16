import React from "react";

const AuthLayout = ({ children, rightImage, rightAlt }) => (
  <div
    style={{
      display: "flex",
      overflow: "hidden",
      minHeight: "100vh",
    }}
  >
    {/* Left Side - Form */}
    <div
      style={{
        width: "30vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: 800, width: "100%" }}>{children}</div>
    </div>

    {/* Right Side - Image */}
    <div
      style={{
        width: "50vw",
        height: "100vh",
        backgroundImage: `url('${rightImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "brightness(0.9) contrast(1.1)",
      }}
      aria-label={rightAlt}
    ></div>
  </div>
);

export default AuthLayout;