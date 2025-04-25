package com.begger.pawa.demo.TicketPurchase.controller;

import com.begger.pawa.demo.TicketPurchase.dto.PurchaseRequest;
import com.begger.pawa.demo.TicketPurchase.model.Ticket;
import com.begger.pawa.demo.TicketPurchase.service.TicketService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired private TicketService service;

    @PostMapping("/buy")
    public ResponseEntity<?> buyTicket(@RequestBody PurchaseRequest req,
                                       Authentication auth) {
        String email = auth.getName();
        try {
            Ticket ticket = service.purchase(email, req);
            return ResponseEntity.ok(Map.of(
                "status",   "SUCCESS",
                "ticketId", ticket.getId()
            ));
        } catch (IllegalStateException e) {
            // not enough balance
            return ResponseEntity
                .status(HttpStatus.PAYMENT_REQUIRED)
                .body(Map.of("status", "FAIL", "reason","INSUFFICIENT_FUNDS"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("status","FAIL","reason", e.getMessage()));
        }
    }
}
