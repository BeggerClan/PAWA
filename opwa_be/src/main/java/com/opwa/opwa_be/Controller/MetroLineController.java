package com.opwa.opwa_be.Controller;

import com.opwa.opwa_be.Service.MetroLineService;
import com.opwa.opwa_be.model.MetroLine;
import com.opwa.opwa_be.model.Station;
import com.opwa.opwa_be.model.Trip;
import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.TripRepo;
import com.opwa.opwa_be.model.Trip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/metro-lines")
public class MetroLineController {

    @Autowired
    private MetroLineService metroLineService;

     @Autowired
    private MetroLineRepo metroLineRepo;

     @Autowired
    private TripRepo tripRepo;

    @GetMapping("/get-all-metro-lines")
    public ResponseEntity<List<MetroLine>> getAllLines() {
        return ResponseEntity.ok(metroLineService.findAllWithStations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MetroLine> getLineById(@PathVariable String id) {
        return ResponseEntity.ok(metroLineService.findLineByIdWithStations(id));
    }

    @GetMapping("/active")
    public ResponseEntity<List<MetroLine>> getActiveLines() {
        return ResponseEntity.ok(metroLineService.findByActiveStatus(true));
    }

    @GetMapping("/inactive")
    public ResponseEntity<List<MetroLine>> getInactiveLines() {
        return ResponseEntity.ok(metroLineService.findByActiveStatus(false));
    }

    @GetMapping("/{lineId}/stations")
    public ResponseEntity<List<Station>> getStationsForLine(
            @PathVariable String lineId) {
        return ResponseEntity.ok(metroLineService.getStationsForLine(lineId));
    }

    // Get specific station from line (by position/index)
    @GetMapping("/{lineId}/stations/{stationId}")
    public ResponseEntity<Station> getStationFromLine(
            @PathVariable String lineId,
            @PathVariable String stationId) {
        return ResponseEntity.ok(metroLineService.getStationFromLine(lineId, stationId));
    }

    // Add station to line (POST)
    @PostMapping("/{lineId}/stations/{stationId}")
    public ResponseEntity<MetroLine> addStationToLine(
            @PathVariable String lineId,
            @PathVariable String stationId) {
        return ResponseEntity.ok(metroLineService.addStationToLine(lineId, stationId));
    }

    // Remove station from line (DELETE)
    @DeleteMapping("/{lineId}/stations/{stationId}")
    public ResponseEntity<MetroLine> removeStationFromLine(
            @PathVariable String lineId,
            @PathVariable String stationId) {
        return ResponseEntity.ok(metroLineService.removeStationFromLine(lineId, stationId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<MetroLine> updateStatus(
            @PathVariable String id,
            @RequestParam boolean isActive) {
        return ResponseEntity.ok(metroLineService.updateLineStatus(id, isActive));
    }

    @PostMapping("/{id}/generate-trips")
    public ResponseEntity<List<Trip>> generateTrips(
            @PathVariable String id,
            @RequestParam(required = false) String lastDeparture) {
        MetroLine metroLine = metroLineRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Metro line not found"));

        LocalTime lastDep = (lastDeparture != null)
                ? LocalTime.parse(lastDeparture)
                : LocalTime.of(6, 0); // default

        List<Trip> trips = metroLineService.generateTripsForLine(metroLine, lastDep);
        return ResponseEntity.ok(trips);
    }

    @PostMapping("/generate-trips")
    public ResponseEntity<List<Trip>> generateTripsForAllLines() {
        List<Trip> trips = metroLineService.generateTripsForAllLines();
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{id}/trips")
    public ResponseEntity<List<Trip>> getTripsForLine(@PathVariable String id) {
        return ResponseEntity.ok(tripRepo.findByLineId(id));
    }

    @GetMapping("/{lineId}/stations/{stationId}/trips")
    public ResponseEntity<List<Trip>> getTripsForStationInLine(
            @PathVariable String lineId,
            @PathVariable String stationId) {
        List<Trip> trips = tripRepo.findByLineId(lineId).stream()
            .filter(trip -> trip.getSegments().stream()
                .anyMatch(segment ->
                    segment.getFromStationId().equals(stationId) ||
                    segment.getToStationId().equals(stationId)
                )
            )
            .map(trip -> {
                // Create a copy of the trip with only the relevant segments
                Trip filteredTrip = new Trip();
                filteredTrip.setTripId(trip.getTripId());
                filteredTrip.setLineId(trip.getLineId());
                filteredTrip.setDepartureTime(trip.getDepartureTime());
                filteredTrip.setArrivalTime(trip.getArrivalTime());
                filteredTrip.setReturnTrip(trip.isReturnTrip());
                // Only include segments with the station
                List<Trip.TripSegment> filteredSegments = trip.getSegments().stream()
                    .filter(segment ->
                        segment.getFromStationId().equals(stationId) ||
                        segment.getToStationId().equals(stationId)
                    )
                    .toList();
                filteredTrip.setSegments(filteredSegments);
                return filteredTrip;
            })
            .toList();
        return ResponseEntity.ok(trips);
    }

    @DeleteMapping("/trips")
    public ResponseEntity<Void> deleteAllTrips() {
        tripRepo.deleteAll();
        return ResponseEntity.noContent().build();
    }
}