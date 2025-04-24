package com.opwa.opwa_be.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.opwa.opwa_be.Model.Station;
import com.opwa.opwa_be.Repository.StationRepo;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {
    
    @Autowired
    private StationRepo stationRepo;

    @GetMapping
    public List<Station> getAllStations() {
        return stationRepo.findAll();
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
    public void deleteStation(@PathVariable String id) {
        stationRepo.deleteById(id);
    }
}