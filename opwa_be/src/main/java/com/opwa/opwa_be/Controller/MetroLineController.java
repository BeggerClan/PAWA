package com.opwa.opwa_be.Controller;

import com.opwa.opwa_be.Model.MetroLine;
import com.opwa.opwa_be.Model.Station;
import com.opwa.opwa_be.Services.MetroLineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/metro-lines")
public class MetroLineController {

    @Autowired
    private MetroLineService metroLineService;

    @GetMapping
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
}