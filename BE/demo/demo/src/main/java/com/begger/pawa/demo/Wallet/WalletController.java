package com.begger.pawa.demo.Wallet;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletService service;

    public WalletController(WalletService service) {
        this.service = service;
    }

    @GetMapping("/balance")
    public long getBalance(Principal principal) {
        return service.getWallet(principal.getName()).getBalance();
    }


    // return current wallet from the logged in passenger
    @GetMapping
    public WalletResponse getWallet (Principal principal){
        return service.getWallet(principal.getName());
    }

    // top up
    @PostMapping("/top-up")
    @ResponseStatus(HttpStatus.OK)
    public WalletResponse topUp (@Valid @RequestBody TopUpRequest request, Principal principal){
        return service.topUp(principal.getName(), request.getAmount());
    }
}
