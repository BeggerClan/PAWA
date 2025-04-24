package com.opwa.opwa_be.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Document(collection = "metro_lines")
@Data
public class MetroLine {
    @Id
    private String lineId;
    
    @Indexed(unique = true)
    private String lineName;
    
    private int totalDuration;
    private boolean status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> stationIds;
    private List<String> tripIds;
    private LocalTime firstDepartureTime;
    private int frequencyMinutes;
    
    public MetroLine() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.stationIds = new ArrayList<>();
        this.tripIds = new ArrayList<>();
    }
}