package com.opwa.opwa_be.Generator;

import com.opwa.opwa_be.Model.MetroLine;
import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Services.MetroLineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class MetroLineGenerator implements CommandLineRunner {

    @Autowired
    private MetroLineService metroLineService;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data and create sample lines
        metroLineService.deleteAllLines();
        
        MetroLine redLine = new MetroLine();
        redLine.setLineName("Red Line");
        redLine.setTotalDuration(30);
        redLine.setActive(true);
        redLine.setFirstDeparture(LocalDateTime.now().with(LocalTime.of(5, 30)));
        redLine.setFrequencyMinutes("10");
        redLine.setStartStationId("ST1"); // Reference by ID
        redLine.setEndStationId("ST14");
        metroLineService.createMetroLine(redLine);

        MetroLine blueLine = new MetroLine();
        blueLine.setLineName("Blue Line");
        blueLine.setTotalDuration(25);
        blueLine.setActive(false);
        blueLine.setFirstDeparture(LocalDateTime.now().with(LocalTime.of(6, 0)));
        blueLine.setFrequencyMinutes("15");
        blueLine.setStartStationId("ST14");
        blueLine.setEndStationId("ST1");
        metroLineService.createMetroLine(blueLine);
    }
}