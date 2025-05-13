// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import LoginPage from "../components/loginpage";
import Dashboard from "../scenes/dashboard";
import Topbar from "../scenes/global/Topbar";
import Sidebar from "../scenes/global/SideBar"; // Add this import

function DashboardLayout({ children }) {
  return (
    <div className="app" style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        <main className="content" style={{ marginTop: 64 }}>
          {children}
        </main>
      </div>
    </div>
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
              {/* Bạn có thể mở lại các routes dưới đây nếu đã tạo component tương ứng */}
              {/* <Route path="team" element={<Team />} /> */}
              {/* <Route path="contacts" element={<Contacts />} /> */}
            </Routes>
          </DashboardLayout>
        }
      />
    </Routes>
  );
}
