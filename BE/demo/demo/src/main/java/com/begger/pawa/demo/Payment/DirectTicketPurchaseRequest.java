package com.begger.pawa.demo.Payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.lang.Nullable;

public class DirectTicketPurchaseRequest {

    @Positive(message = "Amount must be positive")
    private Long amount;

    @NotBlank(message = "token required")
    private String paymentToken;

    @NotBlank(message = "ticketTypeCode required")
    private String ticketTypeCode;

    @Nullable
    private String fromStation;

    @Nullable
    private String toStation;

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

    public @NotBlank(message = "ticketTypeCode required") String getTicketTypeCode() {
        return ticketTypeCode;
    }

    public void setTicketTypeCode(@NotBlank(message = "ticketTypeCode required") String ticketTypeCode) {
        this.ticketTypeCode = ticketTypeCode;
    }

    @Nullable
    public String getFromStation() {
        return fromStation;
    }

    public void setFromStation(@Nullable String fromStation) {
        this.fromStation = fromStation;
    }

    @Nullable
    public String getToStation() {
        return toStation;
    }

    public void setToStation(@Nullable String toStation) {
        this.toStation = toStation;
    }
}