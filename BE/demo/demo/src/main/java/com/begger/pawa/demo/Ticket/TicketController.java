package com.begger.pawa.demo.Ticket;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/purchase")
    public ResponseEntity<String> purchaseTicket(@RequestParam Long fare, Principal principal) {
        boolean result = ticketService.purchaseTicket(principal.getName(), fare);
        if (result) {
            return ResponseEntity.ok("Ticket purchased successfully.");
        } else {
            return ResponseEntity.badRequest().body("Insufficient funds.");
        }
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


}
