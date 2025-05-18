import React, { useState, useEffect } from "react";
import StationGrid from "./components/StationGrid";
import StationMapView from "./components/StationMapView";
import { getAllStations } from "../services/stationApi";
import "../metroline/indexMapModal.css";

export default function Station() {
  const [selectedStationIds, setSelectedStationIds] = useState([]);
  const [allStationIds, setAllStationIds] = useState([]);
  const [mapModalOpen, setMapModalOpen] = useState(false);

  useEffect(() => {
    getAllStations().then(res => {
      setAllStationIds(res.data.map(st => st.stationId));
    });
  }, []);

  const handleShowStation = (stationId) => {
    setSelectedStationIds(prev => {
      if (prev.includes(stationId)) {
        // Remove if already selected
        return prev.filter(id => id !== stationId);
      } else {
        // Add to selection
        return [...prev, stationId];
      }
    });
  };

  const handleResetSelection = () => {
    setSelectedStationIds([]);
  };

  // If all stations are selected or none, treat as "show all"
  const isAllSelected =
    selectedStationIds.length === 0 ||
    (allStationIds.length > 0 && selectedStationIds.length === allStationIds.length);

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
      <div style={{ width: "98vw", maxWidth: 1600, display: "flex", gap: 32 }}>
        {/* Main content */}
        <div style={{ flex: 2, minWidth: 0 }}>
          <div style={{ marginBottom: 16 }} />
          <StationGrid
            onShowStation={handleShowStation}
            selectedStationIds={selectedStationIds}
          />
        </div>
        {/* Mini Map on the right */}
        <div style={{ flex: 1, minWidth: 350, maxWidth: 500, position: "relative" }}>
          <div className="mini-map-container">
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
              <button
                onClick={() => setMapModalOpen(true)}
                className="mini-map-enlarge-btn"
                title="Enlarge Map"
              >
                <span style={{ fontSize: 20, color: "#2d98da" }}>⤢</span>
              </button>
            </div>
            <StationMapView
              selectedStationIds={isAllSelected ? [] : selectedStationIds}
              onResetSelection={handleResetSelection}
              showResetButton={!isAllSelected && selectedStationIds.length > 0}
            />
          </div>
        </div>
        {/* Map Modal */}
        {mapModalOpen && (
          <div className="map-modal-overlay" onClick={() => setMapModalOpen(false)}>
            <div className="map-modal-close-row">
              <button
                onClick={() => setMapModalOpen(false)}
                className="map-modal-close-btn"
                title="Close"
              >
                <span style={{ fontSize: 20, color: "#2d98da" }}>×</span>
              </button>
            </div>
            <div className="map-modal-box" onClick={e => e.stopPropagation()}>
              <StationMapView
                selectedStationIds={isAllSelected ? [] : selectedStationIds}
                onResetSelection={handleResetSelection}
                showResetButton={!isAllSelected && selectedStationIds.length > 0}
                style={{ width: "80vw", height: "70vh" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}