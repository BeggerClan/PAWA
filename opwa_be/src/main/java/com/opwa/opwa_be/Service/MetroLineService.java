package com.opwa.opwa_be.Service;

import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.StationRepo;
import com.opwa.opwa_be.Repository.SuspensionRepo;
import com.opwa.opwa_be.model.MetroLine;
import com.opwa.opwa_be.model.Station;
import com.opwa.opwa_be.model.Suspension;

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

    @Autowired
    private SuspensionRepo suspensionRepo;

    public MetroLine findLineByIdWithStations(String id) {
        MetroLine line = metroLineRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Metro line not found with id: " + id));
        populateStations(line);
        return line;
    }

    public String getLineName(String lineId) {
        return metroLineRepo.findById(lineId)
            .map(MetroLine::getLineName)
            .orElseThrow(() -> new RuntimeException("Metro line not found with id: " + lineId));
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

    public Suspension createSuspension(Suspension suspension) {
        metroLineRepo.findById(suspension.getMetroLineId()).ifPresent(line -> {
            line.setSuspended(true);
            line.setSuspensionReason(suspension.getReason());
            line.setSuspensionStartTime(suspension.getStartTime());
            line.setSuspensionEndTime(suspension.getExpectedEndTime());
            metroLineRepo.save(line);
        });
        return suspensionRepo.save(suspension);
    }

    public void resolveSuspension(String suspensionId) {
        suspensionRepo.findById(suspensionId).ifPresent(suspension -> {
            suspension.setActive(false);
            suspension.setUpdatedAt(LocalDateTime.now());
            suspensionRepo.save(suspension);
            
            metroLineRepo.findById(suspension.getMetroLineId()).ifPresent(line -> {
                line.setSuspended(false);
                line.setSuspensionReason(null);
                line.setSuspensionStartTime(null);
                line.setSuspensionEndTime(null);
                metroLineRepo.save(line);
            });
        });
    }

    public List<Suspension> getActiveSuspensions() {
        return suspensionRepo.findByIsActive(true);
    }

    public List<Suspension> getSuspensionsForLine(String lineId) {
        return suspensionRepo.findByMetroLineId(lineId);
    }

    public List<Suspension> getSuspensionsForStation(String stationId) {
        return suspensionRepo.findByAffectedStationIdsContaining(stationId);
    }

    public List<String> getAffectedStations(String lineId) {
        return metroLineRepo.findById(lineId)
            .map(MetroLine::getStationIds)
            .orElseThrow(() -> new RuntimeException("Line not found"));
    }
}