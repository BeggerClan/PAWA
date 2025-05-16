// import React, { useEffect, useState } from "react";
// import { getAllStations } from "../../services/stationApi"; // You need to implement this API call
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

// const StationGrid = ({ onShowStation }) => {
//   const [stations, setStations] = useState([]);

//   useEffect(() => {
//     getAllStations().then(res => setStations(res.data));
//   }, []);

//   return (
//     <TableContainer component={Paper}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Station ID</TableCell>
//             <TableCell>Name</TableCell>
//             <TableCell>Latitude</TableCell>
//             <TableCell>Longitude</TableCell>
//             <TableCell>Marker</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {stations.map(station => (
//             <TableRow
//               key={station.stationId}
//               style={{ cursor: "pointer" }}
//               onClick={() => onShowStation(station.stationId)}
//             >
//               <TableCell>{station.stationId}</TableCell>
//               <TableCell>{station.stationName}</TableCell>
//               <TableCell>{station.latitude}</TableCell>
//               <TableCell>{station.longitude}</TableCell>
//               <TableCell>{station.mapMarker}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default StationGrid;