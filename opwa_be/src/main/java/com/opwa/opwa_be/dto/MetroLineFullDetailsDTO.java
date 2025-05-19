package com.opwa.opwa_be.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class MetroLineFullDetailsDTO {
    private String lineId;
    private String lineName;
    private int totalDuration;
    private boolean active;
    private boolean suspended;
    private String suspensionReason;
    private LocalDateTime suspensionStartTime;
    private LocalDateTime suspensionEndTime;
    private LocalDateTime firstDeparture;
    private String frequencyMinutes;
    private List<String> stationIds;
    private List<StationDTO> stations;
    private List<SuspensionDTO> suspensions;
    private List<TripDTO> trips;

    // Getters and setters
    public String getLineId() { return lineId; }
    public void setLineId(String lineId) { this.lineId = lineId; }
    public String getLineName() { return lineName; }
    public void setLineName(String lineName) { this.lineName = lineName; }
    public int getTotalDuration() { return totalDuration; }
    public void setTotalDuration(int totalDuration) { this.totalDuration = totalDuration; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public boolean isSuspended() { return suspended; }
    public void setSuspended(boolean suspended) { this.suspended = suspended; }
    public String getSuspensionReason() { return suspensionReason; }
    public void setSuspensionReason(String suspensionReason) { this.suspensionReason = suspensionReason; }
    public LocalDateTime getSuspensionStartTime() { return suspensionStartTime; }
    public void setSuspensionStartTime(LocalDateTime suspensionStartTime) { this.suspensionStartTime = suspensionStartTime; }
    public LocalDateTime getSuspensionEndTime() { return suspensionEndTime; }
    public void setSuspensionEndTime(LocalDateTime suspensionEndTime) { this.suspensionEndTime = suspensionEndTime; }
    public LocalDateTime getFirstDeparture() { return firstDeparture; }
    public void setFirstDeparture(LocalDateTime firstDeparture) { this.firstDeparture = firstDeparture; }
    public String getFrequencyMinutes() { return frequencyMinutes; }
    public void setFrequencyMinutes(String frequencyMinutes) { this.frequencyMinutes = frequencyMinutes; }
    public List<String> getStationIds() { return stationIds; }
    public void setStationIds(List<String> stationIds) { this.stationIds = stationIds; }
    public List<StationDTO> getStations() { return stations; }
    public void setStations(List<StationDTO> stations) { this.stations = stations; }
    public List<SuspensionDTO> getSuspensions() { return suspensions; }
    public void setSuspensions(List<SuspensionDTO> suspensions) { this.suspensions = suspensions; }
    public List<TripDTO> getTrips() { return trips; }
    public void setTrips(List<TripDTO> trips) { this.trips = trips; }

    public static class StationDTO {
        private String stationId;
        private String stationName;
        private double latitude;
        private double longitude;
        private String mapMarker;
        // Getters and setters
        public String getStationId() { return stationId; }
        public void setStationId(String stationId) { this.stationId = stationId; }
        public String getStationName() { return stationName; }
        public void setStationName(String stationName) { this.stationName = stationName; }
        public double getLatitude() { return latitude; }
        public void setLatitude(double latitude) { this.latitude = latitude; }
        public double getLongitude() { return longitude; }
        public void setLongitude(double longitude) { this.longitude = longitude; }
        public String getMapMarker() { return mapMarker; }
        public void setMapMarker(String mapMarker) { this.mapMarker = mapMarker; }
    }

    public static class SuspensionDTO {
        private String suspensionId;
        private String metroLineId;
        private String lineName;
        private List<String> affectedStationIds;
        private String reason;
        private String description;
        private LocalDateTime startTime;
        private LocalDateTime expectedEndTime;
        private boolean active;
        // Getters and setters
        public String getSuspensionId() { return suspensionId; }
        public void setSuspensionId(String suspensionId) { this.suspensionId = suspensionId; }
        public String getMetroLineId() { return metroLineId; }
        public void setMetroLineId(String metroLineId) { this.metroLineId = metroLineId; }
        public String getLineName() { return lineName; }
        public void setLineName(String lineName) { this.lineName = lineName; }
        public List<String> getAffectedStationIds() { return affectedStationIds; }
        public void setAffectedStationIds(List<String> affectedStationIds) { this.affectedStationIds = affectedStationIds; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public LocalDateTime getStartTime() { return startTime; }
        public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
        public LocalDateTime getExpectedEndTime() { return expectedEndTime; }
        public void setExpectedEndTime(LocalDateTime expectedEndTime) { this.expectedEndTime = expectedEndTime; }
        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }
    }

    public static class TripDTO {
        private String tripId;
        private String lineId;
        private LocalTime departureTime;
        private LocalTime arrivalTime;
        private boolean returnTrip;
        private List<TripSegmentDTO> segments;
        // Getters and setters
        public String getTripId() { return tripId; }
        public void setTripId(String tripId) { this.tripId = tripId; }
        public String getLineId() { return lineId; }
        public void setLineId(String lineId) { this.lineId = lineId; }
        public LocalTime getDepartureTime() { return departureTime; }
        public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }
        public LocalTime getArrivalTime() { return arrivalTime; }
        public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }
        public boolean isReturnTrip() { return returnTrip; }
        public void setReturnTrip(boolean returnTrip) { this.returnTrip = returnTrip; }
        public List<TripSegmentDTO> getSegments() { return segments; }
        public void setSegments(List<TripSegmentDTO> segments) { this.segments = segments; }
    }

    public static class TripSegmentDTO {
        private String fromStationId;
        private String toStationId;
        private LocalTime departureTime;
        private LocalTime arrivalTime;
        private int durationMinutes;
        // Getters and setters
        public String getFromStationId() { return fromStationId; }
        public void setFromStationId(String fromStationId) { this.fromStationId = fromStationId; }
        public String getToStationId() { return toStationId; }
        public void setToStationId(String toStationId) { this.toStationId = toStationId; }
        public LocalTime getDepartureTime() { return departureTime; }
        public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }
        public LocalTime getArrivalTime() { return arrivalTime; }
        public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }
        public int getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
    }
} 