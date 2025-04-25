package com.begger.pawa.demo.Wallet;

import java.time.Instant;

public class WalletResponse {

    private String walletId;
    private long balance;
    private Instant createdAt;
    private Instant updatedAt;

    // static factor for mapping
    public static WalletResponse from (PassengerWallet w) {
        WalletResponse dto = new WalletResponse();
        dto.walletId = w.getWalletId();
        dto.balance = w.getBalance();
        dto.createdAt = w.getCreatedAt();
        dto.updatedAt = w.getUpdatedAt();
        return dto;
    }

    public String getWalletId() {
        return walletId;
    }

    public void setWalletId(String walletId) {
        this.walletId = walletId;
    }

    public long getBalance() {
        return balance;
    }

    public void setBalance(long balance) {
        this.balance = balance;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
