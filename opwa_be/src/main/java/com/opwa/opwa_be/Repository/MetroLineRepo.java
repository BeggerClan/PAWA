package com.opwa.opwa_be.Repository;

import com.opwa.opwa_be.Model.MetroLine;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MetroLineRepo extends MongoRepository<MetroLine, String> {
    List<MetroLine> findByIsActive(boolean isActive);
    List<MetroLine> findByLineNameContainingIgnoreCase(String name);
    List<MetroLine> findByStationIdsContaining(String stationId);
}