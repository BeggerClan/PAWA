package com.begger.pawa.demo.Ticket;

import com.begger.pawa.demo.TicketType.TicketType;
import com.begger.pawa.demo.TicketType.TicketTypeRepository;
import com.begger.pawa.demo.TicketType.ValidFrom;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.lang.Nullable;

import java.security.Principal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final TicketRepository ticketRepo;
    private final TicketTypeRepository ticketTypeRepo;

    public TicketController(TicketService ticketService, TicketRepository ticketRepo, TicketTypeRepository ticketTypeRepo) {
        this.ticketService = ticketService;
        this.ticketRepo = ticketRepo;
        this.ticketTypeRepo = ticketTypeRepo;
    }

    @PostMapping("/purchase")
    public ResponseEntity<TicketResponse> purchaseTicket(
            @RequestParam String ticketTypeCode,
            @RequestParam (required = false) @Nullable String fromStation,
            @RequestParam (required = false) @Nullable String toStation,
            @RequestHeader("Authorization") String authHeader,
            Principal principal) {

        String token = authHeader.replace("Bearer ", "");
        TicketResponse resp = ticketService.purchaseTicket(
                principal.getName(),
                ticketTypeCode,
                fromStation,
                toStation,
                token
        );
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/purchase-cart")
    public ResponseEntity<String> purchaseFromCart(@RequestHeader("Authorization") String authHeader, Principal principal) {
        String token = authHeader.replace("Bearer ", "");
        boolean result = ticketService.purchaseFromCart(principal.getName(), token);
        if (result) {
            return ResponseEntity.ok("Tickets purchased successfully from cart.");
        } else {
            return ResponseEntity.badRequest().body("Insufficient funds for cart purchase.");
        }
    }

    @GetMapping("/history")
    public List<TicketResponse> getHistory(Principal principal){
        ObjectId pid = new ObjectId(principal.getName());
        List<Ticket> tickets = ticketRepo.findByPassengerId(pid);
        return tickets.stream()
                .map(t -> {
                    TicketType type = ticketTypeRepo.findByCode(t.getTicketTypeId())
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR));
                    return TicketResponse.fromEntity(t, type);
                })
                .collect(Collectors.toList());
    }

    @PostMapping("/{ticketId}/activate")
    public TicketResponse activate(
            @PathVariable String ticketId,
            Principal principal
    ) {
        ObjectId tid = new ObjectId(ticketId);
        Ticket ticket = ticketRepo.findById(tid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));
        Instant now = Instant.now();
        Instant expiry = ticket.getExpiryTime();

        // expired & never activated
        if (expiry != null && now.isAfter(expiry) && ticket.getActivationTime() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ticket expired");
        }

        // activate if not already
        if (ticket.getActivationTime() == null) {
            ticket.setActivationTime(now);

            // look up the ticket type once
            TicketType type = ticketTypeRepo.findByCode(ticket.getTicketTypeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR));

            String code = type.getCode();
            // for these one-way codes, expiry == activation
            if ("ONE_WAY_4".equals(code) ||
                     "ONE_WAY_8".equals(code) ||
                     "ONE_WAY_UNL".equals(code)) {
                ticket.setExpiryTime(now);

                // otherwise, if it’s ACTIVATION-based, roll forward by its validity hours
            } else if (type.getValidFrom() == ValidFrom.ACTIVATION) {
                ticket.setExpiryTime(now.plus(type.getValidityDurationHours(), ChronoUnit.HOURS));
            }
            // else (PURCHASE-based types) leave the pre-set expiry alone

            ticketRepo.save(ticket);
        }

        TicketType type = ticketTypeRepo.findByCode(ticket.getTicketTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR));
        return TicketResponse.fromEntity(ticket, type);
    }
}
