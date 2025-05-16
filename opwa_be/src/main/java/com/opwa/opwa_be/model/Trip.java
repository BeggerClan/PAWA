package com.opwa.opwa_be.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;
import java.util.List;

@Document(collection = "trips")
@Data
public class Trip {
    @Id
    private String tripId;
    private String lineId;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private List<TripSegment> segments;
    private boolean isReturnTrip;
    
    // Inner class for trip segments
    @Data
    public static class TripSegment {
        private String fromStationId;
        private String toStationId;
        private LocalTime departureTime;
        private LocalTime arrivalTime;
        private int durationMinutes;
    }
}