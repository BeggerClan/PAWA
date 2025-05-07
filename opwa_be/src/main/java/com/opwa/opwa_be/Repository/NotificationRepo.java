package com.opwa.opwa_be.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.opwa.opwa_be.model.Notification;

import java.util.List;

public interface NotificationRepo extends MongoRepository<Notification, String> {
    List<Notification> findBySuspensionId(String suspensionId);
    List<Notification> findByStatus(Notification.NotificationStatus status);
}