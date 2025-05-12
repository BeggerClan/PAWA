package com.begger.pawa.demo.Payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CreditCardTopUpRequest {

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Long amount;

    @NotBlank(message = "Payment token is required")
    private String paymentToken;

    public @NotNull(message = "Amount is required") @Positive(message = "Amount must be positive") Long getAmount() {
        return amount;
    }

    public void setAmount(@NotNull(message = "Amount is required") @Positive(message = "Amount must be positive") Long amount) {
        this.amount = amount;
    }

    public @NotBlank(message = "Payment token is required") String getPaymentToken() {
        return paymentToken;
    }

    public void setPaymentToken(@NotBlank(message = "Payment token is required") String paymentToken) {
        this.paymentToken = paymentToken;
    }
}
