import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import LoginPage from "../scenes/login";
import Dashboard from "../scenes/dashboard";
import Topbar from "../scenes/global/Topbar";
import Sidebar from "../scenes/global/SideBar";
import Team from "../scenes/team";
import AddStaff from "../scenes/team/addStaff";
import UpdateStaff from "../scenes/team/updateStaff";
import TicketPurchase from "../scenes/ticket";
import Bar from "../scenes/bar";
import Pie from "../scenes/pie";
import Line from "../scenes/line";
import Geography from "../scenes/geography";
import ViewStaff from "../scenes/team/viewStaff";
import BookingRecords from "../scenes/bar/BookingRecords"; // Thêm dòng này


import Station from "../station"; // <-- add this import

import Metroline from "../metroline";
import ProtectedRoute from "./ProtectedRoute";


const SIDEBAR_WIDTH = 250;
const SIDEBAR_COLLAPSED_WIDTH = 80;
const TOPBAR_HEIGHT = 64;

function DashboardLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard"); // <-- add this

  const sidebarWidth = isSidebarCollapsed
    ? SIDEBAR_COLLAPSED_WIDTH
    : SIDEBAR_WIDTH;

  return (
    <>
      <Topbar isSidebarCollapsed={isSidebarCollapsed} />
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        selected={selected} // <-- pass down
        setSelected={setSelected} // <-- pass down
      />
      <Box
        sx={{
          marginLeft: `${sidebarWidth}px`,
          marginTop: `${TOPBAR_HEIGHT}px`,
          p: 2,
          transition: "margin-left 0.3s",
        }}
      >
        {children}
      </Box>
    </>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/dashboard/*"
        element={
          <DashboardLayout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="team" element={<Team />} />
              <Route path="team/addStaff" element={<AddStaff />} />
              <Route path="team/updateStaff/:id" element={<UpdateStaff />} />
              <Route path="ticket" element={<TicketPurchase />} />
              <Route path="bar" element={<Bar />} />
              <Route path="pie" element={<Pie />} />
           
              <Route path="geography" element={<Geography />} />
              <Route path="metroline" element={<Metroline />} />
              <Route path="station" element={<Station />} /> {/* <-- add this */}
              <Route path="team/view/:id" element={<ViewStaff />} />
              <Route path="booking-records" element={<BookingRecords />} />
               {/* <-- add this */}
              {/* <Route path="contacts" element={<Contacts />} /> */}
            </Routes>
          </DashboardLayout>
        }
      />
    </Routes>
  );
}
