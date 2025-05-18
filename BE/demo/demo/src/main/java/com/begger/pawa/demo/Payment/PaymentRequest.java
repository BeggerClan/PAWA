package com.begger.pawa.demo.Payment;

public class PaymentRequest {
    private String ticketId;
    private String paymentMethod;
    private Long cashReceived;


    public String getTicketId() {
        return ticketId;
    }

    public Long getCashReceived() {
        return cashReceived;
    }
    
    public void setCashReceived(Long cashReceived) {
        this.cashReceived = cashReceived;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
