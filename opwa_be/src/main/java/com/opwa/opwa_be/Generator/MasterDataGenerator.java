package com.opwa.opwa_be.Generator;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
//@Profile("generate-data") // Optional: Only activate with this profile
public class MasterDataGenerator {
    private final MetroLineGenerator metroLineGenerator;
    private final StationGenerator stationGenerator;

    public void generateAll() {
        try {
            System.out.println("⚡ Starting data generation...");
            stationGenerator.run(); // Generate stations first!
            metroLineGenerator.run(); // Then generate lines using those stations
            System.out.println("✅ All data generated successfully!");
        } catch (Exception e) {
            System.err.println("❌ Data generation failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}