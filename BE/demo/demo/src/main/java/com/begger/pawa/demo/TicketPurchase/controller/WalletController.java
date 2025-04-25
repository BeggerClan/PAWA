package com.begger.pawa.demo.TicketPurchase.controller;

import com.begger.pawa.demo.TicketPurchase.service.WalletService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired private WalletService walletService;

    /** GET current balance */
    @GetMapping("/balance")
    public ResponseEntity<?> balance(Authentication auth) {
        String email = auth.getName();
        int bal = walletService.getBalance(email);
        return ResponseEntity.ok(Map.of("balance", bal));
    }

    /** POST top-up by amount */
    @PostMapping("/topup")
    public ResponseEntity<?> topUp(@RequestBody Map<String,Integer> body,
                                   Authentication auth) {
        String email = auth.getName();
        Integer amount = body.get("amount");
        if (amount == null || amount <= 0) {
            return ResponseEntity
              .badRequest()
              .body(Map.of("status","FAIL","reason","INVALID_AMOUNT"));
        }
        int newBal = walletService.credit(email, amount);
        return ResponseEntity.ok(Map.of(
          "status",  "SUCCESS",
          "balance", newBal
        ));
    }
}
