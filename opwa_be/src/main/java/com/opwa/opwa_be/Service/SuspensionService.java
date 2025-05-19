package com.opwa.opwa_be.Service;

import com.opwa.opwa_be.Repository.MetroLineRepo;
import com.opwa.opwa_be.Repository.SuspensionRepo;
import com.opwa.opwa_be.model.MetroLine;
import com.opwa.opwa_be.model.Suspension;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
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

    // Add this field to your service (or use a DB sequence for production)
    private static final AtomicLong SUSP_SEQ = new AtomicLong(1);

    private String generateSuspensionId(String metroLineId) {
        // Example: SUSP-LN3-20240517-0001
        String datePart = java.time.LocalDate.now().toString().replace("-", "");
        long seq = SUSP_SEQ.getAndIncrement();
        return String.format("SUSP-%s-%s-%04d", metroLineId, datePart, seq);
    }

    public Suspension createSuspension(Suspension suspension) {
        // Generate a clean ID if not set
        if (suspension.getId() == null || suspension.getId().isEmpty()) {
            suspension.setId(generateSuspensionId(suspension.getMetroLineId()));
        }
        suspension.setStartTime(LocalDateTime.now());
        suspension.setActive(true);

        // Update metro line status and active flag
        metroLineRepo.findById(suspension.getMetroLineId()).ifPresent(line -> {
            line.setSuspended(true);
            line.setSuspensionReason(suspension.getReason());
            line.setSuspensionStartTime(suspension.getStartTime());
            line.setSuspensionEndTime(suspension.getExpectedEndTime());
            if (suspension.getAffectedStationIds() != null && suspension.getAffectedStationIds().size() >= 3) {
                line.setActive(false);
            } else {
                line.setActive(true);
            }
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

            // Update metro line active status if needed
            metroLineRepo.findById(suspension.getMetroLineId()).ifPresent(line -> {
                if (currentStations.size() >= 3) {
                    line.setActive(false);
                    metroLineRepo.save(line);
                }
            });

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

    public void deleteAllSuspensions() {
        suspensionRepo.deleteAll();
    }

    public void deleteAllSuspensionsByLineId(String lineId) {
        suspensionRepo.deleteAll(suspensionRepo.findByMetroLineId(lineId));
    }

    public void updateMetroLineSuspendedStatus(String metroLineId) {
        // Get all active suspensions for this metro line
        List<Suspension> activeSuspensions = suspensionRepo.findByMetroLineIdAndIsActive(metroLineId, true);

        // Count total unique affected stations across all active suspensions
        int affectedStationCount = activeSuspensions.stream()
            .flatMap(s -> s.getAffectedStationIds() != null ? s.getAffectedStationIds().stream() : java.util.stream.Stream.empty())
            .collect(java.util.stream.Collectors.toSet())
            .size();

        metroLineRepo.findById(metroLineId).ifPresent(line -> {
            if (affectedStationCount == 0) {
                line.setSuspended(false);
            } else {
                line.setSuspended(true);
            }
            // Optionally, also update "active" status if you want to keep logic together:
            line.setActive(affectedStationCount < 3);
            metroLineRepo.save(line);
        });
    }

    public Suspension removeStationFromSuspension(String suspensionId, String stationId) {
        return suspensionRepo.findById(suspensionId).map(suspension -> {
            if (suspension.getAffectedStationIds() != null) {
                suspension.getAffectedStationIds().removeIf(id -> id.equals(stationId));
                if (suspension.getAffectedStationIds().isEmpty()) {
                    suspension.setActive(false);
                }
                suspension.setUpdatedAt(java.time.LocalDateTime.now());
                suspensionRepo.save(suspension);
                // Optionally, update metro line status
                updateMetroLineSuspendedStatus(suspension.getMetroLineId());
            }
            return suspension;
        }).orElseThrow(() -> new RuntimeException("Suspension not found"));
    }
}