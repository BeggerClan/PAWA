package com.opwa.opwa_be.Generator;

import com.opwa.opwa_be.Model.MetroLine;
import com.opwa.opwa_be.Repository.MetroLineRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.Arrays;

@Component
public class MetroLineGenerator implements CommandLineRunner {

    @Autowired
    private MetroLineRepo metroLineRepo;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data
        metroLineRepo.deleteAll();

        // Line 1 - Ben Thanh - Suoi Tien
        MetroLine line1 = new MetroLine();
        line1.setLineName("Line 1");
        line1.setTotalDuration(45);
        line1.setStatus(true);
        line1.setFirstDepartureTime(LocalTime.of(5, 30));
        line1.setFrequencyMinutes(10);
        line1.setStationIds(Arrays.asList(
            "ST001", "ST002", "ST003", "ST004", "ST005", 
            "ST006", "ST007", "ST008", "ST009", "ST010", 
            "ST011", "ST012", "ST013", "ST014"
        ));
        metroLineRepo.save(line1);

        // Line 2 - Ben Thanh - Tham Luong
        MetroLine line2 = new MetroLine();
        line2.setLineName("Line 2");
        line2.setTotalDuration(40);
        line2.setStatus(true);
        line2.setFirstDepartureTime(LocalTime.of(5, 45));
        line2.setFrequencyMinutes(12);
        line2.setStationIds(Arrays.asList(
            "ST001", "ST015", "ST016", "ST017", "ST018", 
            "ST019", "ST020", "ST021", "ST022", "ST023"
        ));
        metroLineRepo.save(line2);

        // Add more lines as needed...
    }
}