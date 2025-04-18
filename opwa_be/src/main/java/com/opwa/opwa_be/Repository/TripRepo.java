package com.opwa.opwa_be.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.opwa.opwa_be.Model.Trip;
import java.util.List;

public interface TripRepo extends MongoRepository<Trip, String> {
    List<Trip> findByLineId(String lineId);
    List<Trip> findByIsActive(boolean isActive);
}