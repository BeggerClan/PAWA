package com.opwa.opwa_be.Generator;

import com.opwa.opwa_be.Repository.NotificationRepo;
import com.opwa.opwa_be.Repository.SuspensionRepo;
import com.opwa.opwa_be.model.Notification;
import com.opwa.opwa_be.model.Suspension;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class NotificationGenerator implements CommandLineRunner {

    @Autowired
    private NotificationRepo notificationRepo;
    
    @Autowired
    private SuspensionRepo suspensionRepo;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data
        notificationRepo.deleteAll();

        // Get all suspensions
        List<Suspension> suspensions = suspensionRepo.findAll();
        
        // Create notifications for each suspension
        for (Suspension suspension : suspensions) {
            Notification notification = new Notification();
            notification.setSuspensionId(suspension.getSuspensionId());
            notification.setStatus(Notification.NotificationStatus.SENT);
            notification.getAltRoutes().add("Line 2");
            notification.getAltRoutes().add("Bus Route 53");
            notificationRepo.save(notification);
        }
    }
}