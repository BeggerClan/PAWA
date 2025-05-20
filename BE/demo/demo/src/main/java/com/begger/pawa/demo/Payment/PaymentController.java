package com.begger.pawa.demo.Payment;

import com.begger.pawa.demo.Ticket.TicketResponse;
import com.begger.pawa.demo.Ticket.TicketService;
import com.begger.pawa.demo.Transaction.TransactionService;
import com.begger.pawa.demo.Wallet.PassengerWallet;
import com.begger.pawa.demo.Wallet.WalletRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;

import java.security.Principal;
import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping ("/api/payments/tickets")
public class PaymentController {

    private final StripePaymentClient stripe;
    private final TransactionService txService;
    private final WalletRepository walletRepo;
    private final TicketService ticketService;

    public PaymentController(StripePaymentClient stripe,
                             TransactionService txService, WalletRepository walletRepo, TicketService ticketService) {
        this.stripe    = stripe;
        this.txService = txService;
        this.walletRepo = walletRepo;
        this.ticketService = ticketService;
    }

    // buy ticket through stripe
    @PostMapping
    public ResponseEntity<TicketPurchaseResponse> purchaseTicket(@Valid @RequestBody TicketPurchaseRequest req){
        try {
            // charge through stripe
            Charge charge = stripe.charge(req.getAmount(), req.getPaymentToken());
            if (!charge.getPaid()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST , "Payment fail"
                );
            }

            // log transaction
            txService.logTransaction(null, req.getAmount(), "PURCHASE");

            // generate mock ticket (co gi An modify cai nay thanh real ticket nha)
            String ticketId = UUID.randomUUID().toString();

            // return success
            return ResponseEntity.ok(
                    new TicketPurchaseResponse("SUCCESS", ticketId)
            );

        } catch (StripeException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST , "Payment fail" + e.getMessage()
            );
        }
    }

    // top up through credit card
    @PostMapping("/wallet/top-up/credit-card")
    public ResponseEntity<TopUpResponse> topUpWithCard(@Valid @RequestBody CreditCardTopUpRequest req, Principal principal){
        // charge via stripe
       try {
           Charge charge = stripe.charge(req.getAmount(), req.getPaymentToken());
           if (!charge.getPaid()) {
               throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment failed");
           }

           // get wallet id
           PassengerWallet wallet = walletRepo.findByPassengerId(principal.getName())
                   .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "no wallet found"));

           // update balance
           wallet.setBalance(wallet.getBalance() + req.getAmount());
           wallet.setUpdatedAt(Instant.now());
           walletRepo.save(wallet);

           txService.logTransaction(
                   new ObjectId(wallet.getWalletId()),
                   req.getAmount(),
                   "TOP_UP"
           );

           return ResponseEntity.ok(new TopUpResponse("SUCCESS", wallet.getBalance()));
       } catch (StripeException e) {
           throw new ResponseStatusException(
                   HttpStatus.BAD_REQUEST , "Top-up fail" + e.getMessage()
           );
       }
    }

    @PostMapping("/direct")
    public ResponseEntity<TicketResponse> purchaseTicketDirect(
            @Valid @RequestBody DirectTicketPurchaseRequest req,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @Nullable Principal principal
    ) {
        try {
            // Charge via Stripe
            Charge charge = stripe.charge(req.getAmount(), req.getPaymentToken());
            if (!charge.getPaid()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment failed");
            }

            // 2) Log the raw transaction (no wallet)
            ObjectId txId = txService.logTransaction(
                    null,              // walletId = null
                    req.getAmount(),
                    "PURCHASE"
            );

            // Build identities for service
            String passengerId = (principal != null ? principal.getName() : null);
            String token       = (authHeader != null && authHeader.startsWith("Bearer "))
                    ? authHeader.replace("Bearer ", "")
                    : null;

            // Delegate to service to create + persist ticket + history
            TicketResponse resp = ticketService.purchaseDirectTicket(
                    passengerId,
                    req.getTicketTypeCode(),
                    req.getFromStation(),
                    req.getToStation(),
                    txId
            );

            return ResponseEntity.ok(resp);

        } catch (StripeException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment failed: " + e.getMessage()
            );
        }
    }
}
