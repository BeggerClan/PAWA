package com.begger.pawa.demo.Operator;

import java.time.Instant;
import com.begger.pawa.demo.Ticket.Ticket;

public class BookingRecordResponse {

    private String ticketId;
    private String passengerId;
    private String ticketTypeCode;
    private String status;           // INACTIVE, ACTIVE, EXPIRED
    private Instant activationTime;  // nullable
    private Instant expiryTime;      // nullable
    private String fromStation;
    private String toStation;

    public BookingRecordResponse() {}

    public BookingRecordResponse(String ticketId,
                                 String passengerId,
                                 String ticketTypeCode,
                                 String status,
                                 Instant activationTime,
                                 Instant expiryTime,
                                 String fromStation,
                                 String toStation) {
        this.ticketId         = ticketId;
        this.passengerId      = passengerId;
        this.ticketTypeCode   = ticketTypeCode;
        this.status           = status;
        this.activationTime   = activationTime;
        this.expiryTime       = expiryTime;
        this.fromStation      = fromStation;
        this.toStation        = toStation;
    }

    public String getTicketId()         { return ticketId; }
    public String getPassengerId()      { return passengerId; }
    public String getTicketTypeCode()   { return ticketTypeCode; }
    public String getStatus()           { return status; }
    public Instant getActivationTime()  { return activationTime; }
    public Instant getExpiryTime()      { return expiryTime; }
    public String getFromStation()      { return fromStation; }
    public String getToStation()        { return toStation; }

    public void setTicketId(String ticketId)           { this.ticketId = ticketId; }
    public void setPassengerId(String passengerId)     { this.passengerId = passengerId; }
    public void setTicketTypeCode(String code)         { this.ticketTypeCode = code; }
    public void setStatus(String status)               { this.status = status; }
    public void setActivationTime(Instant activationTime) { this.activationTime = activationTime; }
    public void setExpiryTime(Instant expiryTime)      { this.expiryTime = expiryTime; }
    public void setFromStation(String fromStation)     { this.fromStation = fromStation; }
    public void setToStation(String toStation)         { this.toStation = toStation; }


    // helper to map ticket entity to this DTO
    public static BookingRecordResponse fromEntity(Ticket t) {
        // determine activation status
        String status;
        if (t.getActivationTime() == null) {
            status = "INACTIVE";
        } else if (t.getExpiryTime() != null && Instant.now().isAfter(t.getExpiryTime())) {
            status = "EXPIRED";
        } else {
            status = "ACTIVE";
        }

        return new BookingRecordResponse(
                t.getTicketId().toHexString(),
                t.getPassengerId().toHexString(),
                t.getTicketTypeId(),
                status,
                t.getActivationTime(),
                t.getExpiryTime(),
                t.getFromStation(),
                t.getToStation()
        );
    }
}
