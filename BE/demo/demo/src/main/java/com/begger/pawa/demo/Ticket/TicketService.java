package com.begger.pawa.demo.Ticket;

import com.begger.pawa.demo.Cart.Cart;
import com.begger.pawa.demo.Cart.CartRequest;
import com.begger.pawa.demo.Cart.CartRequest.CartItem;
import com.begger.pawa.demo.Cart.CartResponse;
import com.begger.pawa.demo.Cart.CartService;
import com.begger.pawa.demo.Configuration.JwtProperties;
import com.begger.pawa.demo.TicketType.Eligibility;
import com.begger.pawa.demo.TicketType.TicketType;
import com.begger.pawa.demo.TicketType.TicketTypeRepository;
import com.begger.pawa.demo.Transaction.TransactionService;
import com.begger.pawa.demo.Wallet.PassengerWallet;
import com.begger.pawa.demo.Wallet.WalletRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import java.nio.charset.StandardCharsets;
import com.begger.pawa.demo.TicketType.ValidFrom;
import java.time.temporal.ChronoUnit;

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
    private final TicketTypeRepository typeRepo;
    private final JwtProperties jwtProps;

    @Autowired
    public TicketService(WalletRepository walletRepo,
                         TicketRepository ticketRepo,
                         TicketHistoryRepository ticketHistoryRepo,
                         TransactionService transactionService,
                         CartService cartService,
                         TicketTypeRepository typeRepo,
                         JwtProperties jwtProps) {
        this.walletRepo = walletRepo;
        this.ticketRepo = ticketRepo;
        this.ticketHistoryRepo = ticketHistoryRepo;
        this.transactionService = transactionService;
        this.cartService = cartService;
        this.typeRepo = typeRepo;
        this.jwtProps = jwtProps;
        this.restTemplate = new RestTemplate();
    }

    // Existing simple purchase for one ticket (if needed)
    public TicketResponse purchaseTicket(
            String passengerId,
            String ticketTypeCode,
            String fromStation,
            String toStation,
            String authToken
    ) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtProps.getSecret().getBytes(StandardCharsets.UTF_8))
                .build()
                .parseClaimsJws(authToken)
                .getBody();
        boolean freeRide = Boolean.TRUE.equals(claims.get("eligibleFreeTicket", Boolean.class));

        TicketType type = typeRepo.findByCode(ticketTypeCode)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Unknown ticket type: " + ticketTypeCode));

        // only student can buy monthly student
        if (type.getEligibility() == Eligibility.STUDENT_ONLY) {
            String studentId = claims.get("studentId", String.class);
            if (studentId == null || studentId.isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Monthly student tickets are only available to registered students");
            }
        }

        // only for free eligible passenger
        if (type.getEligibility() == Eligibility.FREE_ELIGIBLE && !freeRide) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not eligible to purchase a free ticket");
        }


        long fare = freeRide ? 0L : type.getPrice();

        // wallet
        PassengerWallet wallet = walletRepo.findByPassengerId(passengerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wallet not found"));

        if (wallet.getBalance() < fare) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient funds");
        }

        // only deduct if not a free ride
        if (!freeRide) {
            wallet.setBalance(wallet.getBalance() - fare);
            wallet.setUpdatedAt(Instant.now());
            walletRepo.save(wallet);
        }

        // log the purchase
        ObjectId txId = transactionService.logTransaction(
                new ObjectId(wallet.getWalletId()),
                fare,
                "PURCHASE"
        );

        // create and save the ticket
        ObjectId passObjId = new ObjectId(passengerId);
        Ticket ticket = Ticket.createOnPurchase(
                type,
                passObjId,
                fromStation,
                toStation,
                freeRide     // passed through, though factory doesn’t use it
        );
        ticketRepo.save(ticket);
        saveTicketHistory(passengerId, txId, List.of(ticket), fare);

        return TicketResponse.fromEntity(ticket, type);

    }

    public boolean purchaseFromCart(String passengerId, String token) {

        // pull out the claims to see that if its free eligible user
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtProps.getSecret().getBytes(StandardCharsets.UTF_8))
                .build()
                .parseClaimsJws(token)
                .getBody();

        String studentId = claims.get("studentId", String.class);


        boolean freeRide = Boolean.TRUE.equals(claims.get("eligibleFreeTicket", Boolean.class));

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

        // check to see if its a free eligle user
        if (freeRide) {
            totalFare = 0L;
        }

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
        List<Ticket> generatedTickets = generateTickets(passengerId, cartItems, freeRide, studentId);
        saveTicketHistory(passengerId, transactionId, generatedTickets, totalFare);
        

        // 5. Clear the Cart
        cartService.clearCart(passengerId);

        return true;
    }

    private List<Ticket> generateTickets(String passengerId, List<CartRequest.CartItem> items, boolean freeRide, String studentId) {
        System.out.println("==> generateTickets called with " + items.size() + " items");
        System.out.println("passengerId = " + passengerId);
        System.out.println("freeRide = " + freeRide + ", studentId = " + studentId);

        
        List<Ticket> createdTickets = new ArrayList<>();
        ObjectId passId = new ObjectId(passengerId);

        for (CartRequest.CartItem item : items) {
            // 1) lookup the type by code
            System.out.println("Looking up ticket type: " + item.getTicketType());
            TicketType type = typeRepo.findByCode(item.getTicketType())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Unknown ticket type " + item.getTicketType()));

            if (type.getEligibility() == Eligibility.STUDENT_ONLY) {
                if (studentId == null || studentId.isBlank()) {
                    throw new ResponseStatusException(
                            HttpStatus.FORBIDDEN,
                            "Cannot add monthly student tickets: passenger is not a student"
                    );
                }
            }
            if (type.getEligibility() == Eligibility.FREE_ELIGIBLE && !freeRide) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Cannot add free tickets: passenger is not eligible for free rides");
            }

            // 2) create exactly 'quantity' tickets
            for (int i = 0; i < item.getQuantity(); i++) {
                System.out.println("Creating " + item.getQuantity() + " ticket(s) of type " + item.getTicketType());
                System.out.println("From: " + item.getFromStation() + ", To: " + item.getToStation());

                try {
                    Ticket ticket = Ticket.createOnPurchase(
                        type, passId,
                        item.getFromStation(),
                        item.getToStation(),
                        freeRide
                    );
                    ticketRepo.save(ticket);
                    createdTickets.add(ticket);
                } catch (Exception e) {
                    e.printStackTrace(); // ✅ Log detailed error
                    throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Failed to create ticket: " + e.getMessage()
                    );
                }
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
