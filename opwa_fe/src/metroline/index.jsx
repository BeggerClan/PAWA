import React, { useState } from 'react';
import MetroLineGrid from './MetroLineGrid';
import MetroLineStations from './MetroLineStations';
import MetroLineMapView from './MetroLineMapView';

const Index = () => {
  const [selectedLineId, setSelectedLineId] = useState(null);

  // Handler to show stations for a line
  const handleShowStations = (lineId) => {
    setSelectedLineId(lineId);
  };

  // Handler to go back to metro lines grid
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
        {/* Map view always on top */}
        <MetroLineMapView />
        <div style={{ margin: "24px 0" }} />
        {/* Table or stations view below */}
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
