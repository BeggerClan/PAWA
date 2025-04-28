package com.opwa.opwa_be.Generator;

import com.opwa.opwa_be.Model.MetroLine;
import com.opwa.opwa_be.Model.Trip;
import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.TripRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class TripGenerator implements CommandLineRunner {

    @Autowired
    private TripRepo tripRepo;
    
    @Autowired
    private MetroLineRepo metroLineRepo;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data
        tripRepo.deleteAll();

        // Get all metro lines
        List<MetroLine> lines = metroLineRepo.findAll();

        // Generate trips for each line
        for (MetroLine line : lines) {
            generateTripsForLine(line);
        }
    }

    private void generateTripsForLine(MetroLine line) {
        LocalDateTime currentDate = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime firstDeparture = currentDate.withHour(line.getFirstDepartureTime().getHour())
                                                .withMinute(line.getFirstDepartureTime().getMinute());
        
        // Generate trips for the next 3 days
        for (int day = 0; day < 3; day++) {
            LocalDateTime departure = firstDeparture.plusDays(day);
            LocalDateTime arrival = departure.plusMinutes(line.getTotalDuration());
            
            // Generate trips for the operational hours (5:30 AM to 10:00 PM)
            while (departure.getHour() < 22 || (departure.getHour() == 22 && departure.getMinute() == 0)) {
                Trip trip = new Trip();
                trip.setLineId(line.getLineId());
                trip.setDepartureTime(departure);
                trip.setArrivalTime(arrival);
                trip.setActive(true);
                tripRepo.save(trip);
                
                // Move to next trip
                departure = departure.plusMinutes(line.getFrequencyMinutes());
                arrival = departure.plusMinutes(line.getTotalDuration());
            }
        }
    }
}