import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAllMetroLines } from "../services/metroLineApi";
import RoomIcon from "@mui/icons-material/Room";
import { renderToStaticMarkup } from "react-dom/server";

// Map marker color mapping (customize as needed)
const markerColors = {
  red: "#e74c3c",
  blue: "#3498db",
  green: "#27ae60",
  orange: "#e67e22",
  purple: "#8e44ad",
  yellow: "#f1c40f",
  default: "#34495e"
};

// Helper to get color for a marker
const getColor = (marker) => markerColors[marker?.toLowerCase()] || markerColors.default;

// Custom icon generator for colored markers
const createIcon = (color) =>
  new L.Icon({
    iconUrl:
      "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" +
      color.replace("#", ""),
    iconSize: [21, 34],
    iconAnchor: [10, 34],
    popupAnchor: [0, -30]
  });

// Helper to create a colored Material UI icon as a Leaflet divIcon
const createMuiIcon = (color) =>
  L.divIcon({
    html: renderToStaticMarkup(
      <RoomIcon style={{ color: color, fontSize: 40, filter: "drop-shadow(0 2px 2px #0002)" }} />
    ),
    className: "", // Remove default styles
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

const MetroLineMapView = () => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    getAllMetroLines().then(res => setLines(res.data));
  }, []);

  // Center map on first station or default location
  const firstStation = lines[0]?.stations?.[0];
  const center = firstStation
    ? [firstStation.latitude, firstStation.longitude]
    : [10.7769, 106.7009]; // Default: Ho Chi Minh City

  return (
    <MapContainer center={center} zoom={13} style={{ height: "70vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {lines.map((line, idx) => {
        // Use the first station's mapMarker as the line color
        const lineColor = getColor(line.stations?.[0]?.mapMarker);
        const positions = line.stations?.map(st => [st.latitude, st.longitude]) || [];
        return (
          <React.Fragment key={line.lineId}>
            <Polyline positions={positions} color={lineColor} weight={5} />
            {line.stations?.map(station => (
              <Marker
                key={station.stationId}
                position={[station.latitude, station.longitude]}
                icon={createMuiIcon(getColor(station.mapMarker))}
              >
                <Popup>
                  <b>{station.stationName}</b>
                  <br />
                  Line: {line.lineName}
                  <br />
                  Marker: <span style={{ color: getColor(station.mapMarker) }}>{station.mapMarker}</span>
                </Popup>
              </Marker>
            ))}
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
};

export default MetroLineMapView;