package com.opwa.opwa_be.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.StationRepo;
import com.opwa.opwa_be.model.MetroLine;
import com.opwa.opwa_be.model.Station;
import com.opwa.opwa_be.Service.StationService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stations")
public class StationController {

    @Autowired
    private StationRepo stationRepo;

    @Autowired
    private StationService stationService;

    @GetMapping("/get-all-stations")
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

    @PostMapping("/create")
    public Station createStation(@RequestBody Station station) {
        return stationService.createStation(station);
    }

    @PutMapping("/{id}")
    public Station updateStation(@PathVariable String id, @RequestBody Station station) {
        return stationService.updateStation(id, station);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStation(@PathVariable String id) {
        stationService.deleteStation(id);
        return ResponseEntity.ok().build();
    }
}