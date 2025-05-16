package com.opwa.opwa_be.Service;

import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.StationRepo;
import com.opwa.opwa_be.Repository.SuspensionRepo;
import com.opwa.opwa_be.Repository.TripRepo;
import com.opwa.opwa_be.model.MetroLine;
import com.opwa.opwa_be.model.Station;
import com.opwa.opwa_be.model.Suspension;
import com.opwa.opwa_be.model.Trip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MetroLineService {
    
    @Autowired
    private MetroLineRepo metroLineRepo;
    
    @Autowired
    private StationRepo stationRepo;

    @Autowired
    private SuspensionRepo suspensionRepo;

    @Autowired
    private TripRepo tripRepo;

    public MetroLine findLineByIdWithStations(String id) {
        MetroLine line = metroLineRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Metro line not found with id: " + id));
        populateStations(line);
        return line;
    }

    public String getLineName(String lineId) {
        return metroLineRepo.findById(lineId)
            .map(MetroLine::getLineName)
            .orElseThrow(() -> new RuntimeException("Metro line not found with id: " + lineId));
    }

    public void deleteAllLines() {
        metroLineRepo.deleteAll();
    }

    public MetroLine createMetroLine(MetroLine metroLine) {
        if (metroLine.getLineId() == null) {
            int maxNumber = metroLineRepo.findAll().stream()
                .map(m -> m.getLineId().substring(2))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);
            metroLine.setLineId(String.format("LN%d", maxNumber + 1));
        }
        metroLine.setUpdatedAt(LocalDateTime.now());
        return metroLineRepo.save(metroLine);
    }

    public List<Station> getStationsForLine(String lineId) {
        MetroLine line = metroLineRepo.findById(lineId).orElseThrow();
        populateStations(line);
        return line.getStations();
    }

    public Station getStationFromLine(String lineId, String stationId) {
        MetroLine line = metroLineRepo.findById(lineId).orElseThrow();
        populateStations(line);
        
        return line.getStations().stream()
            .filter(station -> station.getStationId().equals(stationId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException(
                "Station " + stationId + " not found in line " + lineId));
    }

    public List<MetroLine> findAllWithStations() {
        List<MetroLine> lines = metroLineRepo.findAll();
        lines.forEach(this::populateStations);
        return lines;
    }

    public List<MetroLine> findByActiveStatus(boolean isActive) {
        List<MetroLine> lines = metroLineRepo.findByIsActive(isActive);
        lines.forEach(this::populateStations);
        return lines;
    }

    public MetroLine updateLineStatus(String id, boolean isActive) {
        MetroLine line = metroLineRepo.findById(id).orElseThrow();
        line.setActive(isActive);
        line.setUpdatedAt(LocalDateTime.now());
        return metroLineRepo.save(line);
    }

    public MetroLine addStationToLine(String lineId, String stationId) {
        MetroLine line = metroLineRepo.findById(lineId).orElseThrow();
        
        if (line.getStationIds() == null) {
            line.setStationIds(new ArrayList<>());
        }
        
        if (!line.getStationIds().contains(stationId)) {
            line.getStationIds().add(stationId);
            line.setUpdatedAt(LocalDateTime.now());
            metroLineRepo.save(line);
        }
        
        return findLineByIdWithStations(lineId);
    }

    public MetroLine removeStationFromLine(String lineId, String stationId) {
        MetroLine line = metroLineRepo.findById(lineId).orElseThrow();
        
        if (line.getStationIds() != null) {
            line.getStationIds().remove(stationId);
            line.setUpdatedAt(LocalDateTime.now());
            metroLineRepo.save(line);
        }
        
        return findLineByIdWithStations(lineId);
    }

    private void populateStations(MetroLine metroLine) {
        if (metroLine.getStationIds() != null) {
            List<Station> stations = metroLine.getStationIds().stream()
                .map(stationRepo::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
            metroLine.setStations(stations);
        }
    }

    public Suspension createSuspension(Suspension suspension) {
        metroLineRepo.findById(suspension.getMetroLineId()).ifPresent(line -> {
            line.setSuspended(true);
            line.setSuspensionReason(suspension.getReason());
            line.setSuspensionStartTime(suspension.getStartTime());
            line.setSuspensionEndTime(suspension.getExpectedEndTime());
            metroLineRepo.save(line);
        });
        return suspensionRepo.save(suspension);
    }

    public void resolveSuspension(String suspensionId) {
        suspensionRepo.findById(suspensionId).ifPresent(suspension -> {
            suspension.setActive(false);
            suspension.setUpdatedAt(LocalDateTime.now());
            suspensionRepo.save(suspension);
            
            metroLineRepo.findById(suspension.getMetroLineId()).ifPresent(line -> {
                line.setSuspended(false);
                line.setSuspensionReason(null);
                line.setSuspensionStartTime(null);
                line.setSuspensionEndTime(null);
                metroLineRepo.save(line);
            });
        });
    }

    public List<Suspension> getActiveSuspensions() {
        return suspensionRepo.findByIsActive(true);
    }

    public List<Suspension> getSuspensionsForLine(String lineId) {
        return suspensionRepo.findByMetroLineId(lineId);
    }

    public List<Suspension> getSuspensionsForStation(String stationId) {
        return suspensionRepo.findByAffectedStationIdsContaining(stationId);
    }

    public List<String> getAffectedStations(String lineId) {
        return metroLineRepo.findById(lineId)
            .map(MetroLine::getStationIds)
            .orElseThrow(() -> new RuntimeException("Line not found"));
    }

    public List<Trip> generateTripsForLine(MetroLine metroLine, LocalTime lastDeparture) {
        tripRepo.deleteByLineId(metroLine.getLineId());

        List<Trip> trips = new ArrayList<>();
        LocalTime firstDeparture = metroLine.getFirstDeparture().toLocalTime();
        String frequency = metroLine.getFrequencyMinutes();
        int frequencyMinutes = parseFrequency(frequency);

        LocalTime currentDeparture = firstDeparture;

        while (!currentDeparture.isAfter(lastDeparture)) {
            Trip forwardTrip = generateSingleTrip(metroLine, currentDeparture, false);
            trips.add(forwardTrip);

            if (!currentDeparture.plusMinutes(frequencyMinutes).isAfter(lastDeparture)) {
                Trip returnTrip = generateSingleTrip(metroLine,
                    forwardTrip.getArrivalTime().plusMinutes(10), // 10 min rest
                    true);
                trips.add(returnTrip);
            }

            currentDeparture = currentDeparture.plusMinutes(frequencyMinutes * 2);
        }

        return tripRepo.saveAll(trips);
    }

    public List<Trip> generateTripsForLine(MetroLine metroLine) {
        // Default lastDeparture to 06:00 (6 AM)
        return generateTripsForLine(metroLine, LocalTime.of(6, 0));
    }

    public List<Trip> generateTripsForAllLines() {
        List<Trip> allTrips = new ArrayList<>();
        List<MetroLine> lines = metroLineRepo.findAll();
        for (MetroLine line : lines) {
            allTrips.addAll(generateTripsForLine(line, LocalTime.of(6, 0)));
        }
        return allTrips;
    }

    private Trip generateSingleTrip(MetroLine metroLine, LocalTime startTime, boolean isReturnTrip) {
        Trip trip = new Trip();
        trip.setLineId(metroLine.getLineId());
        trip.setTripId(generateTripId(metroLine.getLineId(), startTime, isReturnTrip));
        trip.setDepartureTime(startTime);
        trip.setReturnTrip(isReturnTrip);
        
        List<String> stationIds;
        if (isReturnTrip) {
            stationIds = new ArrayList<>(metroLine.getStationIds());
            java.util.Collections.reverse(stationIds);
        } else {
            stationIds = metroLine.getStationIds();
        }
        
        List<Trip.TripSegment> segments = new ArrayList<>();
        LocalTime currentTime = startTime;
        
        // Calculate time between stations (assuming equal distribution for simplicity)
        int totalStations = stationIds.size();
        int segmentDuration = metroLine.getTotalDuration() / (totalStations - 1);
        
        for (int i = 0; i < totalStations - 1; i++) {
            Trip.TripSegment segment = new Trip.TripSegment();
            segment.setFromStationId(stationIds.get(i));
            segment.setToStationId(stationIds.get(i + 1));
            segment.setDepartureTime(currentTime);
            segment.setArrivalTime(currentTime.plusMinutes(segmentDuration));
            segment.setDurationMinutes(segmentDuration);
            segments.add(segment);
            currentTime = currentTime.plusMinutes(segmentDuration);
        }
        
        trip.setSegments(segments);
        trip.setArrivalTime(currentTime);
        return trip;
    }

    private String generateTripId(String lineId, LocalTime time, boolean isReturnTrip) {
        return String.format("%s-%s-%s", 
            lineId, 
            time.toString().replace(":", ""),
            isReturnTrip ? "R" : "F");
    }

    private int parseFrequency(String frequency) {
        try {
            return Integer.parseInt(frequency.replaceAll("[^0-9]", ""));
        } catch (NumberFormatException e) {
            return 10; // default to 10 minutes if parsing fails
        }
    }
}