package com.opwa.opwa_be.Generator;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.opwa.opwa_be.Service.MetroLineService;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
//@Profile("generate-data") // Optional: Only activate with this profile
public class MasterDataGenerator {
    private final MetroLineGenerator metroLineGenerator;
    private final StationGenerator stationGenerator;
    private final MetroLineService metroLineService;

    public void generateAll() {
        try {
            System.out.println("⚡ Starting data generation...");
            stationGenerator.run(); // Generate stations first!
            metroLineGenerator.run(); // Then generate lines using those stations
            System.out.println("✅ All data generated successfully!");

            // Auto-generate trips for all lines with lastDeparture = 22:00
            System.out.println("🚆 Generating trips for all metro lines (lastDeparture=22:00)...");
            metroLineService.generateTripsForAllLines(LocalTime.of(22, 0));
            System.out.println("✅ Trips generated for all lines!");
        } catch (Exception e) {
            System.err.println("❌ Data generation failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}