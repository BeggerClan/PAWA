package com.opwa.opwa_be.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.opwa.opwa_be.Model.Notification;
import com.opwa.opwa_be.Repository.NotificationRepo;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    @Autowired
    private NotificationRepo notificationRepo;

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationRepo.findAll();
    }

    @GetMapping("/suspension/{suspensionId}")
    public List<Notification> getNotificationsBySuspension(@PathVariable String suspensionId) {
        return notificationRepo.findBySuspensionId(suspensionId);
    }

    @GetMapping("/status/{status}")
    public List<Notification> getNotificationsByStatus(@PathVariable Notification.NotificationStatus status) {
        return notificationRepo.findByStatus(status);
    }

    @PostMapping
    public Notification createNotification(@RequestBody Notification notification) {
        return notificationRepo.save(notification);
    }

    @PutMapping("/{id}")
    public Notification updateNotification(@PathVariable String id, @RequestBody Notification notification) {
        notification.setNotificationId(id);
        return notificationRepo.save(notification);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable String id) {
        notificationRepo.deleteById(id);
    }
}