package com.begger.pawa.demo.Passenger;

import java.time.Instant;


public class PassengerResponse {

    private String passengerId;
    private String email;
    private String firstName;
    private String middleName;
    private String lastName;
    private Boolean verified;
    private Boolean guest;
    private Instant createdAt;
    private Instant updatedAt;

    // Static for mapping
    public static PassengerResponse fromEntity(com.begger.pawa.demo.Passenger.Passenger p) {
        PassengerResponse resp = new PassengerResponse();
        resp.setPassengerId(p.getPassengerId());
        resp.setEmail(p.getEmail());
        resp.setFirstName(p.getFirstName());
        resp.setMiddleName(p.getMiddleName());
        resp.setLastName(p.getLastName());
        resp.setVerified(p.getVerified());
        resp.setGuest(p.getGuest());
        resp.setCreatedAt(p.getCreatedAt());
        resp.setUpdatedAt(p.getUpdatedAt());
        return resp;
    }

    public String getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(String passengerId) {
        this.passengerId = passengerId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public Boolean getGuest() {
        return guest;
    }

    public void setGuest(Boolean guest) {
        this.guest = guest;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
