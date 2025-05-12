package com.begger.pawa.demo.Passenger;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document("Passenger")
public class Passenger {

    //UUID
    @Id
    private String passengerId;

    // password need to be harsh
    private String email;
    private String password;

    private String firstName;
    private String middleName;
    private String lastName;

    private String nationalId;
    private LocalDate dob;
    private String residenceAddress;
    private String phoneNumber;
    private String studentId;
    private Boolean disabilityStatus;
    private Boolean revolutionaryStatus;


    private Instant createdAt;
    private Instant updatedAt;
    private String googleAccountId;
    private Boolean isGoogleLinked;
    private String ticketId;
    private Boolean isVerified;
    private Boolean isGuest;

    // track for when system change email or password
    private Instant passwordChangedAt;

    public Instant getPasswordChangedAt() {
        return passwordChangedAt;
    }

    public void setPasswordChangedAt(Instant passwordChangedAt) {
        this.passwordChangedAt = passwordChangedAt;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
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

    public String getGoogleAccountId() {
        return googleAccountId;
    }

    public void setGoogleAccountId(String googleAccountId) {
        this.googleAccountId = googleAccountId;
    }

    public Boolean getGoogleLinked() {
        return isGoogleLinked;
    }

    public void setGoogleLinked(Boolean googleLinked) {
        isGoogleLinked = googleLinked;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public Boolean getVerified() {
        return isVerified;
    }

    public void setVerified(Boolean verified) {
        isVerified = verified;
    }

    public Boolean getGuest() {
        return isGuest;
    }

    public void setGuest(Boolean guest) {
        isGuest = guest;
    }
}
