package com.opwa.opwa_be.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.opwa.opwa_be.Model.Suspension;

import java.time.LocalDateTime;
import java.util.List;

public interface SuspensionRepo extends MongoRepository<Suspension, String> {
    List<Suspension> findByLineId(String lineId);
    List<Suspension> findByTripId(String tripId);
    List<Suspension> findByStartTimeLessThanEqualAndEndTimeGreaterThanEqual(LocalDateTime now1, LocalDateTime now2);
}