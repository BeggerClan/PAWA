import React, { useEffect, useState } from 'react';
import { getTripsForLine } from '../../../services/metroLineApi';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Pagination, Box } from '@mui/material';

const PAGE_SIZE = 10;

// Helper to format 'HH:mm:ss' as 'HH:mm', fallback to '-'
const formatTime = (time) => {
  if (!time) return '-';
  // If already a Date, format as time
  if (time instanceof Date) return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // If string in HH:mm:ss
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
    const [h, m] = time.split(":");
    return `${h}:${m}`;
  }
  // If ISO string
  const d = new Date(time);
  if (!isNaN(d)) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return '-';
};

const MetroLineTripsGrid = ({ lineId }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!lineId) return;
    setLoading(true);
    setError(null);
    setTrips([]);
    setPage(1);
    getTripsForLine(lineId)
      .then(res => {
        setTrips(res.data || []);
      })
      .catch(() => setError('Failed to fetch trips for this line.'))
      .finally(() => setLoading(false));
  }, [lineId]);

  const pagedTrips = trips.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageCount = Math.ceil(trips.length / PAGE_SIZE);

  // Helper to render a trip's route as station IDs
  const renderRoute = (segments) => {
    if (!segments || segments.length === 0) return '-';
    const stops = [segments[0].fromStationId, ...segments.map(seg => seg.toStationId)];
    return stops.join(' → ');
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ color: 'red', mt: 2 }}>{error}</Box>;
  if (!trips.length) return <Box sx={{ mt: 2 }}>No trips found for this line.</Box>;

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Trip ID</TableCell>
              <TableCell>Departure</TableCell>
              <TableCell>Arrival</TableCell>
              <TableCell>Route</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedTrips.map(trip => (
              <TableRow key={trip.tripId}>
                <TableCell>{trip.tripId}</TableCell>
                <TableCell>{formatTime(trip.departureTime)}</TableCell>
                <TableCell>{formatTime(trip.arrivalTime)}</TableCell>
                <TableCell>{renderRoute(trip.segments)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      )}
    </Box>
  );
};

export default MetroLineTripsGrid; 