package com.opwa.opwa_be.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.opwa.opwa_be.Model.Station;
import java.util.List;

public interface StationRepo extends MongoRepository<Station, String> {
    List<Station> findByStationNameContainingIgnoreCase(String name);
    List<Station> findByMapMarker(String marker);
}