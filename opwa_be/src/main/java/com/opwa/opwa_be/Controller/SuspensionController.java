package com.opwa.opwa_be.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.opwa.opwa_be.Model.Suspension;
import com.opwa.opwa_be.Repository.SuspensionRepo;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/suspensions")
public class SuspensionController {
    
    @Autowired
    private SuspensionRepo suspensionRepo;

    @GetMapping
    public List<Suspension> getAllSuspensions() {
        return suspensionRepo.findAll();
    }

    @GetMapping("/active")
    public List<Suspension> getActiveSuspensions() {
        LocalDateTime now = LocalDateTime.now();
        return suspensionRepo.findByStartTimeLessThanEqualAndEndTimeGreaterThanEqual(now, now);
    }

    @GetMapping("/line/{lineId}")
    public List<Suspension> getSuspensionsByLine(@PathVariable String lineId) {
        return suspensionRepo.findByLineId(lineId);
    }

    @PostMapping
    public Suspension createSuspension(@RequestBody Suspension suspension) {
        return suspensionRepo.save(suspension);
    }

    @PutMapping("/{id}")
    public Suspension updateSuspension(@PathVariable String id, @RequestBody Suspension suspension) {
        suspension.setSuspensionId(id);
        return suspensionRepo.save(suspension);
    }

    @DeleteMapping("/{id}")
    public void deleteSuspension(@PathVariable String id) {
        suspensionRepo.deleteById(id);
    }
}