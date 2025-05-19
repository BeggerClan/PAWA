package com.begger.pawa.demo.Payment;

import com.begger.pawa.demo.Passenger.Passenger;
import com.begger.pawa.demo.Passenger.PassengerRepository;
import com.begger.pawa.demo.Ticket.Ticket;
import com.begger.pawa.demo.Ticket.TicketRepository;
import com.begger.pawa.demo.TicketType.TicketType;
import com.begger.pawa.demo.TicketType.TicketTypeRepository;
import com.begger.pawa.demo.Wallet.PassengerWallet;
import com.begger.pawa.demo.Wallet.WalletRepository;

import java.time.Instant;

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
    private final TicketTypeRepository ticketTypeRepo;
    private final PassengerRepository passengerRepo;
    private String passengerId; // Optional: only used for wallet payments



    public AgentPaymentController(TicketRepository ticketRepo,
    WalletRepository walletRepo,
    TicketTypeRepository ticketTypeRepo,
    PassengerRepository passengerRepo) {
    this.ticketRepo = ticketRepo;
    this.walletRepo = walletRepo;
    this.ticketTypeRepo = ticketTypeRepo;
    this.passengerRepo = passengerRepo;
    }



    @PostMapping("/topup")
    public ResponseEntity<PaymentResponse> topUpWallet(@RequestBody AgentTopUpRequest req) {
        ObjectId passengerId;

        try {
            passengerId = new ObjectId(req.getPassengerId());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid passengerId");
        }

        PassengerWallet wallet = walletRepo.findByPassengerId(passengerId.toHexString())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wallet not found"));

        long newBalance = wallet.getBalance() + req.getAmount();
        wallet.setBalance(newBalance);
        wallet.setUpdatedAt(Instant.now());
        walletRepo.save(wallet);

        return ResponseEntity.ok(new PaymentResponse(newBalance, "Top-up successful"));
    }


    @PostMapping("/payments")
    public ResponseEntity<PaymentResponse> processAgentPayment(@RequestBody PaymentRequest req) {
        // 1. Validate ticket type
        if (req.getTicketTypeId() == null || req.getTicketTypeId().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ticket type ID is required.");
        }

        TicketType type = ticketTypeRepo.findByCode(req.getTicketTypeId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket type not found"));

        long expectedPrice = type.getPrice();

        // 2. Validate payment method
        if (req.getPaymentMethod() == null || req.getPaymentMethod().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment method is required");
        }

        String method = req.getPaymentMethod().toUpperCase();

        // 3. Handle wallet payment
        if ("WALLET".equals(method)) {
            if (req.getPassengerId() == null || req.getPassengerId().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "WALLET payments require a valid passengerId");
            }

            ObjectId passengerId;
            try {
                passengerId = new ObjectId(req.getPassengerId());
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid passengerId format");
            }

            PassengerWallet wallet = walletRepo.findByPassengerId(passengerId.toHexString())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wallet not found for this passenger"));

            long balance = wallet.getBalance();

            if (balance < expectedPrice) {
                long shortfall = expectedPrice - balance;
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(
                    new PaymentResponse(balance, "Insufficient funds. Need to top up: " + shortfall + " VND")
                );
            }

            wallet.setBalance(balance - expectedPrice);
            wallet.setUpdatedAt(Instant.now());
            walletRepo.save(wallet);

            return ResponseEntity.ok(new PaymentResponse(wallet.getBalance(), "eWallet payment successful"));
        }

        // 4. Handle cash payment
        else if ("CASH".equals(method)) {
            Long cash = req.getCashReceived();
            if (cash == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cash amount must be provided");
            }
            if (cash < expectedPrice) {
                return ResponseEntity.badRequest().body(
                    new PaymentResponse(0, "Insufficient cash. Ticket price is " + expectedPrice + " VND")
                );
            }

            long change = cash - expectedPrice;
            return ResponseEntity.ok(new PaymentResponse(change, "Cash payment successful. Change: " + change + " VND"));
        }

        // 5. Invalid method
        return ResponseEntity.badRequest().body(
            new PaymentResponse(0, "Unsupported payment method: " + method)
        );
    }

    

    // this was made by Dat in OPWA
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
