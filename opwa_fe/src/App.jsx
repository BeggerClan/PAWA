import React from "react";
import LoginPage from "./components/loginpage";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Dashboard from "./scenes/dashboard"; // Import your dashboard page

function DashboardLayout({ children }) {
  return (
    <div className="app">
      <Topbar />
      <main className="content" style={{ marginTop: 64 }}>
        {children}
      </main>
    </div>
  );
}

function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard/*"
              element={
                <DashboardLayout>
                  <Routes>
                    <Route index element={<Dashboard />} />
                  </Routes>
                </DashboardLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
