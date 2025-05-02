package com.begger.pawa.demo.Wallet;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class TopUpRequest {

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Long amount;

    public @NotNull(message = "Amount is required") @Positive(message = "Amount must be positive") Long getAmount() {
        return amount;
    }

    public void setAmount(@NotNull(message = "Amount is required") @Positive(message = "Amount must be positive") Long amount) {
        this.amount = amount;
    }
}
