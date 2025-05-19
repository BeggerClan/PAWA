import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";
import { getAllStations } from "../../services/stationApi";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";

// All markers will be orange
const markerColor = "#e67e22";

const createReactIcon = () =>
  L.divIcon({
    html: renderToStaticMarkup(
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FaMapMarkerAlt color={markerColor} size={40} style={{ filter: "drop-shadow(0 2px 2px #0002)" }} />
        <span
          style={{
            display: "block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#222"
          }}
        />
      </div>
    ),
    className: "",
    iconSize: [40, 50],
    iconAnchor: [20, 44],
    popupAnchor: [0, -44]
  });

// max bounds for Ho Chi Minh City area
const maxBounds = [
  [10.5, 106.3], // Southwest corner
  [11.2, 107.1]  // Northeast corner
];

const StationMapView = ({ selectedStationIds = [], onResetSelection, showResetButton }) => {
  const [stations, setStations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllStations()
      .then(res => {
        setStations(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Failed to fetch station data. Please try again later.");
      });
  }, []);

  // Show only selected stations if any, else all
  const displayedStations =
    selectedStationIds.length > 0
      ? stations.filter(st => selectedStationIds.includes(st.stationId))
      : stations;

  // Center map on first station or default location
  const firstStation = displayedStations[0];
  const center = firstStation
    ? [firstStation.latitude, firstStation.longitude]
    : [10.7769, 106.7009];

  return (
    <div style={{ position: "relative" }}>
      {error && (
        <Alert severity="error" sx={{ position: "absolute", top: 20, left: 20, zIndex: 3000, width: 320 }}>
          {error}
        </Alert>
      )}
      {/* Reset button appears only when some (but not all/none) are selected, at bottom left */}
      {showResetButton && (
        <Tooltip title="Show all stations">
          <IconButton
            onClick={onResetSelection}
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              zIndex: 2000,
              background: "#fff",
              border: "2px solid #1976d2",
              color: "#1976d2",
              boxShadow: "0 2px 8px #0002"
            }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      )}
      <MapContainer
        center={center}
        zoom={13}
        minZoom={12}
        maxZoom={17}
        style={{ height: "70vh", width: "100%" }}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {displayedStations.map(station => (
          <Marker
            key={station.stationId}
            position={[station.latitude, station.longitude]}
            icon={createReactIcon()}
          >
            <Popup>
              <b>{station.stationName}</b>
              <br />
              Latitude: {station.latitude}
              <br />
              Longitude: {station.longitude}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default StationMapView;