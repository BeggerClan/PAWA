package com.begger.pawa.demo.Profile;
import com.begger.pawa.demo.Passenger.Passenger;

import java.time.Instant;
import java.time.LocalDateTime;

public class ProfileResponse {
    private String passengerId;
    private String email;
    private String firstName;
    private String middleName;
    private String lastName;
    private String nationalId;
    private LocalDateTime dob;
    private String residenceAddress;
    private String phoneNumber;
    private String studentId;
    private Boolean disabilityStatus;
    private Boolean revolutionaryStatus;
    private Instant createdAt;
    private Instant updatedAt;
    private long walletBalance;

    public static ProfileResponse fromEntities(Passenger p, long balance) {
        ProfileResponse dto = new ProfileResponse();
        dto.passengerId = p.getPassengerId();
        dto.email = p.getEmail();
        dto.firstName = p.getFirstName();
        dto.middleName = p.getMiddleName();
        dto.lastName = p.getLastName();
        dto.nationalId = p.getNationalId();
        dto.dob = p.getDob();
        dto.residenceAddress = p.getResidenceAddress();
        dto.phoneNumber = p.getPhoneNumber();
        dto.studentId = p.getStudentId();
        dto.disabilityStatus = p.getDisabilityStatus();
        dto.revolutionaryStatus = p.getRevolutionaryStatus();
        dto.createdAt = p.getCreatedAt();
        dto.updatedAt = p.getUpdatedAt();
        dto.walletBalance = balance;
        return dto;
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

    public String getNationalId() {
        return nationalId;
    }

    public void setNationalId(String nationalId) {
        this.nationalId = nationalId;
    }

    public LocalDateTime getDob() {
        return dob;
    }

    public void setDob(LocalDateTime dob) {
        this.dob = dob;
    }

    public String getResidenceAddress() {
        return residenceAddress;
    }

    public void setResidenceAddress(String residenceAddress) {
        this.residenceAddress = residenceAddress;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public Boolean getDisabilityStatus() {
        return disabilityStatus;
    }

    public void setDisabilityStatus(Boolean disabilityStatus) {
        this.disabilityStatus = disabilityStatus;
    }

    public Boolean getRevolutionaryStatus() {
        return revolutionaryStatus;
    }

    public void setRevolutionaryStatus(Boolean revolutionaryStatus) {
        this.revolutionaryStatus = revolutionaryStatus;
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

    public long getWalletBalance() {
        return walletBalance;
    }

    public void setWalletBalance(long walletBalance) {
        this.walletBalance = walletBalance;
    }
}
