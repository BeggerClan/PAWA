package com.begger.pawa.demo.Passenger;

import com.begger.pawa.demo.Passenger.Passenger;
import com.begger.pawa.demo.Passenger.PassengerRegistrationRequest;
import com.begger.pawa.demo.Passenger.PassengerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@Service
public class PassengerService {


    private final PassengerRepository repo;
    private final PasswordEncoder passwordEncoder;

    public PassengerService(PassengerRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Register a new Passenger.
     * @throws ResponseStatusException(409) if email or nationalId already exist.
     */

    public Passenger register (PassengerRegistrationRequest req) {
        // check for duplicate email
        repo.findByEmail(req.getEmail())
                .ifPresent(p -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT, "Email is already existed"
                    );
                });

        // check db for exist national ID
        repo.findByNationalId(req.getNationalId())
                .ifPresent(p -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT, "National Id has been registered"
                    );
                });

        // Map DTO to Entity
        Passenger p  = new Passenger();
        p.setEmail(req.getEmail());
        p.setPassword(passwordEncoder.encode(req.getPassword()));
        p.setFirstName(req.getFirstName());
        p.setMiddleName(req.getMiddleName());
        p.setLastName(req.getLastName());
        p.setNationalId(req.getNationalId());
        p.setDob(req.getDob());
        p.setResidenceAddress(req.getResidenceAddress());
        p.setPhoneNumber(req.getPhoneNumber());
        p.setStudentId(req.getStudentId());
        p.setDisabilityStatus(req.getDisabilityStatus());
        p.setRevolutionaryStatus(req.getRevolutionaryStatus());

        // set default for missing attribute
        Instant now = Instant.now();
        p.setCreatedAt(now);
        p.setUpdatedAt(now);
        p.setVerified(false);
        p.setGuest(false);

        // google account and tickID is null for now

        return repo.save(p);
    }
}
