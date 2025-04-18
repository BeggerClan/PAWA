package com.opwa.opwa_be.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.opwa.opwa_be.Model.Trip;
import com.opwa.opwa_be.Repository.TripRepo;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    
    @Autowired
    private TripRepo tripRepo;

    @GetMapping
    public List<Trip> getAllTrips() {
        return tripRepo.findAll();
    }

    @GetMapping("/line/{lineId}")
    public List<Trip> getTripsByLine(@PathVariable String lineId) {
        return tripRepo.findByLineId(lineId);
    }

    @GetMapping("/active")
    public List<Trip> getActiveTrips() {
        return tripRepo.findByIsActive(true);
    }

    @PostMapping
    public Trip createTrip(@RequestBody Trip trip) {
        return tripRepo.save(trip);
    }

    @PutMapping("/{id}")
    public Trip updateTrip(@PathVariable String id, @RequestBody Trip trip) {
        trip.setTripId(id);
        return tripRepo.save(trip);
    }

    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable String id) {
        tripRepo.deleteById(id);
    }
}