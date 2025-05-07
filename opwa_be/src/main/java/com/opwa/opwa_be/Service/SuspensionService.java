package com.opwa.opwa_be.Service;

import com.opwa.opwa_be.Model.MetroLine;
import com.opwa.opwa_be.Model.Suspension;
import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.SuspensionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SuspensionService {

    @Autowired
    private SuspensionRepo suspensionRepo;

    @Autowired
    private MetroLineRepo metroLineRepo;

    // In SuspensionService.java
    public List<Suspension> getAllSuspensions() {
        // Get manual suspensions
        List<Suspension> manualSuspensions = suspensionRepo.findAll();

        // Get suspended lines without suspension records
        List<MetroLine> suspendedLines = metroLineRepo.findByIsSuspended(true).stream()
                .filter(line -> !suspensionRepo.existsByMetroLineIdAndIsActive(line.getLineId(), true))
                .collect(Collectors.toList());

        // Convert suspended lines to suspensions
        List<Suspension> autoSuspensions = suspendedLines.stream().map(line -> {
            Suspension suspension = new Suspension();
            suspension.setMetroLineId(line.getLineId());
            suspension.setLineName(line.getLineName());
            suspension
                    .setReason(line.getSuspensionReason() != null ? line.getSuspensionReason() : "AUTOMATIC_DETECTION");
            suspension.setAffectedStationIds(line.getStationIds());
            suspension.setStartTime(
                    line.getSuspensionStartTime() != null ? line.getSuspensionStartTime() : LocalDateTime.now());
            suspension.setExpectedEndTime(line.getSuspensionEndTime() != null ? line.getSuspensionEndTime()
                    : LocalDateTime.now().plusHours(1));
            suspension.setActive(true);
            return suspensionRepo.save(suspension);
        }).collect(Collectors.toList());

        // Combine results
        manualSuspensions.addAll(autoSuspensions);
        return manualSuspensions;
    }

    public List<Suspension> getSuspensionsByStatus(boolean active) {
        return suspensionRepo.findByIsActive(active);
    }

    public Suspension getSuspensionById(String id) {
        return suspensionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Suspension not found with id: " + id));
    }

    public List<Suspension> getSuspensionsForLine(String lineId) {
        return suspensionRepo.findByMetroLineId(lineId);
    }

    public List<Suspension> getActiveSuspensionsForLine(String lineId, boolean active) {
        return suspensionRepo.findByMetroLineIdAndIsActive(lineId, active);
    }

    public List<Suspension> getSuspensionsAffectingStation(String stationId) {
        return suspensionRepo.findByAffectedStationIdsContaining(stationId);
    }

    public Suspension createSuspension(Suspension suspension) {
        suspension.setStartTime(LocalDateTime.now());
        suspension.setActive(true);

        // Update metro line status
        metroLineRepo.findById(suspension.getMetroLineId()).ifPresent(line -> {
            line.setSuspended(true);
            line.setSuspensionReason(suspension.getReason());
            line.setSuspensionStartTime(suspension.getStartTime());
            line.setSuspensionEndTime(suspension.getExpectedEndTime());
            metroLineRepo.save(line);
        });

        return suspensionRepo.save(suspension);
    }

    public Suspension updateSuspensionDetails(
            String suspensionId,
            String newReason,
            String newDescription,
            Integer newDurationHours) {

        return suspensionRepo.findById(suspensionId).map(suspension -> {
            // Track if any changes were made
            boolean changesMade = false;

            // Update reason if provided
            if (newReason != null && !newReason.equals(suspension.getReason())) {
                suspension.setReason(newReason);
                changesMade = true;
            }

            // Update description if provided
            if (newDescription != null && !newDescription.equals(suspension.getDescription())) {
                suspension.setDescription(newDescription);
                changesMade = true;
            }

            // Handle duration changes
            if (newDurationHours != null) {
                LocalDateTime newEndTime = LocalDateTime.now().plusHours(newDurationHours);
                if (!newEndTime.equals(suspension.getExpectedEndTime())) {
                    suspension.setExpectedEndTime(newEndTime);
                    changesMade = true;
                }
            }

            if (changesMade) {
                suspension.setUpdatedAt(LocalDateTime.now());

                // Sync with MetroLine
                metroLineRepo.findById(suspension.getMetroLineId()).ifPresent(line -> {
                    if (newReason != null)
                        line.setSuspensionReason(newReason);
                    if (newDurationHours != null) {
                        line.setSuspensionEndTime(suspension.getExpectedEndTime());
                    }
                    metroLineRepo.save(line);
                });

                return suspensionRepo.save(suspension);
            }

            return suspension; // No changes
        }).orElseThrow(() -> new RuntimeException("Suspension not found"));
    }

    public Suspension addStationsToSuspension(String suspensionId, List<String> additionalStationIds) {
        return suspensionRepo.findById(suspensionId).map(suspension -> {
            // Get current stations and add new ones (avoid duplicates)
            List<String> currentStations = suspension.getAffectedStationIds();
            additionalStationIds.forEach(stationId -> {
                if (!currentStations.contains(stationId)) {
                    currentStations.add(stationId);
                }
            });

            suspension.setAffectedStationIds(currentStations);
            suspension.setUpdatedAt(LocalDateTime.now());
            return suspensionRepo.save(suspension);
        }).orElseThrow(() -> new RuntimeException("Suspension not found"));
    }

    public void resolveSuspension(String suspensionId) {
        suspensionRepo.findById(suspensionId).ifPresent(suspension -> {
            suspension.setActive(false);
            suspension.setUpdatedAt(LocalDateTime.now());
            suspensionRepo.save(suspension);

            metroLineRepo.findById(suspension.getMetroLineId()).ifPresent(line -> {
                line.setSuspended(false);
                line.setSuspensionReason(null);
                line.setSuspensionStartTime(null);
                line.setSuspensionEndTime(null);
                metroLineRepo.save(line);
            });
        });
    }

    public Suspension extendSuspension(String suspensionId, int additionalHours) {
        return suspensionRepo.findById(suspensionId).map(suspension -> {
            suspension.setExpectedEndTime(
                    suspension.getExpectedEndTime().plusHours(additionalHours));
            suspension.setUpdatedAt(LocalDateTime.now());

            // Update metro line end time
            metroLineRepo.findById(suspension.getMetroLineId()).ifPresent(line -> {
                line.setSuspensionEndTime(suspension.getExpectedEndTime());
                metroLineRepo.save(line);
            });

            return suspensionRepo.save(suspension);
        }).orElseThrow(() -> new RuntimeException("Suspension not found with id: " + suspensionId));
    }

    public void deleteSuspension(String suspensionId) {
        suspensionRepo.findById(suspensionId).ifPresent(suspension -> {
            // Reset metro line status if this was the active suspension
            if (suspension.isActive()) {
                metroLineRepo.findById(suspension.getMetroLineId()).ifPresent(line -> {
                    line.setSuspended(false);
                    line.setSuspensionReason(null);
                    line.setSuspensionStartTime(null);
                    line.setSuspensionEndTime(null);
                    metroLineRepo.save(line);
                });
            }
            suspensionRepo.deleteById(suspensionId);
        });
    }
}