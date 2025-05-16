package com.opwa.opwa_be.Generator;

import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.StationRepo;
import com.opwa.opwa_be.Service.MetroLineService;
import com.opwa.opwa_be.Service.SuspensionService;
import com.opwa.opwa_be.model.MetroLine;
import com.opwa.opwa_be.model.Suspension;

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

    @Autowired
    private SuspensionService suspensionService;

    @Autowired
    private StationRepo stationRepo;

    @Override
    public void run(String... args) throws Exception {
        suspensionService.deleteAllSuspensionsByLineId("LN1");
        suspensionService.deleteAllSuspensionsByLineId("LN2");
        suspensionService.deleteAllSuspensionsByLineId("LN3");
        metroLineService.deleteAllLines();

        // Fetch all stations for each line color
        List<String> redLineStations = stationRepo.findByMapMarker("red")
            .stream().map(st -> st.getStationId()).toList();
        List<String> blueLineStations = stationRepo.findByMapMarker("blue")
            .stream().map(st -> st.getStationId()).toList();
        List<String> greenLineStations = stationRepo.findByMapMarker("green")
            .stream().map(st -> st.getStationId()).toList();

        // Create Red Line (active, not suspended)
        MetroLine redLine = new MetroLine();
        redLine.setLineName("Red Line");
        redLine.setStationIds(redLineStations);
        redLine.setTotalDuration(30);
        redLine.setActive(true);
        redLine.setSuspended(false);
        redLine.setFirstDeparture(LocalDateTime.now().with(LocalTime.of(5, 30)));
        redLine.setFrequencyMinutes("10");
        metroLineService.createMetroLine(redLine);

        // Create Blue Line (suspended, will be set inactive if 3+ stations are suspended)
        MetroLine blueLine = new MetroLine();
        blueLine.setLineName("Blue Line");
        blueLine.setStationIds(blueLineStations);
        blueLine.setTotalDuration(25);
        blueLine.setActive(true);
        blueLine.setSuspended(true);
        blueLine.setSuspensionReason("Emergency maintenance");
        blueLine.setSuspensionStartTime(LocalDateTime.now().minusHours(2));
        blueLine.setSuspensionEndTime(LocalDateTime.now().plusHours(6));
        blueLine.setFirstDeparture(LocalDateTime.now().with(LocalTime.of(6, 0)));
        blueLine.setFrequencyMinutes("15");
        metroLineService.createMetroLine(blueLine);

        // Create a suspension for Blue Line affecting only ST15 (adjust if needed)
        Suspension suspension = new Suspension();
        suspension.setMetroLineId(blueLine.getLineId());
        suspension.setLineName(blueLine.getLineName());
        suspension.setReason("Emergency maintenance");
        // Make sure ST15 exists in blueLineStations
        String st15 = blueLineStations.stream().filter(id -> id.equals("ST15")).findFirst().orElse(blueLineStations.get(0));
        suspension.setAffectedStationIds(List.of(st15));
        suspension.setStartTime(LocalDateTime.now().minusHours(2));
        suspension.setExpectedEndTime(LocalDateTime.now().plusHours(6));
        suspensionService.createSuspension(suspension);

        // Create Green Line (active, not suspended)
        MetroLine greenLine = new MetroLine();
        greenLine.setLineName("Green Line");
        greenLine.setStationIds(greenLineStations);
        greenLine.setTotalDuration(35);
        greenLine.setActive(true);
        greenLine.setSuspended(false);
        greenLine.setFirstDeparture(LocalDateTime.now().with(LocalTime.of(5, 45)));
        greenLine.setFrequencyMinutes("12");
        metroLineService.createMetroLine(greenLine);
    }
}