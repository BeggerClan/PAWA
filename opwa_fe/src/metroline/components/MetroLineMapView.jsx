import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import { getAllMetroLines } from "../../services/metroLineApi";

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
const getColor = (marker) => markerColors[marker?.toLowerCase()] || markerColors.default;

const createReactIcon = (color) =>
  L.divIcon({
    html: renderToStaticMarkup(
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FaMapMarkerAlt color={color} size={40} style={{ filter: "drop-shadow(0 2px 2px #0002)" }} />
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

const MetroLineMapView = ({ selectedLineId }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    getAllMetroLines().then(res => setLines(res.data));
  }, []);

  // Filter lines if a line is selected
  const displayedLines = selectedLineId
    ? lines.filter(line => line.lineId === selectedLineId)
    : lines;

  // Prepare polylines
  const polylines = displayedLines.map(line => ({
    positions: line.stations?.map(st => [st.latitude, st.longitude]) || [],
    color: getColor(line.stations?.[0]?.mapMarker)
  }));

  // Group stations by stationName (not stationId)
  const stationNameMap = {};
  displayedLines.forEach(line => {
    line.stations?.forEach(station => {
      if (!stationNameMap[station.stationName]) {
        stationNameMap[station.stationName] = {
          ...station,
          lines: []
        };
      }
      stationNameMap[station.stationName].lines.push({
        lineName: line.lineName,
        mapMarker: station.mapMarker,
        lineColor: getColor(station.mapMarker)
      });
    });
  });

  // Prepare markers
  const markers = Object.values(stationNameMap).map(station => {
    const isCollided = station.lines.length > 1;
    const color = isCollided ? markerColors.default : getColor(station.mapMarker);
    return {
      key: station.stationName,
      position: [station.latitude, station.longitude],
      icon: createReactIcon(color),
      popup: (
        <>
          <b>{station.stationName}</b>
          <br />
          {isCollided ? (
            <>
              <b>Lines:</b>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {station.lines.map(line => (
                  <li key={line.lineName}>
                    <span style={{ color: line.lineColor }}>{line.lineName}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              Line: <span style={{ color }}>{station.lines[0].lineName}</span>
              <br />
              Marker: <span style={{ color }}>{station.mapMarker}</span>
            </>
          )}
        </>
      )
    };
  });

  // Center map on first station or default location
  const firstStation = displayedLines[0]?.stations?.[0];
  const center = firstStation
    ? [firstStation.latitude, firstStation.longitude]
    : [10.7769, 106.7009];

  return (
    <MapContainer
      center={center}
      zoom={13}
      minZoom={12}
      maxZoom={17}
      style={{ height: "70vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {/* Draw polylines for each line */}
      {polylines.map((polyline, idx) => (
        <Polyline key={idx} positions={polyline.positions} color={polyline.color} weight={5} />
      ))}
      {/* Draw unique station markers by name */}
      {markers.map(marker => (
        <Marker
          key={marker.key}
          position={marker.position}
          icon={marker.icon}
        >
          <Popup>{marker.popup}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MetroLineMapView;