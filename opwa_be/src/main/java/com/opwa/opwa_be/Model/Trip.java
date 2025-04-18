package com.opwa.opwa_be.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import lombok.Data;

@Document(collection = "trips")
@Data
public class Trip {
    @Id
    private String tripId;
    private String lineId;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private boolean isActive;
    
    public Trip() {
        this.isActive = true;
    }
}