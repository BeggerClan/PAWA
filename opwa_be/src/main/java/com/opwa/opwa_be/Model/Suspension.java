package com.opwa.opwa_be.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "suspensions")
@Data
public class Suspension {
    @Id
    private String suspensionId;
    private String metroLineId;
    private String lineName;
    private List<String> affectedStationIds;
    private String reason;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime expectedEndTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isActive;

    public Suspension() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isActive = true;
    }

    public String getId() {
        return suspensionId;
    }

    public void setId(String suspensionId) {
        this.suspensionId = suspensionId;
    }
}