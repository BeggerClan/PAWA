// src/main/java/com/example/pawa/service/TicketService.java
package com.begger.pawa.demo.TicketPurchase.service;

import com.begger.pawa.demo.TicketPurchase.dto.PurchaseRequest;
import com.begger.pawa.demo.TicketPurchase.model.Ticket;
import com.begger.pawa.demo.TicketPurchase.repository.TicketRepository;
import java.time.Instant;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TicketService {
    @Autowired private WalletService walletService;
    @Autowired private TicketRepository ticketRepo;

    // Black Pepper ticket prices :contentReference[oaicite:0]{index=0}&#8203;:contentReference[oaicite:1]{index=1}
    private static final Map<String,Integer> PRICES = Map.of(
        "ONE_WAY",           8000,
        "DAILY",            40000,
        "THREE_DAY",        90000,
        "MONTHLY_STUDENT", 150000,
        "MONTHLY_ADULT",   300000,
        "FREE",                 0
    );

    /**
     * Attempts to purchase; on success returns saved Ticket;
     * on insufficient funds throws IllegalStateException.
     */
    public Ticket purchase(String email, PurchaseRequest req) {
        String type = req.getTicketType();
        int price = PRICES.getOrDefault(type, -1);
        if (price < 0) {
            throw new IllegalArgumentException("Unknown ticket type");
        }
        boolean ok = walletService.debit(email, price);
        if (!ok) {
            throw new IllegalStateException("INSUFFICIENT_FUNDS");
        }
        Ticket t = new Ticket();
        t.setEmail(email);
        t.setType(type);
        t.setPurchasedAt(Instant.now());
        return ticketRepo.save(t);
    }
}
