package com.opwa.opwa_be.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.opwa.opwa_be.model.Suspension;

import java.util.List;

public interface SuspensionRepo extends MongoRepository<Suspension, String> {
    List<Suspension> findByMetroLineId(String lineId);
    List<Suspension> findByIsActive(boolean isActive);
    List<Suspension> findByMetroLineIdAndIsActive(String lineId, boolean isActive);
    List<Suspension> findByAffectedStationIdsContaining(String stationId);
    boolean existsByMetroLineIdAndIsActive(String lineId, boolean isActive);
}