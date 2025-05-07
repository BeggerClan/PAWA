package com.opwa.opwa_be.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "metro_lines")
public class MetroLine {
    @Id
    private String lineId;
    private String lineName;
    private int totalDuration;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime firstDeparture;
    private String frequencyMinutes;
    
    // Suspension fields
    private boolean isSuspended;
    private String suspensionReason;
    private LocalDateTime suspensionStartTime;
    private LocalDateTime suspensionEndTime;
    
    // Store station IDs
    private List<String> stationIds;
    
    // Transient field for populated stations
    @Transient
    private List<Station> stations;

    public MetroLine() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isActive = true;
        this.isSuspended = false;
    }
}