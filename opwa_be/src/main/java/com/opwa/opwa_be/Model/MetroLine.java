package com.opwa.opwa_be.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
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
    private List<Station> stations;
    private List<String> tripIds;
    
    public MetroLine() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}