package com.opwa.opwa_be.Services;

import com.opwa.opwa_be.Model.MetroLine;
import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.StationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MetroLineService {
    
    @Autowired
    private MetroLineRepo metroLineRepo;
    @Autowired
    private StationRepo stationRepo;

    public MetroLine findLineByIdWithStations(String id) {
        MetroLine line = metroLineRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Metro line not found"));
        
        // Populate station data
        if (line.getStartStationId() != null) {
            line.setStartStation(stationRepo.findById(line.getStartStationId()).orElse(null));
        }
        if (line.getEndStationId() != null) {
            line.setEndStation(stationRepo.findById(line.getEndStationId()).orElse(null));
        }
        
        return line;
    }

    public void deleteAllLines() {
        metroLineRepo.deleteAll(); // Uses Spring Data MongoDB's built-in method
    }

    public MetroLine createMetroLine(MetroLine metroLine) {
        // Auto-generate ID if needed
        if (metroLine.getLineId() == null) {
            int maxNumber = metroLineRepo.findAll().stream()
                .map(m -> m.getLineId().substring(2))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);
            metroLine.setLineId(String.format("LN%d", maxNumber + 1));
        }
        metroLine.setUpdatedAt(LocalDateTime.now());
        return metroLineRepo.save(metroLine);
    }

    public List<MetroLine> findAllWithStations() {
        List<MetroLine> lines = metroLineRepo.findAll();
        lines.forEach(line -> {
            if (line.getStartStationId() != null) {
                line.setStartStation(stationRepo.findById(line.getStartStationId()).orElse(null));
            }
            if (line.getEndStationId() != null) {
                line.setEndStation(stationRepo.findById(line.getEndStationId()).orElse(null));
            }
        });
        return lines;
    }

    public List<MetroLine> findByActiveStatus(boolean isActive) {
        return metroLineRepo.findByIsActive(isActive);
    }

    public MetroLine updateLineStatus(String id, boolean isActive) {
        MetroLine line = metroLineRepo.findById(id).orElseThrow();
        line.setActive(isActive);
        line.setUpdatedAt(LocalDateTime.now());
        return metroLineRepo.save(line);
    }

    private void resolveStationReferences(MetroLine metroLine) {
        // Your reference resolution logic
    }
}