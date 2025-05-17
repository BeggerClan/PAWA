package com.begger.pawa.demo.Payment;

public class PaymentResponse {

    private long walletBalance;
    private String message;

    public PaymentResponse() {}

    public PaymentResponse(long walletBalance, String message) {
        this.walletBalance = walletBalance;
        this.message       = message;
    }

    public long getWalletBalance() {
        return walletBalance;
    }

    public void setWalletBalance(long walletBalance) {
        this.walletBalance = walletBalance;
    }

    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }

}
