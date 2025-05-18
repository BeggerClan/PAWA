package com.begger.pawa.demo.Ticket;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import java.time.Instant;

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

    public Ticket() {
        this.ticketId = new ObjectId();
        this.purchaseTime = Instant.now();
        this.isActive = true;
        this.isExpired = false;
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


    public void setTicketTypeId(ObjectId objectId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setTicketTypeId'");
    }
}
