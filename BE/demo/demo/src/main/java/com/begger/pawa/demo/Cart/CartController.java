package com.begger.pawa.demo.Cart;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/update")
    public ResponseEntity<Void> updateCart(@RequestBody CartRequest cartRequest, Principal principal) {
        cartService.updateCart(principal.getName(), cartRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/total")
    public ResponseEntity<CartResponse> getTotalFare(Principal principal) {
        long total = cartService.calculateTotalFare(principal.getName());
        CartResponse response = new CartResponse();
        response.setTotalFare(total);
        return ResponseEntity.ok(response);
    }
}
