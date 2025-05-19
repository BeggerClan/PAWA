package com.begger.pawa.demo.Payment;

import com.begger.pawa.demo.Passenger.Passenger;
import com.begger.pawa.demo.Passenger.PassengerRepository;
import com.begger.pawa.demo.Ticket.Ticket;
import com.begger.pawa.demo.Ticket.TicketRepository;
import com.begger.pawa.demo.Wallet.PassengerWallet;
import com.begger.pawa.demo.Wallet.WalletRepository;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/opwa/agent")
public class AgentPaymentController {

    private final TicketRepository ticketRepo;
    private final WalletRepository walletRepo;
    private final PassengerRepository passengerRepo;

    public AgentPaymentController(TicketRepository ticketRepo, WalletRepository walletRepo, PassengerRepository passengerRepo) {
        this.ticketRepo = ticketRepo;
        this.walletRepo = walletRepo;
        this.passengerRepo = passengerRepo;
    }

    // payment api
    @PostMapping("/payments")
    public PaymentResponse processPayment(@RequestBody PaymentRequest req) {
        ObjectId tid;
        try {
            tid = new ObjectId(req.getTicketId());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid ticketId: must be a 24-hex-char ObjectId"
            );
        }

        // find ticket in the system
        Ticket ticket = ticketRepo.findById(tid)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Ticket not found"));

        // fetch passenger wallet
        String pid = ticket.getPassengerId().toHexString();
        PassengerWallet wallet = walletRepo.findByPassengerId(pid)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Wallet not found"));

        // return current balance and confirmation
        long currentBalance = wallet.getBalance();
        return new PaymentResponse(currentBalance, "Payment successful");

    }

    // Lấy tất cả passengerId có trong hệ thống
    @GetMapping("/passenger-ids")
    public ResponseEntity<?> getAllPassengerIdsAndNames() {
        var wallets = walletRepo.findAll();
        var result = wallets.stream()
                .map(w -> passengerRepo.findById(w.getPassengerId())
                    .map(p -> {
                        String fullName = String.join(" ",
                            p.getFirstName() != null ? p.getFirstName() : "",
                            p.getMiddleName() != null ? p.getMiddleName() : "",
                            p.getLastName() != null ? p.getLastName() : ""
                        ).trim();
                        return java.util.Map.of(
                            "passengerId", p.getPassengerId(),
                            "name", fullName
                        );
                    })
                    .orElse(java.util.Map.of(
                        "passengerId", w.getPassengerId(),
                        "name", ""
                    ))
                )
                .toList();
        return ResponseEntity.ok(result);
    }
}
