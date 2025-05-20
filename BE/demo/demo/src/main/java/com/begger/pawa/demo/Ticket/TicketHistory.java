package com.begger.pawa.demo.Ticket;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "ticket_history")
public class TicketHistory {

    @MongoId
    private ObjectId ticketHistoryId;

    private ObjectId ticketId;
    private ObjectId passengerId;
    private ObjectId transactionId;
    private String ticketTypeId;
    private double totalPurchasesPassenger;
    private int totalQuantityTicketSold;
    private double totalAmountTicket;

    public ObjectId getTicketHistoryId() {
        return ticketHistoryId;
    }

    public void setTicketHistoryId(ObjectId ticketHistoryId) {
        this.ticketHistoryId = ticketHistoryId;
    }

    public ObjectId getTicketId() {
        return ticketId;
    }

    public void setTicketId(ObjectId ticketId) {
        this.ticketId = ticketId;
    }

    public ObjectId getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(ObjectId passengerId) {
        this.passengerId = passengerId;
    }

    public ObjectId getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(ObjectId transactionId) {
        this.transactionId = transactionId;
    }

    public String getTicketTypeId() {
        return ticketTypeId;
    }

    public void setTicketTypeId(String ticketTypeId) {
        this.ticketTypeId = ticketTypeId;
    }

    public double getTotalPurchasesPassenger() {
        return totalPurchasesPassenger;
    }

    public void setTotalPurchasesPassenger(double totalPurchasesPassenger) {
        this.totalPurchasesPassenger = totalPurchasesPassenger;
    }

    public int getTotalQuantityTicketSold() {
        return totalQuantityTicketSold;
    }

    public void setTotalQuantityTicketSold(int totalQuantityTicketSold) {
        this.totalQuantityTicketSold = totalQuantityTicketSold;
    }

    public double getTotalAmountTicket() {
        return totalAmountTicket;
    }

    public void setTotalAmountTicket(double totalAmountTicket) {
        this.totalAmountTicket = totalAmountTicket;
    }

    public Object getId() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getId'");
    }
}
