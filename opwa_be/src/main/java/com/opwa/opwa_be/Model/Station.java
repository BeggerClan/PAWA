package com.opwa.opwa_be.model;

import lombok.Data;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "stations")
@Data
public class Station {
    @Id
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