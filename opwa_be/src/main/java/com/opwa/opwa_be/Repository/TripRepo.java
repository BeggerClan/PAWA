package com.opwa.opwa_be.Repository;

import com.opwa.opwa_be.model.Trip;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TripRepo extends MongoRepository<Trip, String> {
    List<Trip> findByLineId(String lineId);
    void deleteByLineId(String lineId);
}