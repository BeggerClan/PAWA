package com.begger.pawa.demo.Payment;

public class TicketPurchaseResponse {

    private String status;
    private String ticketId;

    public TicketPurchaseResponse(String status, String ticketId) {
        this.status   = status;
        this.ticketId = ticketId;
    }

    public String getStatus() {
        return status;
    }

    public String getTicketId() {
        return ticketId;
    }
}
