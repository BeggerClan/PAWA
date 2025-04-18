package com.opwa.opwa_be.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.opwa.opwa_be.Model.MetroLine;
import com.opwa.opwa_be.Repository.MetroLineRepo;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/metro-lines")
public class MetroLineController {
    
    @Autowired
    private MetroLineRepo metroLineRepo;

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

    @PostMapping
    public MetroLine createMetroLine(@RequestBody MetroLine metroLine) {
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
}