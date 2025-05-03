package com.opwa.opwa_be.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@Document(collection = "metro_lines")
public class MetroLine {
    @Id
    private String lineId; // Will be auto-generated as LN1, LN2, etc.
    private String lineName;
    private int totalDuration;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime firstDeparture;
    private String frequencyMinutes;

    // Store only IDs (shows directly in Compass)
    @Field("startStationId")
    private String startStationId;

    @Field("endStationId")
    private String endStationId;

    // Transient fields for populated data (not stored in DB)
    @Transient
    private Station startStation;

    @Transient
    private Station endStation;

    public MetroLine() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}