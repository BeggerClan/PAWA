import React, { useState } from "react";
import MetroLineGrid from "./components/metrolineGridPage/MetroLineGrid";
import MetroLineStations from "./components/metrolineStationGridPage/MetroLineStations";
import MetroLineMapView from "./components/metrolineGridPage/MetroLineMapView";

const Index = () => {
  const [selectedLineId, setSelectedLineId] = useState(null);

  const handleShowStations = (lineId) => {
    setSelectedLineId(lineId);
  };

  const handleBack = () => {
    setSelectedLineId(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f6fa"
      }}
    >
      <div style={{ width: "90vw", maxWidth: 1100 }}>
        <MetroLineMapView selectedLineId={selectedLineId} />
        <div style={{ margin: "24px 0" }} />
        {!selectedLineId ? (
          <MetroLineGrid onShowStations={handleShowStations} />
        ) : (
          <MetroLineStations lineId={selectedLineId} onBack={handleBack} />
        )}
      </div>
    </div>
  );
};

export default Index;
