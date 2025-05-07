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
        
        // Define station IDs for each line
        List<String> redLineStations = List.of("ST1", "ST2", "ST3", "ST14");
        List<String> blueLineStations = List.of("ST14", "ST15", "ST16", "ST1");
        List<String> greenLineStations = List.of("ST17", "ST18", "ST19", "ST20");

        // Create Red Line (active, not suspended)
        MetroLine redLine = new MetroLine();
        redLine.setLineName("Red Line");
        redLine.setStationIds(redLineStations);
        redLine.setTotalDuration(30);
        redLine.setActive(true);
        redLine.setFirstDeparture(LocalDateTime.now().with(LocalTime.of(5, 30)));
        redLine.setFrequencyMinutes("10");
        metroLineService.createMetroLine(redLine);

        // Create Blue Line (active BUT suspended)
        MetroLine blueLine = new MetroLine();
        blueLine.setLineName("Blue Line");
        blueLine.setStationIds(blueLineStations);
        blueLine.setTotalDuration(25);
        blueLine.setActive(true);
        blueLine.setFirstDeparture(LocalDateTime.now().with(LocalTime.of(6, 0)));
        blueLine.setFrequencyMinutes("15");
        
        // Set suspension properties
        blueLine.setSuspended(true);
        blueLine.setSuspensionReason("Emergency maintenance");
        blueLine.setSuspensionStartTime(LocalDateTime.now().minusHours(2));
        blueLine.setSuspensionEndTime(LocalDateTime.now().plusHours(6));
        
        metroLineService.createMetroLine(blueLine);

        // Create Green Line (active, not suspended)
        MetroLine greenLine = new MetroLine();
        greenLine.setLineName("Green Line");
        greenLine.setStationIds(greenLineStations);
        greenLine.setTotalDuration(35);
        greenLine.setActive(true);
        greenLine.setFirstDeparture(LocalDateTime.now().with(LocalTime.of(5, 45)));
        greenLine.setFrequencyMinutes("12");
        metroLineService.createMetroLine(greenLine);
    }
}