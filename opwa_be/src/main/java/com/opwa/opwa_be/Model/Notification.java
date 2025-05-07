package com.opwa.opwa_be.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Document(collection = "notifications")
@Data
public class Notification {
    @Id
    private String notificationId;
    private String suspensionId;
    private LocalDateTime sentAt;
    private NotificationStatus status;
    private List<String> altRoutes;
    
    public enum NotificationStatus {
        PENDING, SENT, FAILED
    }
    
    public Notification() {
        this.sentAt = LocalDateTime.now();
        this.status = NotificationStatus.PENDING;
        this.altRoutes = new ArrayList<>();
    }
}