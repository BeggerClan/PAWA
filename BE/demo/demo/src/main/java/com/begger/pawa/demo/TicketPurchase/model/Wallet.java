package com.begger.pawa.demo.TicketPurchase.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("wallets")
public class Wallet {
    @Id
    private String email;    // keyed by passenger email
    private int balance;     // in VND

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public int getBalance() { return balance; }
    public void setBalance(int balance) { this.balance = balance; }
}