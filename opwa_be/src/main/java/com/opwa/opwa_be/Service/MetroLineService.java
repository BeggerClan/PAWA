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
import org.springframework.data.mongodb.core.MongoTemplate;
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

    @Autowired
    private MongoTemplate mongoTemplate;

    public MetroLine findLineByIdWithStations(String id) {
        MetroLine line = metroLineRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Metro line not found with id: " + id));
        populateStations(line);
        if (line.getStations() != null) {
            line.getStations().sort((a, b) -> {
                int numA = Integer.parseInt(a.getStationId().replaceFirst("^ST", ""));
                int numB = Integer.parseInt(b.getStationId().replaceFirst("^ST", ""));
                return Integer.compare(numA, numB);
            });
        }
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
        // Automatically calculate totalDuration
        metroLine.setTotalDuration(calculateTotalDuration(metroLine));
        metroLine.setUpdatedAt(LocalDateTime.now());

        // If no stations are added, set active to false
        if (metroLine.getStationIds() == null || metroLine.getStationIds().isEmpty()) {
            metroLine.setActive(false);
        }

        return metroLineRepo.save(metroLine);
    }

    public List<Station> getStationsForLine(String lineId) {
        MetroLine line = metroLineRepo.findById(lineId).orElseThrow();
        populateStations(line);
        List<Station> stations = line.getStations();
        if (stations != null) {
            stations.sort((a, b) -> {
                int numA = Integer.parseInt(a.getStationId().replaceFirst("^ST", ""));
                int numB = Integer.parseInt(b.getStationId().replaceFirst("^ST", ""));
                return Integer.compare(numA, numB);
            });
        }
        return stations;
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
        String collectionName = "trips_" + metroLine.getLineId();
        mongoTemplate.dropCollection(collectionName);

        List<Trip> trips = new ArrayList<>();
        List<String> stationIds = metroLine.getStationIds();
        if (stationIds == null || stationIds.size() < 2) return trips;

        int totalStations = stationIds.size();
        int segmentDuration = metroLine.getTotalDuration() / (totalStations - 1);
        int intervalMinutes = 10;

        // FORWARD TRIPS
        LocalTime currentDeparture = metroLine.getFirstDeparture().toLocalTime();
        while (!currentDeparture.isAfter(lastDeparture)) {
            Trip trip = new Trip();
            trip.setLineId(metroLine.getLineId());
            trip.setTripId(generateTripId(metroLine.getLineId(), currentDeparture, false));
            trip.setDepartureTime(currentDeparture);
            trip.setReturnTrip(false);

            List<Trip.TripSegment> segments = new ArrayList<>();
            LocalTime currentTime = currentDeparture;
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
            trips.add(trip);

            // Next trip starts after previous arrival + interval
            currentDeparture = currentTime.plusMinutes(intervalMinutes);
        }

        // RETURN TRIPS (independent sequence)
        List<String> reversedStationIds = new ArrayList<>(stationIds);
        java.util.Collections.reverse(reversedStationIds);
        LocalTime returnDeparture = metroLine.getFirstDeparture().toLocalTime();
        while (!returnDeparture.isAfter(lastDeparture)) {
            Trip trip = new Trip();
            trip.setLineId(metroLine.getLineId());
            trip.setTripId(generateTripId(metroLine.getLineId(), returnDeparture, true));
            trip.setDepartureTime(returnDeparture);
            trip.setReturnTrip(true);

            List<Trip.TripSegment> segments = new ArrayList<>();
            LocalTime currentTime = returnDeparture;
            for (int i = 0; i < totalStations - 1; i++) {
                Trip.TripSegment segment = new Trip.TripSegment();
                segment.setFromStationId(reversedStationIds.get(i));
                segment.setToStationId(reversedStationIds.get(i + 1));
                segment.setDepartureTime(currentTime);
                segment.setArrivalTime(currentTime.plusMinutes(segmentDuration));
                segment.setDurationMinutes(segmentDuration);
                segments.add(segment);
                currentTime = currentTime.plusMinutes(segmentDuration);
            }
            trip.setSegments(segments);
            trip.setArrivalTime(currentTime);
            trips.add(trip);

            // Next return trip starts after previous arrival + interval
            returnDeparture = currentTime.plusMinutes(intervalMinutes);
        }

        mongoTemplate.insert(trips, collectionName);
        return trips;
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

    // Overload: generate trips for all lines with custom lastDeparture
    public List<Trip> generateTripsForAllLines(LocalTime lastDeparture) {
        List<Trip> allTrips = new ArrayList<>();
        List<MetroLine> lines = metroLineRepo.findAll();
        for (MetroLine line : lines) {
            allTrips.addAll(generateTripsForLine(line, lastDeparture));
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

    public void deleteMetroLine(String id) {
        metroLineRepo.deleteById(id);
    }

    public MetroLine updateMetroLine(String id, MetroLine updatedLine) {
        MetroLine existing = metroLineRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Metro line not found with id: " + id));

        boolean changed = false;

        if (!java.util.Objects.equals(existing.getLineName(), updatedLine.getLineName())) {
            existing.setLineName(updatedLine.getLineName());
            changed = true;
        }

        boolean freqChanged = false;
        if (!java.util.Objects.equals(existing.getFrequencyMinutes(), updatedLine.getFrequencyMinutes())) {
            existing.setFrequencyMinutes(updatedLine.getFrequencyMinutes());
            freqChanged = true;
            changed = true;
        }
        boolean stationsChanged = false;
        if (updatedLine.getStationIds() != null && !java.util.Objects.equals(existing.getStationIds(), updatedLine.getStationIds())) {
            existing.setStationIds(updatedLine.getStationIds());
            stationsChanged = true;
            changed = true;
        }
        if (freqChanged || stationsChanged) {
            existing.setTotalDuration(calculateTotalDuration(existing));
        }

        if (!java.util.Objects.equals(existing.getFirstDeparture(), updatedLine.getFirstDeparture())) {
            existing.setFirstDeparture(updatedLine.getFirstDeparture());
            changed = true;
        }

        // Automatically set active to false if less than 3 stations or none
        if (existing.getStationIds() == null || existing.getStationIds().size() < 3) {
            existing.setActive(false);
            changed = true;
        } else if (existing.isActive() != updatedLine.isActive()) {
            existing.setActive(updatedLine.isActive());
            changed = true;
        }

        if (changed) {
            existing.setUpdatedAt(java.time.LocalDateTime.now());
        }

        return metroLineRepo.save(existing);
    }

    public List<Trip> getTripsForLine(String lineId) {
        String collectionName = "trips_" + lineId;
        return mongoTemplate.findAll(Trip.class, collectionName);
    }

    public List<Trip> getTripsForStationInLine(String lineId, String stationId) {
        return tripRepo.findByLineId(lineId).stream()
            .filter(trip -> trip.getSegments().stream()
                .anyMatch(segment ->
                    segment.getFromStationId().equals(stationId) ||
                    segment.getToStationId().equals(stationId)
                )
            )
            .map(trip -> {
                Trip filteredTrip = new Trip();
                filteredTrip.setTripId(trip.getTripId());
                filteredTrip.setLineId(trip.getLineId());
                filteredTrip.setDepartureTime(trip.getDepartureTime());
                filteredTrip.setArrivalTime(trip.getArrivalTime());
                filteredTrip.setReturnTrip(trip.isReturnTrip());
                List<Trip.TripSegment> filteredSegments = trip.getSegments().stream()
                    .filter(segment ->
                        segment.getFromStationId().equals(stationId) ||
                        segment.getToStationId().equals(stationId)
                    )
                    .toList();
                filteredTrip.setSegments(filteredSegments);
                return filteredTrip;
            })
            .collect(Collectors.toList());
    }

    public void deleteAllTrips() {
        // Drop all trips collections for all lines
        List<MetroLine> lines = metroLineRepo.findAll();
        for (MetroLine line : lines) {
            String collectionName = "trips_" + line.getLineId();
            mongoTemplate.dropCollection(collectionName);
        }
    }

    private int calculateTotalDuration(MetroLine metroLine) {
        int numStations = metroLine.getStationIds() != null ? metroLine.getStationIds().size() : 0;
        int freq = parseFrequency(metroLine.getFrequencyMinutes());
        return numStations > 1 ? (numStations - 1) * freq : 0;
    }

    public List<Trip> getAllTrips() {
        // Aggregate all trips from all line collections
        List<Trip> allTrips = new ArrayList<>();
        List<MetroLine> lines = metroLineRepo.findAll();
        for (MetroLine line : lines) {
            String collectionName = "trips_" + line.getLineId();
            allTrips.addAll(mongoTemplate.findAll(Trip.class, collectionName));
        }
        return allTrips;
    }

    // Search for trips from a station to another at an approximate time
    public List<Trip> searchTrips(String fromStationId, String toStationId, String approximateTime) {
        List<Trip> allTrips = tripRepo.findAll();
        List<Trip> result = new ArrayList<>();
        java.time.LocalTime approx = null;
        if (approximateTime != null && !approximateTime.isBlank()) {
            try {
                approx = java.time.LocalTime.parse(approximateTime);
            } catch (Exception ignored) {}
        }
        for (Trip trip : allTrips) {
            List<Trip.TripSegment> segments = trip.getSegments();
            int fromIdx = -1, toIdx = -1;
            for (int i = 0; i < segments.size(); i++) {
                if (segments.get(i).getFromStationId().equals(fromStationId)) fromIdx = i;
                if (segments.get(i).getToStationId().equals(toStationId)) toIdx = i;
            }
            if (fromIdx != -1 && toIdx != -1 && fromIdx < toIdx) {
                if (approx != null) {
                    Trip.TripSegment fromSeg = segments.get(fromIdx);
                    java.time.LocalTime dep = fromSeg.getDepartureTime();
                    if (dep != null && Math.abs(java.time.Duration.between(dep, approx).toMinutes()) > 15) {
                        continue;
                    }
                }
                result.add(trip);
            }
        }
        return result;
    }
}