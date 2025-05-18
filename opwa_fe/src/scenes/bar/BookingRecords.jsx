import { useEffect, useState } from "react";
import { fetchBookingRecords } from "../../components/BarAPI";
import BarChart from "../../components/BarChart";

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

const BookingRecords = () => {
  const [records, setRecords] = useState([]);
  const [barData, setBarData] = useState([]);
  const [fromStationData, setFromStationData] = useState([]);
  const [toStationData, setToStationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingRecords()
      .then((data) => {
        setRecords(data);

        const countByType = {};
        Object.keys(TICKET_TYPE_MAP).forEach((key) => {
          countByType[TICKET_TYPE_MAP[key]] = 0;
        });

        const countByFromStation = {};
        const countByToStation = {};

        data.forEach((item) => {
          const rawType = item.ticketTypeCode;
          if (TICKET_TYPE_MAP[rawType]) {
            const displayName = TICKET_TYPE_MAP[rawType];
            countByType[displayName] = (countByType[displayName] || 0) + 1;
          }

          if (item.fromStation) {
            countByFromStation[item.fromStation] =
              (countByFromStation[item.fromStation] || 0) + 1;
          }

          if (item.toStation) {
            countByToStation[item.toStation] =
              (countByToStation[item.toStation] || 0) + 1;
          }
        });

        const chartData = Object.entries(countByType).map(([type, count]) => ({
          ticketType: type,
          count,
        }));

        const fromStationChart = Object.entries(countByFromStation).map(
          ([station, count]) => ({
            station,
            count,
          })
        );

        const toStationChart = Object.entries(countByToStation).map(
          ([station, count]) => ({
            station,
            count,
          })
        );

        setBarData(chartData);
        setFromStationData(fromStationChart);
        setToStationData(toStationChart);
      })
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "1rem",
          overflowX: "auto",
          padding: "1rem",
        }}
      >
        {/* Chart 1 */}
        <div style={{ flex: "1", minWidth: "400px", height: "400px" }}>
          <BarChart
            data={barData}
            keys={["count"]}
            indexBy="ticketType"
            axisBottomLegend="Ticket Type"
            axisLeftLegend="Quantity"
            axisBottom={{ tickRotation: 45 }} // thêm xoay nhãn
          />
        </div>

        {/* Chart 2 */}
        <div style={{ flex: "1", minWidth: "400px", height: "400px" }}>
          <BarChart
            data={fromStationData}
            keys={["count"]}
            indexBy="station"
            axisBottomLegend="From Station"
            axisLeftLegend="Boardings"
            axisBottom={{ tickRotation: 45 }} // thêm xoay nhãn
          />
        </div>

        {/* Chart 3 */}
        <div style={{ flex: "1", minWidth: "400px", height: "400px" }}>
          <BarChart
            data={toStationData}
            keys={["count"]}
            indexBy="station"
            axisBottomLegend="To Station"
            axisLeftLegend="Alightings"
            axisBottom={{ tickRotation: 45 }} // thêm xoay nhãn
          />
        </div>
      </div>
    </div>
  );
};

export default BookingRecords;
