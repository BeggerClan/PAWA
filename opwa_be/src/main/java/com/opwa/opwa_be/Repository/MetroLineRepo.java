package com.opwa.opwa_be.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.opwa.opwa_be.model.MetroLine;

import java.util.List;

public interface MetroLineRepo extends MongoRepository<MetroLine, String> {
    List<MetroLine> findByIsActive(boolean isActive);
    List<MetroLine> findByLineNameContainingIgnoreCase(String name);
    List<MetroLine> findByStationIdsContaining(String stationId);
    List<MetroLine> findByIsSuspended(boolean isSuspended);
}