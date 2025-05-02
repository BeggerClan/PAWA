package com.begger.pawa.demo.Transaction;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import java.time.Instant;

@Document(collection = "transactions")
public class Transaction {

    @MongoId
    private ObjectId id; // Mongo ObjectId for Transaction

    private ObjectId walletId; // reference to PassengerWallet.walletId
    private double amount;
    private Instant timeStamp;
    private String method; // e.g., "PURCHASE", "TOP_UP"

    public Transaction() {
        this.timeStamp = Instant.now();
    }

    public ObjectId getId() {
        return id;
    }

    public ObjectId getWalletId() {
        return walletId;
    }

    public void setWalletId(ObjectId walletId) {
        this.walletId = walletId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Instant getTimeStamp() {
        return timeStamp;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }
}
