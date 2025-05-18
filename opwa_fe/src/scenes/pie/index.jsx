// pages/charts/Pie.tsx
import { Box } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import { useEffect, useState } from "react";
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

const Pie = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchBookingRecords().then((records) => {
      const countMap = {};

      records.forEach((item) => {
        const label = TICKET_TYPE_MAP[item.ticketTypeCode];
        if (label) {
          countMap[label] = (countMap[label] || 0) + 1;
        }
      });

      const pieData = Object.entries(countMap).map(([id, value]) => ({
        id,
        label: id,
        value,
      }));

      setData(pieData);
    });
  }, []);

  return (
    <Box m="20px">
      <Header title="Ticket Type Pie Chart" subtitle="Distribution by ticket type" />
      <Box height="700px" width="1000px">
        <PieChart data={data} />
      </Box>
    </Box>
  );
};

export default Pie;
