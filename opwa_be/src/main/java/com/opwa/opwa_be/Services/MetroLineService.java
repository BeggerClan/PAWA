package com.opwa.opwa_be.Services;

import com.opwa.opwa_be.Model.MetroLine;
import com.opwa.opwa_be.Model.Station;
import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.StationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MetroLineService {
    
    @Autowired
    private MetroLineRepo metroLineRepo;
    
    @Autowired
    private StationRepo stationRepo;

    public MetroLine findLineByIdWithStations(String id) {
        MetroLine line = metroLineRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Metro line not found with id: " + id));
        populateStations(line);
        return line;
    }

    public void deleteAllLines() {
        metroLineRepo.deleteAll();
    }

    public MetroLine createMetroLine(MetroLine metroLine) {
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

    public List<Station> getStationsForLine(String lineId) {
        MetroLine line = metroLineRepo.findById(lineId).orElseThrow();
        populateStations(line);
        return line.getStations();
    }

    public Station getStationFromLine(String lineId, String stationId) {
        MetroLine line = metroLineRepo.findById(lineId).orElseThrow();
        populateStations(line);
        
        return line.getStations().stream()
            .filter(station -> station.getStationId().equals(stationId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException(
                "Station " + stationId + " not found in line " + lineId));
    }

    public List<MetroLine> findAllWithStations() {
        List<MetroLine> lines = metroLineRepo.findAll();
        lines.forEach(this::populateStations);
        return lines;
    }

    public List<MetroLine> findByActiveStatus(boolean isActive) {
        List<MetroLine> lines = metroLineRepo.findByIsActive(isActive);
        lines.forEach(this::populateStations);
        return lines;
    }

    public MetroLine updateLineStatus(String id, boolean isActive) {
        MetroLine line = metroLineRepo.findById(id).orElseThrow();
        line.setActive(isActive);
        line.setUpdatedAt(LocalDateTime.now());
        return metroLineRepo.save(line);
    }

    public MetroLine addStationToLine(String lineId, String stationId) {
        MetroLine line = metroLineRepo.findById(lineId).orElseThrow();
        
        if (line.getStationIds() == null) {
            line.setStationIds(new ArrayList<>());
        }
        
        if (!line.getStationIds().contains(stationId)) {
            line.getStationIds().add(stationId);
            line.setUpdatedAt(LocalDateTime.now());
            metroLineRepo.save(line);
        }
        
        return findLineByIdWithStations(lineId);
    }

    public MetroLine removeStationFromLine(String lineId, String stationId) {
        MetroLine line = metroLineRepo.findById(lineId).orElseThrow();
        
        if (line.getStationIds() != null) {
            line.getStationIds().remove(stationId);
            line.setUpdatedAt(LocalDateTime.now());
            metroLineRepo.save(line);
        }
        
        return findLineByIdWithStations(lineId);
    }

    private void populateStations(MetroLine metroLine) {
        if (metroLine.getStationIds() != null) {
            List<Station> stations = metroLine.getStationIds().stream()
                .map(stationRepo::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
            metroLine.setStations(stations);
        }
    }
}