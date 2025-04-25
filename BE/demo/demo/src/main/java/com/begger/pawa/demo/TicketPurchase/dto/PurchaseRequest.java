package com.begger.pawa.demo.TicketPurchase.dto;

public class PurchaseRequest {
    private String ticketType;  // e.g. "ONE_WAY", "DAILY", "THREE_DAY", "MONTHLY_STUDENT", "MONTHLY_ADULT", "FREE"
    // getters & setters
    public String getTicketType() { return ticketType; }
    public void setTicketType(String ticketType) { this.ticketType = ticketType; }
}