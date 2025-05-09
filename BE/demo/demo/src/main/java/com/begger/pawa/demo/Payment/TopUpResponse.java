package com.begger.pawa.demo.Payment;

public class TopUpResponse {

    private String status;
    private long newBalance;

    public TopUpResponse(String status, long newBalance) {
        this.status     = status;
        this.newBalance = newBalance;
    }

    public String getStatus() {
        return status;
    }

    public long getNewBalance() {
        return newBalance;
    }
}
