package com.opwa.opwa_be.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.opwa.opwa_be.Model.MetroLine;
import com.opwa.opwa_be.Model.Station;
import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.StationRepo;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/metro-lines")
public class MetroLineController {

    @Autowired
    private MetroLineRepo metroLineRepo;

    @Autowired
    private StationRepo stationRepo;

    @GetMapping
    public List<MetroLine> getAllMetroLines() {
        return metroLineRepo.findAll();
    }

    @GetMapping("/{id}")
    public MetroLine getMetroLineById(@PathVariable String id) {
        return metroLineRepo.findById(id).orElse(null);
    }

    @GetMapping("/active")
    public List<MetroLine> getActiveMetroLines() {
        return metroLineRepo.findByStatus(true);
    }

    @GetMapping("/name/{name}")
    public MetroLine getMetroLineByName(@PathVariable String name) {
        return metroLineRepo.findByLineName(name);
    }

    @GetMapping("/station/{stationId}")
    public List<MetroLine> getMetroLinesByStation(@PathVariable String stationId) {
        return metroLineRepo.findByStationIdsContaining(stationId);
    }

    @PostMapping
    public MetroLine createMetroLine(@RequestBody MetroLine metroLine) {
        metroLine.setCreatedAt(LocalDateTime.now());
        metroLine.setUpdatedAt(LocalDateTime.now());
        return metroLineRepo.save(metroLine);
    }

    @PutMapping("/{id}")
    public MetroLine updateMetroLine(@PathVariable String id, @RequestBody MetroLine metroLine) {
        metroLine.setLineId(id);
        metroLine.setUpdatedAt(LocalDateTime.now());
        return metroLineRepo.save(metroLine);
    }

    @DeleteMapping("/{id}")
    public void deleteMetroLine(@PathVariable String id) {
        metroLineRepo.deleteById(id);
    }

    @GetMapping("/{id}/stations")
    public List<Station> getStationsForMetroLine(@PathVariable String id) {
        MetroLine metroLine = metroLineRepo.findById(id).orElse(null);
        if (metroLine == null) {
            return Collections.emptyList();
        }
        return stationRepo.findAllById(metroLine.getStationIds());
    }
}