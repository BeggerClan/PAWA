package com.begger.pawa.demo.Transaction;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    private final TransactionRepository repo;

    public TransactionService(TransactionRepository repo) {
        this.repo = repo;
    }

    public ObjectId logTransaction(ObjectId walletId, double amount, String method) {
        Transaction tx = new Transaction();
        tx.setWalletId(walletId);
        tx.setAmount(amount);
        tx.setMethod(method);

        Transaction savedTransaction = repo.save(tx);
        return savedTransaction.getId();
    }
}
