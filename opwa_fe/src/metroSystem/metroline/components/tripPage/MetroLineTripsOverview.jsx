import React, { useEffect, useState } from "react";
import { getAllTrips, getAllMetroLines, getAllStations } from "../../../services/metroLineApi";

const formatTime = (time) => (time ? time : "-");

const MetroLineTripsOverview = () => {
  const [tripsByLine, setTripsByLine] = useState({});
  const [lines, setLines] = useState([]);
  const [stations, setStations] = useState([]);
  const [stationMap, setStationMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tripsRes, linesRes, stationsRes] = await Promise.all([
          getAllTrips(),
          getAllMetroLines(),
          getAllStations(),
        ]);
        const trips = tripsRes.data;
        const lines = linesRes.data;
        const stations = stationsRes.data;
        setLines(lines);
        setStations(stations);
        // Map stationId to stationName
        const map = {};
        stations.forEach((s) => {
          map[s.stationId] = s.stationName;
        });
        setStationMap(map);
        // Group trips by lineId
        const grouped = {};
        trips.forEach((trip) => {
          if (!grouped[trip.lineId]) grouped[trip.lineId] = [];
          grouped[trip.lineId].push(trip);
        });
        // Sort trips for each line by departure time
        Object.keys(grouped).forEach((lineId) => {
          grouped[lineId].sort((a, b) =>
            a.departureTime.localeCompare(b.departureTime)
          );
        });
        setTripsByLine(grouped);
      } catch (err) {
        setError("Failed to load trips, lines, or stations");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading trips overview...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // Helper to render a trip's route as station names and IDs
  const renderRoute = (segments) => {
    if (!segments || segments.length === 0) return "-";
    const stops = [segments[0].fromStationId, ...segments.map(seg => seg.toStationId)];
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {stops.map((sid, idx) => (
          <span key={sid} style={{
            background: "#f1f2f6",
            borderRadius: 4,
            padding: "2px 8px",
            fontSize: 13,
            color: "#222"
          }}>
            {stationMap[sid] || sid} <span style={{ color: "#888", fontSize: 11 }}>({sid})</span>
            {idx < stops.length - 1 && <span style={{ margin: "0 4px", color: "#2d98da" }}>→</span>}
          </span>
        ))}
      </div>
    );
  };

  // Helper to render a table for a set of trips
  const renderTripTable = (trips, label) => (
    <div style={{ width: "100%", marginBottom: 24 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fafcff", border: "2px solid #2d98da" }}>
          <thead>
            <tr style={{ background: "#f1f2f6" }}>
              <th style={{ padding: 8, fontWeight: 500, border: "1.5px solid #2d98da" }}>Trip ID</th>
              <th style={{ padding: 8, fontWeight: 500, border: "1.5px solid #2d98da" }}>Departure</th>
              <th style={{ padding: 8, fontWeight: 500, border: "1.5px solid #2d98da" }}>Arrival</th>
              <th style={{ padding: 8, fontWeight: 500, border: "1.5px solid #2d98da" }}>Route</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.tripId} style={{ borderBottom: "2px solid #2d98da" }}>
                <td style={{ padding: 8, border: "1.5px solid #2d98da" }}>{trip.tripId}</td>
                <td style={{ padding: 8, border: "1.5px solid #2d98da" }}>{formatTime(trip.departureTime)}</td>
                <td style={{ padding: 8, border: "1.5px solid #2d98da" }}>{formatTime(trip.arrivalTime)}</td>
                <td style={{ padding: 8, border: "1.5px solid #2d98da" }}>{renderRoute(trip.segments)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 2px 12px #e1e1e1" }}>
      <h2 style={{ marginBottom: 32, color: "#2d98da" }}>Metro Line Trips Overview</h2>
      {lines.map((line) => {
        const trips = tripsByLine[line.lineId] || [];
        if (trips.length === 0) return null;
        // Separate forward and return trips
        const forwardTrips = trips.filter(trip => !trip.returnTrip);
        const returnTrips = trips.filter(trip => trip.returnTrip);
        const first2Forward = forwardTrips.slice(0, 2);
        const last2Forward = forwardTrips.slice(-2);
        const first2Return = returnTrips.slice(0, 2);
        const last2Return = returnTrips.slice(-2);
        return (
          <div key={line.lineId} style={{ marginBottom: 40 }}>
            <h3 style={{ color: "#222", marginBottom: 12 }}>{line.lineName} <span style={{ color: "#888", fontWeight: 400 }}>({line.lineId})</span></h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
              {renderTripTable(first2Forward, "First 2 Forward Trips")}
              {renderTripTable(last2Forward, "Last 2 Forward Trips")}
              {renderTripTable(first2Return, "First 2 Return Trips")}
              {renderTripTable(last2Return, "Last 2 Return Trips")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetroLineTripsOverview; 