package com.opwa.opwa_be.Controller;

import com.opwa.opwa_be.Service.MetroLineService;
import com.opwa.opwa_be.Service.StationService;
import com.opwa.opwa_be.model.MetroLine;
import com.opwa.opwa_be.model.Station;
import com.opwa.opwa_be.model.Trip;
import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.TripRepo;
import com.opwa.opwa_be.config.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/metro-lines")
public class MetroLineController {

    @Autowired
    private MetroLineService metroLineService;

    @Autowired
    private MetroLineRepo metroLineRepo;

    @Autowired
    private TripRepo tripRepo;

    @Autowired
    private StationService stationService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/get-all-metro-lines")
    public ResponseEntity<List<MetroLine>> getAllLines() {
        return ResponseEntity.ok(metroLineService.findAllWithStations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MetroLine> getLineById(@PathVariable String id) {
        MetroLine line = metroLineService.findLineByIdWithStations(id);
        if (line.getStations() != null) {
            line.getStations().sort((a, b) -> {
                int numA = Integer.parseInt(a.getStationId().replaceFirst("^ST", ""));
                int numB = Integer.parseInt(b.getStationId().replaceFirst("^ST", ""));
                return Integer.compare(numA, numB);
            });
        }
        return ResponseEntity.ok(line);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createMetroLine(@RequestBody MetroLine metroLine, HttpServletRequest request) {
        if (!hasAdminOrOperatorRole(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied."));
        }
        MetroLine savedLine = metroLineService.createMetroLine(metroLine);
        return ResponseEntity.ok(savedLine);
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
        List<Station> stations = metroLineService.getStationsForLine(lineId);
        stations.sort((a, b) -> {
            int numA = Integer.parseInt(a.getStationId().replaceFirst("^ST", ""));
            int numB = Integer.parseInt(b.getStationId().replaceFirst("^ST", ""));
            return Integer.compare(numA, numB);
        });
        return ResponseEntity.ok(stations);
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
    public ResponseEntity<?> generateTripsForAllLinesIndividually() {
        List<MetroLine> lines = metroLineService.findAllWithStations();
        List<String> generated = new java.util.ArrayList<>();
        for (MetroLine line : lines) {
            if (line.getStationIds() != null && line.getStationIds().size() > 1) {
                metroLineService.generateTripsForLine(line, java.time.LocalTime.of(22, 0));
                generated.add(line.getLineId());
            }
        }
        return ResponseEntity.ok(java.util.Map.of(
            "linesProcessed", generated.size(),
            "lines", generated
        ));
    }

    @GetMapping("/{id}/trips")
    public ResponseEntity<List<Trip>> getTripsForLine(@PathVariable String id) {
        return ResponseEntity.ok(metroLineService.getTripsForLine(id));
    }

    @GetMapping("/{lineId}/stations/{stationId}/trips")
    public ResponseEntity<List<Trip>> getTripsForStationInLine(
            @PathVariable String lineId,
            @PathVariable String stationId) {
        return ResponseEntity.ok(metroLineService.getTripsForStationInLine(lineId, stationId));
    }

    @DeleteMapping("/trips")
    public ResponseEntity<Void> deleteAllTrips() {
        metroLineService.deleteAllTrips();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMetroLine(@PathVariable String id, HttpServletRequest request) {
        if (!hasAdminOrOperatorRole(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied."));
        }
        metroLineService.deleteMetroLine(id);
        return ResponseEntity.ok(Map.of("message", "Metro line deleted successfully!"));
    }

    @GetMapping("/trips")
    public ResponseEntity<List<Trip>> getAllTrips() {
        List<Trip> allTrips = metroLineService.getAllTrips();
        return ResponseEntity.ok(allTrips);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMetroLine(
            @PathVariable String id,
            @RequestBody MetroLine updatedLine, HttpServletRequest request) {
        if (!hasAdminOrOperatorRole(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied."));
        }
        MetroLine saved = metroLineService.updateMetroLine(id, updatedLine);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/search-trips")
    public ResponseEntity<List<Trip>> searchTrips(
            @RequestParam String fromStationId,
            @RequestParam String toStationId,
            @RequestParam(required = false) String approximateTime
    ) {
        return ResponseEntity.ok(
            metroLineService.searchTrips(fromStationId, toStationId, approximateTime)
        );
    }

    // Utility method for role check (take token the same way as UserController)
    private boolean hasAdminOrOperatorRole(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        String token = authHeader.substring(7);
        List<String> roles = jwtService.extractRoles(token);
        return roles.contains("ADMIN") || roles.contains("OPERATOR");
    }
}