package com.opwa.opwa_be.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Document(collection = "suspensions")
@Data
public class Suspension {
    @Id
    private String suspensionId;
    private String lineId;
    private String tripId;
    private String scheduleId;
    private String reason;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<String> notificationIds;
    
    public Suspension() {
        this.notificationIds = new ArrayList<>();
    }
}