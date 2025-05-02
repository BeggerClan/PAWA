package com.begger.pawa.demo.Authentication;

import com.begger.pawa.demo.Passenger.Passenger;
import com.begger.pawa.demo.Passenger.PassengerRepository;
import com.nimbusds.jwt.JWT;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;

public class PasswordTimestampValidator implements OAuth2TokenValidator <Jwt> {

    private static final OAuth2Error EXPIRED = new OAuth2Error(
            "invalid_token",
            "This token was issued before password or email change", null
    );

    private final PassengerRepository passengerRepo;

    public PasswordTimestampValidator(PassengerRepository passengerRepo) {
        this.passengerRepo = passengerRepo;
    }

    @Override
    public OAuth2TokenValidatorResult validate (Jwt jwt){
        Instant issuedAt = jwt.getIssuedAt();
        String passengerId = jwt.getSubject();

        Passenger p = passengerRepo.findById(passengerId)
                .orElse(null);
        if(p == null){
            return OAuth2TokenValidatorResult.failure(EXPIRED);
        }

        Instant changedAt = p.getPasswordChangedAt();
        if (issuedAt.isBefore(changedAt)){
            return OAuth2TokenValidatorResult.failure(EXPIRED);
        }
        return OAuth2TokenValidatorResult.success();
    }
}
