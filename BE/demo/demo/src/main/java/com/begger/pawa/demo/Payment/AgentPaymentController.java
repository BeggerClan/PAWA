package com.begger.pawa.demo.Payment;

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
@RequestMapping("/api/agent")
public class AgentPaymentController {

    private final TicketRepository ticketRepo;
    private final WalletRepository walletRepo;

    public AgentPaymentController(TicketRepository ticketRepo, WalletRepository walletRepo) {
        this.ticketRepo = ticketRepo;
        this.walletRepo = walletRepo;
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
}
