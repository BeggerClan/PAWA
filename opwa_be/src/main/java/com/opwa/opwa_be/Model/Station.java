package com.opwa.opwa_be.Model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Station {
    private String stationId;
    private String stationName;
    private double latitude;
    private double longitude;
    private String mapMarker;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Station() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}