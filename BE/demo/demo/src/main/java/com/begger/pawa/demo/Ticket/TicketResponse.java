package com.begger.pawa.demo.Ticket;

import com.begger.pawa.demo.TicketType.TicketType;

import java.time.Instant;

public class TicketResponse {

    private String ticketId;
    private String ticketTypeCode;
    private String fromStation;
    private String toStation;
    private Instant purchaseTime;
    private Instant activationTime;
    private Instant expiryTime;
    private String status;


    // static converter
    public static TicketResponse fromEntity(Ticket t, TicketType type) {
        TicketResponse dto = new TicketResponse();
        dto.ticketId         = t.getTicketId().toHexString();
        dto.ticketTypeCode   = type.getCode();
        dto.fromStation      = t.getFromStation();
        dto.toStation        = t.getToStation();
        dto.purchaseTime     = t.getPurchaseTime();
        dto.activationTime   = t.getActivationTime();
        dto.expiryTime       = t.getExpiryTime();

        Instant now    = Instant.now();
        Instant expiry = t.getExpiryTime();

        // 1) Expired if we have an expiryTime and it’s in the past
        if (expiry != null && now.isAfter(expiry)) {
            dto.status = "EXPIRED";

        // 2) Active if they’ve tapped in (activationTime set) and not expired
        } else if (t.getActivationTime() != null) {
            dto.status = "ACTIVE";

        // 3) Otherwise (no activationTime yet, and either no expiry or not yet expired)
        } else {
            dto.status = "INACTIVE";
        }
        return dto;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getTicketTypeCode() {
        return ticketTypeCode;
    }

    public void setTicketTypeCode(String ticketTypeCode) {
        this.ticketTypeCode = ticketTypeCode;
    }

    public String getFromStation() {
        return fromStation;
    }

    public void setFromStation(String fromStation) {
        this.fromStation = fromStation;
    }

    public String getToStation() {
        return toStation;
    }

    public void setToStation(String toStation) {
        this.toStation = toStation;
    }

    public Instant getPurchaseTime() {
        return purchaseTime;
    }

    public void setPurchaseTime(Instant purchaseTime) {
        this.purchaseTime = purchaseTime;
    }

    public Instant getActivationTime() {
        return activationTime;
    }

    public void setActivationTime(Instant activationTime) {
        this.activationTime = activationTime;
    }

    public Instant getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(Instant expiryTime) {
        this.expiryTime = expiryTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
