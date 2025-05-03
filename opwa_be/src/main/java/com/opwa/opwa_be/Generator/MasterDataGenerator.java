package com.opwa.opwa_be.Generator;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Profile("generate-data") // Optional: Only activate with this profile
public class MasterDataGenerator {
    private final MetroLineGenerator metroLineGenerator;
    private final StationGenerator stationGenerator;
    //private final SuspensionGenerator suspensionGenerator;
    private final NotificationGenerator notificationGenerator;

    public void generateAll() {
        try {
            System.out.println("⚡ Starting data generation...");
            metroLineGenerator.run();
            stationGenerator.run();
            //suspensionGenerator.run();
            notificationGenerator.run();
            System.out.println("✅ All data generated successfully!");
        } catch (Exception e) {
            System.err.println("❌ Data generation failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}