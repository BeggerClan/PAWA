import React, { useEffect, useState } from "react";
import { getStationsForLine } from "../../services/metroLineApi";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography } from "@mui/material";

const MetroLineStations = ({ lineId, onBack }) => {
  const [stations, setStations] = useState([]);
  const [lineName, setLineName] = useState("");

  useEffect(() => {
    const fetchStations = async () => {
      const res = await getStationsForLine(lineId);
      setStations(res.data);
    };
    fetchStations();
  }, [lineId]);

  return (
    <div style={{ padding: 32 }}>
      <Button variant="outlined" onClick={onBack} style={{ marginBottom: 16 }}>
        Back
      </Button>
      <Typography variant="h5" gutterBottom>
        Stations for Metro Line {lineId}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Station ID</TableCell>
              <TableCell>Station Name</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stations.length > 0 ? (
              stations.map(station => (
                <TableRow key={station.stationId}>
                  <TableCell>{station.stationId}</TableCell>
                  <TableCell>{station.stationName}</TableCell>
                  <TableCell>{station.latitude}</TableCell>
                  <TableCell>{station.longitude}</TableCell>
                  <TableCell>
                    {station.createdAt ? new Date(station.createdAt).toLocaleString() : ""}
                  </TableCell>
                  <TableCell>
                    {station.updatedAt ? new Date(station.updatedAt).toLocaleString() : ""}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>No stations found for this line.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MetroLineStations;