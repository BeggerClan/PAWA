import React, { useEffect, useState } from "react";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import { fetchBookingRecords } from "../../components/BarAPI";

// Bảng giá vé
const TICKET_TYPE_INFO = {
  DAILY: { displayName: "Daily ticket", price: 40000 },
  FREE: { displayName: "Free ticket", price: 0 },
  MONTHLY_ADULT: { displayName: "Monthly ticket (adult)", price: 300000 },
  MONTHLY_STUDENT: { displayName: "Monthly ticket (student)", price: 150000 },
  ONE_WAY_4: { displayName: "One-way (up to 4 stations)", price: 8000 },
  ONE_WAY_8: { displayName: "One-way (up to 8 stations)", price: 12000 },
  ONE_WAY_UNL: { displayName: "One-way (unlimited stations)", price: 20000 },
  THREE_DAY: { displayName: "Three-day ticket", price: 90000 },
};

const Dashboard = () => {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [ticketStats, setTicketStats] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingRecords()
      .then((data) => {
        // Thống kê số lượng từng loại vé
        const countByType = {};
        Object.keys(TICKET_TYPE_INFO).forEach((key) => {
          countByType[key] = 0;
        });
        data.forEach((item) => {
          const rawType = item.ticketTypeCode;
          if (TICKET_TYPE_INFO[rawType]) {
            countByType[rawType] = (countByType[rawType] || 0) + 1;
          }
        });

        // Chuẩn bị dữ liệu cho BarChart
        const barChartData = Object.entries(TICKET_TYPE_INFO).map(
          ([code, info]) => ({
            ticketType: info.displayName,
            count: countByType[code] || 0,
          })
        );
        setBarData(barChartData);

        // Chuẩn bị dữ liệu cho PieChart
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

        // Tính tổng số vé và tổng tiền từng loại
        let total = 0;
        let totalMoney = 0;
        const stats = Object.entries(TICKET_TYPE_INFO).map(([code, info]) => {
          const quantity = countByType[code] || 0;
          const money = quantity * info.price;
          total += quantity;
          totalMoney += money;
          return {
            code,
            displayName: info.displayName,
            price: info.price,
            quantity,
            money,
          };
        });
        setTicketStats(stats);
        setTotalTickets(total);
        setTotalRevenue(totalMoney);
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

      {/* Bảng tổng hợp doanh thu và số lượng vé */}
      <div
        style={{
          marginTop: "2.5rem",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px #0001",
          padding: 24,
          maxWidth: 900,
        }}
      >
        <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
          Ticket Sales Summary
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f4f6f8" }}>
              <th style={{ padding: 8, border: "1px solid #eee" }}>
                Ticket Type
              </th>
              <th style={{ padding: 8, border: "1px solid #eee" }}>
                Price (VND)
              </th>
              <th style={{ padding: 8, border: "1px solid #eee" }}>
                Quantity Sold
              </th>
              <th style={{ padding: 8, border: "1px solid #eee" }}>
                Total (VND)
              </th>
            </tr>
          </thead>
          <tbody>
            {ticketStats.map((row) => (
              <tr key={row.code}>
                <td style={{ padding: 8, border: "1px solid #eee" }}>
                  {row.displayName}
                </td>
                <td style={{ padding: 8, border: "1px solid #eee" }}>
                  {row.price.toLocaleString()}
                </td>
                <td style={{ padding: 8, border: "1px solid #eee" }}>
                  {row.quantity}
                </td>
                <td style={{ padding: 8, border: "1px solid #eee" }}>
                  {row.money.toLocaleString()}
                </td>
              </tr>
            ))}
            <tr style={{ fontWeight: "bold", background: "#f9fafb" }}>
              <td style={{ padding: 8, border: "1px solid #eee" }}>Total</td>
              <td style={{ padding: 8, border: "1px solid #eee" }}></td>
              <td style={{ padding: 8, border: "1px solid #eee" }}>
                {totalTickets}
              </td>
              <td style={{ padding: 8, border: "1px solid #eee" }}>
                {totalRevenue.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
