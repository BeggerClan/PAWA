import React, { useEffect, useState } from "react";
import { getAllTrips, getAllStations, getAllMetroLines } from "../../../services/metroLineApi";
import { Box, CircularProgress, Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip } from '@mui/material';
import "./AllTripsGridPage.css";

// Helper to format 'HH:mm:ss' as 'HH:mm', fallback to '-'
const formatTime = (time) => {
  if (!time) return '-';
  if (time instanceof Date) return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
    const [h, m] = time.split(":");
    return `${h}:${m}`;
  }
  const d = new Date(time);
  if (!isNaN(d)) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return '-';
};

const PAGE_SIZE = 10;

const AllTripsGridPage = ({ onVisibleLinesChange }) => {
  const [segments, setSegments] = useState([]);
  const [stationMap, setStationMap] = useState({});
  const [metroLines, setMetroLines] = useState([]); // All lines
  const [selectedLineIds, setSelectedLineIds] = useState([]); // Selected line IDs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tripsRes, stationsRes, linesRes] = await Promise.all([
          getAllTrips(),
          getAllStations(),
          getAllMetroLines(),
        ]);
        const stationMap = {};
        (stationsRes.data || []).forEach((s) => {
          stationMap[s.stationId] = s.stationName;
        });
        setStationMap(stationMap);
        setMetroLines(linesRes.data || []);
        // Flatten all segments from all trips
        const allSegments = [];
        (tripsRes.data || []).forEach(trip => {
          (trip.segments || []).forEach(segment => {
            allSegments.push({
              tripId: trip.tripId,
              lineId: trip.lineId,
              departureTime: segment.departureTime,
              arrivalTime: segment.arrivalTime,
              fromStationId: segment.fromStationId,
              toStationId: segment.toStationId,
              durationMinutes: segment.durationMinutes,
            });
          });
        });
        setSegments(allSegments);
        const allLineIds = (linesRes.data || []).map(l => l.lineId);
        setSelectedLineIds(allLineIds); // Default: all selected
        if (onVisibleLinesChange) onVisibleLinesChange(allLineIds);
      } catch (err) {
        setError("Failed to load trips or stations");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredSegments.length));
  };

  const handleLineFilterChange = (event) => {
    const value = event.target.value;
    const newSelected = typeof value === 'string' ? value.split(',') : value;
    setSelectedLineIds(newSelected);
    setVisibleCount(PAGE_SIZE); // Reset paging on filter change
    if (onVisibleLinesChange) onVisibleLinesChange(newSelected);
  };

  // Filter segments by selected lines
  const filteredSegments = segments.filter(seg => selectedLineIds.includes(seg.lineId));

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ color: 'red', mt: 2 }}>{error}</Box>;

  return (
    <Box sx={{ background: '#fff', borderRadius: 3, p: 4, boxShadow: '0 2px 12px #e1e1e1', width: '100%', height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
      <h2 className="alltrips-title">All Metro Segments (Every 2-Station Travel)</h2>
      <FormControl sx={{ mb: 3, minWidth: 300, maxWidth: 500 }}>
        <InputLabel id="line-select-label">Filter by Metro Line</InputLabel>
        <Select
          labelId="line-select-label"
          multiple
          value={selectedLineIds}
          onChange={handleLineFilterChange}
          input={<OutlinedInput label="Filter by Metro Line" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((lineId) => {
                const line = metroLines.find(l => l.lineId === lineId);
                return <Chip key={lineId} label={line ? `${line.lineName} (${lineId})` : lineId} />;
              })}
            </Box>
          )}
        >
          {metroLines.map((line) => (
            <MenuItem key={line.lineId} value={line.lineId}>
              {line.lineName} ({line.lineId})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="alltrips-table-wrapper" style={{ width: '100%', margin: '0 auto', flex: 1, minWidth: 0 }}>
        <table className="alltrips-table">
          <thead>
            <tr className="alltrips-header-row">
              <th className="alltrips-header">Trip ID</th>
              <th className="alltrips-header">Line ID</th>
              <th className="alltrips-header">Departure</th>
              <th className="alltrips-header">Arrival</th>
              <th className="alltrips-header">From</th>
              <th className="alltrips-header">To</th>
              <th className="alltrips-header">Duration (min)</th>
            </tr>
          </thead>
          <tbody>
            {filteredSegments.slice(0, visibleCount).map((seg, index) => (
              <tr
                key={index}
                className={`alltrips-row${index % 2 === 0 ? " even" : " odd"}`}
              >
                <td className="alltrips-cell center">{seg.tripId}</td>
                <td className="alltrips-cell center">{seg.lineId}</td>
                <td className="alltrips-cell center">{formatTime(seg.departureTime)}</td>
                <td className="alltrips-cell center">{formatTime(seg.arrivalTime)}</td>
                <td className="alltrips-cell center">
                  <span className="alltrips-station-chip">
                    {stationMap[seg.fromStationId] || seg.fromStationId} <span className="alltrips-station-id">({seg.fromStationId})</span>
                  </span>
                </td>
                <td className="alltrips-cell center">
                  <span className="alltrips-station-chip">
                    {stationMap[seg.toStationId] || seg.toStationId} <span className="alltrips-station-id">({seg.toStationId})</span>
                  </span>
                </td>
                <td className="alltrips-cell center">{seg.durationMinutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleCount < filteredSegments.length && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleLoadMore}
          sx={{ mt: 2, fontWeight: 600, borderRadius: 2 }}
        >
          Load More
        </Button>
      )}
    </Box>
  );
};

export default AllTripsGridPage; 