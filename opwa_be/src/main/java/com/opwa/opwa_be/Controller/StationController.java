package com.opwa.opwa_be.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.opwa.opwa_be.Model.MetroLine;
import com.opwa.opwa_be.Model.Station;
import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.StationRepo;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stations")
public class StationController {
    
    @Autowired
    private StationRepo stationRepo;

    @Autowired
    private MetroLineRepo metroLineRepo;

    @GetMapping
    public ResponseEntity<List<Station>> getAllStations() {
        List<Station> stations = stationRepo.findAll();
        
        if (stations.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(stations);
    }

    @GetMapping("/{id}")
    public Station getStationById(@PathVariable String id) {
        return stationRepo.findById(id).orElse(null);
    }

    @GetMapping("/search")
    public List<Station> searchStationsByName(@RequestParam String name) {
        return stationRepo.findByStationNameContainingIgnoreCase(name);
    }

    @GetMapping("/marker/{marker}")
    public List<Station> getStationsByMarker(@PathVariable String marker) {
        return stationRepo.findByMapMarker(marker);
    }

    @PostMapping
    public Station createStation(@RequestBody Station station) {
        // Find the maximum existing ID number
        int maxNumber = stationRepo.findAll().stream()
            .map(s -> s.getStationId().substring(2)) // Remove "ST" prefix
            .mapToInt(Integer::parseInt)
            .max()
            .orElse(0); // Default to 0 if no stations exist
        
        station.setStationId(String.format("ST%d", maxNumber + 1));
        station.setCreatedAt(LocalDateTime.now());
        station.setUpdatedAt(LocalDateTime.now());
        return stationRepo.save(station);
    }

    @PutMapping("/{id}")
    public Station updateStation(@PathVariable String id, @RequestBody Station station) {
        station.setStationId(id);
        station.setUpdatedAt(LocalDateTime.now());
        return stationRepo.save(station);
    }

    @DeleteMapping("/{id}")
public ResponseEntity<?> deleteStation(@PathVariable String id) {
    // First find all metro lines containing this station
    List<MetroLine> affectedLines = metroLineRepo.findByStationIdsContaining(id);
    
    // Remove station from all metro lines
    affectedLines.forEach(line -> {
        line.getStationIds().remove(id);
        metroLineRepo.save(line);
    });
    
    // Now delete the station
    stationRepo.deleteById(id);
    
    return ResponseEntity.ok().build();
}
}