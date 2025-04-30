package com.begger.pawa.demo.Ticket;

import com.begger.pawa.demo.Cart.CartResponse;
import com.begger.pawa.demo.Cart.CartService;
import com.begger.pawa.demo.Transaction.TransactionService;
import com.begger.pawa.demo.Wallet.PassengerWallet;
import com.begger.pawa.demo.Wallet.WalletRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@Service
public class TicketService {

    private final WalletRepository walletRepo;
    private final TicketRepository ticketRepo;
    private final TicketHistoryRepository ticketHistoryRepo;
    private final TransactionService transactionService;
    private final CartService cartService;
    private final RestTemplate restTemplate;

    @Autowired
    public TicketService(WalletRepository walletRepo,
                         TicketRepository ticketRepo,
                         TicketHistoryRepository ticketHistoryRepo,
                         TransactionService transactionService,
                         CartService cartService) {
        this.walletRepo = walletRepo;
        this.ticketRepo = ticketRepo;
        this.ticketHistoryRepo = ticketHistoryRepo;
        this.transactionService = transactionService;
        this.cartService = cartService;
        this.restTemplate = new RestTemplate();
    }

    // Existing simple purchase for one ticket (if needed)
    public boolean purchaseTicket(String passengerId, Long fare) {
        PassengerWallet wallet = walletRepo.findByPassengerId(passengerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wallet not found"));

        if (wallet.getBalance() < fare) return false;

        wallet.setBalance(wallet.getBalance() - fare);
        wallet.setUpdatedAt(Instant.now());
        walletRepo.save(wallet);

        return true;
    }

    public boolean purchaseFromCart(String passengerId, String token) {
        String url = "http://localhost:8080/api/cart/total";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<CartResponse> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                CartResponse.class
        );

        CartResponse cartResponse = response.getBody();
        if (cartResponse == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not fetch cart total");
        }
        long totalFare = cartResponse.getTotalFare();

        PassengerWallet wallet = walletRepo.findByPassengerId(passengerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wallet not found"));

        if (wallet.getBalance() < totalFare) return false;

        // 1. Deduct wallet
        wallet.setBalance(wallet.getBalance() - totalFare);
        wallet.setUpdatedAt(Instant.now());
        walletRepo.save(wallet);

        // 2. Log Transaction using ObjectId directly from wallet
        ObjectId transactionId = transactionService.logTransaction(
            new ObjectId(wallet.getWalletId()),
            totalFare,
            "PURCHASE"
        );


        // 3. Create Tickets (dummy ticket creation logic)
        generateTickets(passengerId);

        // 4. Create Ticket History (dummy logic)
        saveTicketHistory(passengerId, transactionId, totalFare);

        // 5. Clear the Cart
        cartService.clearCart(passengerId);

        return true;
    }

    private void generateTickets(String passengerId) {
        // Dummy ticket creation logic: Generate one ticket for demonstration.
        Ticket ticket = new Ticket();
        // Assuming passengerId can be converted to ObjectId. Adjust if necessary.
        ticket.setPassengerId(new ObjectId(passengerId));
        // Set a dummy ticketTypeId (you can adjust this part)
        ticket.setTicketTypeId(new ObjectId());
        ticket.setFromStation("DefaultFrom");
        ticket.setToStation("DefaultTo");
        ticketRepo.save(ticket);
    }

    private void saveTicketHistory(String passengerId, ObjectId transactionId, long totalFare) {
        TicketHistory history = new TicketHistory();
        history.setTicketHistoryId(new ObjectId());
        // For demonstration: link the first ticket generated to history.
        // In real scenarios, you might aggregate multiple tickets.
        history.setTicketId(new ObjectId());
        history.setPassengerId(new ObjectId(passengerId));
        history.setTransactionId(transactionId);
        history.setTicketTypeId(new ObjectId());
        history.setTotalPurchasesPassenger(totalFare);
        history.setTotalQuantityTicketSold(1); // dummy value
        history.setTotalAmountTicket(totalFare);

        ticketHistoryRepo.save(history);
    }
}
