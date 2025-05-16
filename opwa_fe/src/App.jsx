// App.jsx
import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import AppRoutes from "./routes/AppRoutes";
import Topbar from "./scenes/global/Topbar";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import MetroLineGrid from "./metroline/MetroLineGrid.jsx";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/loginpage";
import MetroLineStations from "./metroline/MetroLineStations";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/metro-lines/:id/stations" element={<MetroLineStations />} />
            </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
    
  );
}

export default App;
