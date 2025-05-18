import React, { useEffect, useState } from "react";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import { fetchBookingRecords } from "../../components/BarAPI";

const TICKET_TYPE_MAP = {
  DAILY: "Daily ticket",
  FREE: "Free ticket",
  MONTHLY_ADULT: "Monthly ticket (adult)",
  MONTHLY_STUDENT: "Monthly ticket (student)",
  ONE_WAY_4: "One-way (≤4 stations)",
  ONE_WAY_8: "One-way (≤8 stations)",
  ONE_WAY_UNL: "One-way (unlimited)",
  THREE_DAY: "Three-day ticket",
};

const Dashboard = () => {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingRecords()
      .then((data) => {
        // Bar chart: thống kê loại vé
        const countByType = {};
        Object.keys(TICKET_TYPE_MAP).forEach((key) => {
          countByType[TICKET_TYPE_MAP[key]] = 0;
        });
        data.forEach((item) => {
          const rawType = item.ticketTypeCode;
          if (TICKET_TYPE_MAP[rawType]) {
            const displayName = TICKET_TYPE_MAP[rawType];
            countByType[displayName] = (countByType[displayName] || 0) + 1;
          }
        });
        const barChartData = Object.entries(countByType).map(
          ([type, count]) => ({
            ticketType: type,
            count,
          })
        );
        setBarData(barChartData);

        // Pie chart: thống kê trạng thái vé
        const countByStatus = {};
        data.forEach((item) => {
          const status = item.status || "UNKNOWN";
          countByStatus[status] = (countByStatus[status] || 0) + 1;
        });
        const pieChartData = Object.entries(countByStatus).map(
          ([status, value]) => ({
            id: status,
            label: status,
            value,
          })
        );
        setPieData(pieChartData);
      })
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>
    );

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>Dashboard</h2>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div
          style={{
            flex: "1 1 400px",
            minWidth: "350px",
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px #0001",
            padding: 24,
          }}
        >
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            Ticket Type Statistics
          </h3>
          <BarChart
            data={barData}
            keys={["count"]}
            indexBy="ticketType"
            axisBottomLegend="Ticket Type"
            axisLeftLegend="Quantity"
          />
        </div>
        <div
          style={{
            flex: "1 1 400px",
            minWidth: "350px",
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px #0001",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            Ticket Status Distribution
          </h3>
          <div style={{ width: "100%", height: "400px" }}>
            <PieChart data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
