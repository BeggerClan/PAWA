package com.begger.pawa.demo.Passenger;

import com.begger.pawa.demo.Passenger.Passenger;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PassengerRepository extends MongoRepository<Passenger, String> {

    Optional<Passenger> findByEmail(String email);
    Optional<Passenger> findByNationalId(String nationalId);
}
