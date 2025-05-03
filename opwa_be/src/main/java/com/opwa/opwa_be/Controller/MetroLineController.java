package com.opwa.opwa_be.Controller;

import com.opwa.opwa_be.Model.MetroLine;
import com.opwa.opwa_be.Repository.MetroLineRepo;
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

    @PostMapping
    public ResponseEntity<MetroLine> createLine(@RequestBody MetroLine metroLine) {
        metroLine.setCreatedAt(LocalDateTime.now()); // Set creation timestamp
        return ResponseEntity.ok(metroLineService.createMetroLine(metroLine));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<MetroLine> updateStatus(
            @PathVariable String id,
            @RequestParam boolean isActive) {
        return ResponseEntity.ok(metroLineService.updateLineStatus(id, isActive));
    }
}