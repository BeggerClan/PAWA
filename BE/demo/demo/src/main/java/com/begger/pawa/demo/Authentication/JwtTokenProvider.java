package com.begger.pawa.demo.Authentication;

import com.begger.pawa.demo.Passenger.Passenger;
import com.begger.pawa.demo.Configuration.JwtProperties;
import com.begger.pawa.demo.Passenger.PassengerRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Component
public class JwtTokenProvider {

   private final JwtProperties props;
   private final PassengerRepository passengerRepository;

    public JwtTokenProvider(JwtProperties props,
                            PassengerRepository passengerRepository) {
        this.props = props;
        this.passengerRepository = passengerRepository;
    }

    // generate token
    public String generateToken(String email) {

        // load passenger from db
        Passenger p  = passengerRepository.findByEmail(email).
                orElseThrow();

        // prepare timer for the token
        Date now = new Date();
        Date expiry = new Date(now.getTime() + props.getExpiration() * 1000);

        // hash map for passenger field
        Map<String, Object> claims = new HashMap<>();
        claims.put("passengerId", p.getPassengerId());
        claims.put("email", p.getEmail());
        claims.put("firstName", p.getFirstName());
        claims.put("middleName", p.getMiddleName());
        claims.put("lastName", p.getLastName());
        claims.put("nationalId", p.getNationalId());
        claims.put("dob", p.getDob().toString());
        claims.put("residenceAddress", p.getResidenceAddress());
        claims.put("phoneNumber", p.getPhoneNumber());
        claims.put("studentId", p.getStudentId());
        claims.put("disabilityStatus", p.getDisabilityStatus());
        claims.put("revolutionaryStatus", p.getRevolutionaryStatus());
        claims.put("verified", p.getVerified());
        claims.put("guest", p.getGuest());

        // create and sign the jwt
        return Jwts.builder()
                .setSubject(p.getEmail())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .addClaims(claims)
                .signWith(SignatureAlgorithm.HS256, props.getSecret())
                .compact();
    }

}
