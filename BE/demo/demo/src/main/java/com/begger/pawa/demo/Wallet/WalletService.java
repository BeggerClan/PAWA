package com.begger.pawa.demo.Wallet;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.Instant;

@Service
public class WalletService {

    private final WalletRepository repo;

    public WalletService(WalletRepository repo) {
        this.repo = repo;
    }

    // retrieve wallet from passenger
    public WalletResponse getWallet (String passengerId) {
        PassengerWallet wallet = repo.findByPassengerId(passengerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "no wallet found"
                ));
        return WalletResponse.from(wallet);
    }

    // top up
    public WalletResponse topUp(String passengerId, Long amount){
        PassengerWallet wallet = repo.findByPassengerId(passengerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Wallet not found"));

        // update balance and time
        wallet.setBalance(wallet.getBalance() + amount);
        wallet.setUpdatedAt(Instant.now());

        PassengerWallet updated = repo.save(wallet);
        return WalletResponse.from(updated);
    }
}
