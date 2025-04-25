package com.begger.pawa.demo.TicketPurchase.service;

import com.begger.pawa.demo.TicketPurchase.model.Wallet;
import com.begger.pawa.demo.TicketPurchase.repository.WalletRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WalletService {
    @Autowired private WalletRepository repo;

    public boolean debit(String email, int amount) {
        Optional<Wallet> opt = repo.findById(email);
        if (opt.isEmpty() || opt.get().getBalance() < amount) {
            return false;
        }
        Wallet w = opt.get();
        w.setBalance(w.getBalance() - amount);
        repo.save(w);
        return true;
    }

    /** Increase balance by `amount`. Creates wallet if none exists. */
    public int credit(String email, int amount) {
        Wallet w = repo.findById(email).orElseGet(() -> {
            Wallet nw = new Wallet();
            nw.setEmail(email);
            nw.setBalance(0);
            return nw;
        });
        w.setBalance(w.getBalance() + amount);
        repo.save(w);
        return w.getBalance();
    }

    public int getBalance(String email) {
        return repo.findById(email).map(Wallet::getBalance).orElse(0);
    }
}