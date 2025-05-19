package com.begger.pawa.demo.Ticket;

import com.begger.pawa.demo.TicketType.TicketType;
import com.begger.pawa.demo.TicketType.ValidFrom;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Document(collection = "tickets")
public class Ticket {


    @MongoId
    private ObjectId ticketId; // Mongo ObjectId


    private ObjectId passengerId; // Change to ObjectId if passengerId is an ObjectId; otherwise adjust
    private String ticketTypeId;
    private Instant purchaseTime;
    private Instant activationTime;
    private String fromStation;
    private String toStation;
    private boolean isActive;
    private boolean isExpired;
    private Instant expiryTime;

    public Ticket() {
        this.ticketId = new ObjectId();
        this.purchaseTime = Instant.now();
        this.isActive = true;
        this.isExpired = false;
    }

    public static Ticket createOnPurchase(
            TicketType type,
            ObjectId passengerId,
            String fromStation,
            String toStation,
            boolean freeRide
    ) {
        System.out.println("⚙️ Ticket.createOnPurchase called");
        System.out.println("type = " + type.getCode() + ", from = " + fromStation + ", to = " + toStation + ", free = " + freeRide);

        Ticket ticket = new Ticket();
        ticket.setPassengerId(passengerId);
        // use the TicketType code as the ticketTypeId
        ticket.setTicketTypeId(type.getCode());
        ticket.setFromStation(fromStation);
        ticket.setToStation(toStation);

        Instant now = Instant.now();
        ticket.setPurchaseTime(now);

        // for types that expire from purchase (e.g. one-way)
        if (type.getValidFrom() == ValidFrom.PURCHASE) {
            ticket.setExpiryTime(now.plus(type.getValidityDurationHours(), ChronoUnit.HOURS));
        }
        // leave activationTime null; it will be set on activation
        System.out.println("✔ Ticket object built successfully");
        return ticket;
    }


    public void setPurchaseTime(Instant purchaseTime) {
        this.purchaseTime = purchaseTime;
    }
    

    public ObjectId getTicketId() {
        return ticketId;
    }

    public ObjectId getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(ObjectId passengerId) {
        this.passengerId = passengerId;
    }

    public String getTicketTypeId() {
        return ticketTypeId;
    }

    public void setTicketTypeId(String ticketTypeId) {
        this.ticketTypeId = ticketTypeId;
    }

    public Instant getPurchaseTime() {
        return purchaseTime;
    }

    public Instant getActivationTime() {
        return activationTime;
    }

    public void setActivationTime(Instant activationTime) {
        this.activationTime = activationTime;
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isExpired() {
        return isExpired;
    }

    public void setExpired(boolean expired) {
        isExpired = expired;
    }

    public void setTicketId(ObjectId ticketId) {
        this.ticketId = ticketId;
    }

    public Instant getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(Instant expiryTime) {
        this.expiryTime = expiryTime;
    }
}
