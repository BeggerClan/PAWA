package com.begger.pawa.demo.Payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class TicketPurchaseRequest {

    @Positive(message = "Amount must be positive")
    private Long amount;

    @NotBlank (message = "token required")
    private String paymentToken;

    public @Positive(message = "Amount must be positive") Long getAmount() {
        return amount;
    }

    public void setAmount(@Positive(message = "Amount must be positive") Long amount) {
        this.amount = amount;
    }

    public @NotBlank(message = "token required") String getPaymentToken() {
        return paymentToken;
    }

    public void setPaymentToken(@NotBlank(message = "token required") String paymentToken) {
        this.paymentToken = paymentToken;
    }


}
