package com.begger.pawa.demo.Cart;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class CartService {

    private final CartRepository repo;

    public CartService(CartRepository repo) {
        this.repo = repo;
    }

    public void updateCart(String passengerId, CartRequest cartRequest) {
        Cart cart = repo.findByPassengerId(passengerId).orElse(new Cart());
        cart.setPassengerId(passengerId);
        cart.setItems(cartRequest.getItems());
        repo.save(cart);
    }

    public long calculateTotalFare(String passengerId) {
        Cart cart = repo.findByPassengerId(passengerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));
        return cart.getItems().stream()
                .mapToLong(item -> item.getQuantity() * item.getUnitPrice())
                .sum();
    }

    public void clearCart(String passengerId) {
        Cart cart = repo.findByPassengerId(passengerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));
        cart.setItems(List.of());
        repo.save(cart);
    }

    public Cart getCart(String passengerId) {
        return repo.findByPassengerId(passengerId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));
    }
    
}
