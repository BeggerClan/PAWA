package com.begger.pawa.demo.Ticket;

import com.begger.pawa.demo.Cart.Cart;
import com.begger.pawa.demo.Cart.CartRequest;
import com.begger.pawa.demo.Cart.CartRequest.CartItem;
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
import java.util.ArrayList;
import java.util.List;

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


        Cart cart = cartService.getCart(passengerId); // ✅ Requires you to implement getCart()

        List<CartRequest.CartItem> cartItems = cart.getItems(); // From Cart object, not CartResponse
        List<Ticket> generatedTickets = generateTickets(passengerId, cartItems);
        saveTicketHistory(passengerId, transactionId, generatedTickets, totalFare);
        

        // 5. Clear the Cart
        cartService.clearCart(passengerId);

        return true;
    }

    private List<Ticket> generateTickets(String passengerId, List<CartRequest.CartItem> items) {
    List<Ticket> createdTickets = new ArrayList<>();
    ObjectId passengerObjectId = new ObjectId(passengerId);

    for (CartRequest.CartItem item : items) {
        for (int i = 0; i < item.getQuantity(); i++) {
            Ticket ticket = new Ticket();
            ticket.setPassengerId(passengerObjectId);
            ticket.setTicketTypeId(item.getTicketType());
            ticket.setFromStation(item.getFromStation());
            ticket.setToStation(item.getToStation());
            ticket.setActive(true);
            ticket.setExpired(false);
            ticket.setPurchaseTime(Instant.now());

            ticketRepo.save(ticket);
            createdTickets.add(ticket);
        }
    }

    return createdTickets;
}


    private void saveTicketHistory(String passengerId, ObjectId transactionId, List<Ticket> tickets, long totalFare) {
        if (tickets.isEmpty()) return;

        TicketHistory history = new TicketHistory();
        history.setTicketHistoryId(new ObjectId());
        history.setTicketId(tickets.get(0).getTicketId()); // optionally use the first ticket
        history.setPassengerId(new ObjectId(passengerId));
        history.setTransactionId(transactionId);
        history.setTicketTypeId(tickets.get(0).getTicketTypeId()); // assuming all are same type
        history.setTotalPurchasesPassenger(totalFare);
        history.setTotalQuantityTicketSold(tickets.size());
        history.setTotalAmountTicket(totalFare);

        ticketHistoryRepo.save(history);
    }


}
