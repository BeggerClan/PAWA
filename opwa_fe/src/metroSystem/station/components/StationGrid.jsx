import React, { useEffect, useState } from "react";
import { getAllStations } from "../../services/stationApi";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";

const StationGrid = ({ onShowStation }) => {
  const [stations, setStations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllStations()
      .then(res => {
        if (Array.isArray(res.data)) {
          setStations(res.data);
          setError(null);
        } else {
          setStations([]);
          setError('Malformed station data received.');
        }
      })
      .catch(() => {
        setStations([]);
        setError('Failed to fetch stations. Please check your backend or network.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}><CircularProgress /></div>;
  if (error) return <div style={{ color: 'red', margin: 16 }}>{error}</div>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Station ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Latitude</TableCell>
            <TableCell>Longitude</TableCell>
            <TableCell>Marker</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stations.map(station => (
            <TableRow
              key={station.stationId}
              style={{ cursor: "pointer" }}
              onClick={() => onShowStation(station.stationId)}
            >
              <TableCell>{station.stationId}</TableCell>
              <TableCell>{station.stationName}</TableCell>
              <TableCell>{station.latitude}</TableCell>
              <TableCell>{station.longitude}</TableCell>
              <TableCell>{station.mapMarker}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StationGrid;