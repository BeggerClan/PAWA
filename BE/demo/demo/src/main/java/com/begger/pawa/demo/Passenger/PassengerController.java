package com.begger.pawa.demo.Passenger;

import com.begger.pawa.demo.Passenger.Passenger;
import com.begger.pawa.demo.Passenger.PassengerResponse;
import com.begger.pawa.demo.Passenger.PassengerRegistrationRequest;
import com.begger.pawa.demo.Passenger.PassengerService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/passengers")
@Validated
public class PassengerController {

    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    @PostMapping("/register")
    public ResponseEntity<PassengerResponse> register(
            @Valid @RequestBody PassengerRegistrationRequest req
    ){
        Passenger saved = passengerService.register(req);
        PassengerResponse resp = PassengerResponse.fromEntity(saved);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resp);
    }
}
