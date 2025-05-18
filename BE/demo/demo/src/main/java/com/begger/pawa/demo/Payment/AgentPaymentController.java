package com.begger.pawa.demo.Payment;

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
@RequestMapping("/api/agent")
public class AgentPaymentController {

    private final TicketRepository ticketRepo;
    private final WalletRepository walletRepo;
    private final TicketTypeRepository ticketTypeRepo;


    public AgentPaymentController(TicketRepository ticketRepo,
                               WalletRepository walletRepo,
                               TicketTypeRepository ticketTypeRepo) {
    this.ticketRepo = ticketRepo;
    this.walletRepo = walletRepo;
    this.ticketTypeRepo = ticketTypeRepo;
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
    public ResponseEntity<PaymentResponse> processPayment(@RequestBody PaymentRequest req) {
        ObjectId tid;

        // Validate ticketId format
        try {
            tid = new ObjectId(req.getTicketId());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid ticketId");
        }

        // 1. Retrieve the ticket
        Ticket ticket = ticketRepo.findById(tid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        // 2. Extract passenger ID
        String pid = ticket.getPassengerId().toHexString();

        // 3. Only handle WALLET payment for now
        if ("WALLET".equalsIgnoreCase(req.getPaymentMethod())) {
            // 3a. Retrieve wallet
            PassengerWallet wallet = walletRepo.findByPassengerId(pid)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wallet not found"));

            // 3b. Determine price from TicketType
            TicketType type = ticketTypeRepo.findByCode(ticket.getTicketTypeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket type not found"));

            long price = type.getPrice();
            long balance = wallet.getBalance();

            // 3c. Check if balance is sufficient
            if (balance < price) {
                long shortfall = price - balance;
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(
                        new PaymentResponse(balance, "Insufficient funds. Need to top up: " + shortfall + " VND")
                );
            }

            // 3d. Deduct and save
            wallet.setBalance(balance - price);
            wallet.setUpdatedAt(Instant.now());
            walletRepo.save(wallet);

            // 3e. Return success response
            return ResponseEntity.ok(new PaymentResponse(wallet.getBalance(), "Payment successful via eWallet"));
        }

        // 4. Unsupported payment method
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new PaymentResponse(0, "Unsupported or missing payment method")
        );
    }

}
