package com.opwa.opwa_be.Service;

import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.StationRepo;
import com.opwa.opwa_be.model.MetroLine;
import com.opwa.opwa_be.model.Station;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class StationService {

    @Autowired
    private StationRepo stationRepo;

    @Autowired
    private MetroLineRepo metroLineRepo;

    public Station updateStation(String id, Station updatedStation) {
        Station existing = stationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found with id: " + id));

        boolean changed = false;

        if (!Objects.equals(existing.getStationName(), updatedStation.getStationName())) {
            existing.setStationName(updatedStation.getStationName());
            changed = true;
        }
        if (!Objects.equals(existing.getMapMarker(), updatedStation.getMapMarker())) {
            existing.setMapMarker(updatedStation.getMapMarker());
            changed = true;
        }
        if (!Objects.equals(existing.getLatitude(), updatedStation.getLatitude())) {
            existing.setLatitude(updatedStation.getLatitude());
            changed = true;
        }
        if (!Objects.equals(existing.getLongitude(), updatedStation.getLongitude())) {
            existing.setLongitude(updatedStation.getLongitude());
            changed = true;
        }
        // Add more fields as needed

        if (changed) {
            existing.setUpdatedAt(LocalDateTime.now());
        }

        return stationRepo.save(existing);
    }

    public void deleteStation(String id) {
        // Find all metro lines containing this station
        List<MetroLine> affectedLines = metroLineRepo.findByStationIdsContaining(id);

        // Remove station from all metro lines
        affectedLines.forEach(line -> {
            line.getStationIds().remove(id);
            metroLineRepo.save(line);
        });

        // Now delete the station
        stationRepo.deleteById(id);
    }

    public Station createStation(Station station) {
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
}