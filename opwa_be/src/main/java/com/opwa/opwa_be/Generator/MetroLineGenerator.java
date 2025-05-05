package com.opwa.opwa_be.Generator;

import com.opwa.opwa_be.Model.MetroLine;
import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.StationRepo;
import com.opwa.opwa_be.Services.MetroLineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class MetroLineGenerator implements CommandLineRunner {

    @Autowired
    private MetroLineService metroLineService;

    @Override
    public void run(String... args) throws Exception {
        metroLineService.deleteAllLines();
        
        // Get some station IDs
        List<String> redLineStations = List.of("ST1", "ST2", "ST3", "ST14");
        List<String> blueLineStations = List.of("ST14", "ST15", "ST16", "ST1");

        // Create Red Line
        MetroLine redLine = new MetroLine();
        redLine.setLineName("Red Line");
        redLine.setStationIds(redLineStations);
        redLine.setTotalDuration(30);
        redLine.setActive(true);
        redLine.setFirstDeparture(LocalDateTime.now().with(LocalTime.of(5, 30)));
        redLine.setFrequencyMinutes("10");
        metroLineService.createMetroLine(redLine);

        // Create Blue Line
        MetroLine blueLine = new MetroLine();
        blueLine.setLineName("Blue Line");
        blueLine.setStationIds(blueLineStations);
        blueLine.setTotalDuration(25);
        blueLine.setActive(false);
        blueLine.setFirstDeparture(LocalDateTime.now().with(LocalTime.of(6, 0)));
        blueLine.setFrequencyMinutes("15");
        metroLineService.createMetroLine(blueLine);
    }
}