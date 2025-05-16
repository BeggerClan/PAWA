// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import { FaMapMarkerAlt } from "react-icons/fa";
// import { renderToStaticMarkup } from "react-dom/server";
// import "leaflet/dist/leaflet.css";
// import { getAllStations } from "../../services/stationApi"; // You need to implement this API call

// const markerColors = {
//   red: "#e74c3c",
//   blue: "#3498db",
//   green: "#27ae60",
//   orange: "#e67e22",
//   purple: "#8e44ad",
//   yellow: "#f1c40f",
//   default: "#34495e"
// };
// const getColor = (marker) => markerColors[marker?.toLowerCase()] || markerColors.default;

// const createReactIcon = (color) =>
//   L.divIcon({
//     html: renderToStaticMarkup(
//       <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//         <FaMapMarkerAlt color={color} size={40} style={{ filter: "drop-shadow(0 2px 2px #0002)" }} />
//         <span
//           style={{
//             display: "block",
//             width: 8,
//             height: 8,
//             borderRadius: "50%",
//             background: "#222"
//           }}
//         />
//       </div>
//     ),
//     className: "",
//     iconSize: [40, 50],
//     iconAnchor: [20, 44],
//     popupAnchor: [0, -44]
//   });

// const StationMapView = ({ selectedStationId }) => {
//   const [stations, setStations] = useState([]);

//   useEffect(() => {
//     getAllStations().then(res => setStations(res.data));
//   }, []);

//   // Filter stations if a station is selected
//   const displayedStations = selectedStationId
//     ? stations.filter(st => st.stationId === selectedStationId)
//     : stations;

//   // Center map on first station or default location
//   const firstStation = displayedStations[0];
//   const center = firstStation
//     ? [firstStation.latitude, firstStation.longitude]
//     : [10.7769, 106.7009];

//   return (
//     <MapContainer
//       center={center}
//       zoom={13}
//       minZoom={12}
//       maxZoom={17}
//       style={{ height: "70vh", width: "100%" }}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
//         url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
//       />
//       {displayedStations.map(station => (
//         <Marker
//           key={station.stationId}
//           position={[station.latitude, station.longitude]}
//           icon={createReactIcon(getColor(station.mapMarker))}
//         >
//           <Popup>
//             <b>{station.stationName}</b>
//             <br />
//             Marker: <span style={{ color: getColor(station.mapMarker) }}>{station.mapMarker}</span>
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// export default StationMapView;