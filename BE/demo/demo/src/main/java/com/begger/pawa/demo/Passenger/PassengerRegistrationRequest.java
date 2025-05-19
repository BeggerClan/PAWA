package com.begger.pawa.demo.Passenger;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PassengerRegistrationRequest {

    @NotBlank @Email @Size(max=255)
    private String email;

    @NotBlank @Size(min=8, max=255)
    private String password;

    @NotBlank @Size(max=50)
    private String firstName;

    @Size(max=50)
    private String middleName;    // optional

    @NotBlank @Size(max=50)
    private String lastName;

    @Size(max=12)
    private String nationalId;

    @NotNull
    private LocalDate dob;    // maps to DATETIME

    @NotBlank @Size(max=50)
    private String residenceAddress;

    @NotBlank @Size(min=10, max=10)
    private String phoneNumber;

    @Size(max=50)
    private String studentId;     // optional

    @NotNull
    private Boolean disabilityStatus;

    @NotNull
    private Boolean revolutionaryStatus;

    public @NotBlank @Email @Size(max = 255) String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank @Email @Size(max = 255) String email) {
        this.email = email;
    }

    public @NotBlank @Size(min = 8, max = 255) String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank @Size(min = 8, max = 255) String password) {
        this.password = password;
    }

    public @NotBlank @Size(max = 50) String getFirstName() {
        return firstName;
    }

    public void setFirstName(@NotBlank @Size(max = 50) String firstName) {
        this.firstName = firstName;
    }

    public @Size(max = 50) String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(@Size(max = 50) String middleName) {
        this.middleName = middleName;
    }

    public @NotBlank @Size(max = 50) String getLastName() {
        return lastName;
    }

    public void setLastName(@NotBlank @Size(max = 50) String lastName) {
        this.lastName = lastName;
    }

    public @Size(max = 12) String getNationalId() {
        return nationalId;
    }

    public void setNationalId(@Size(max = 12) String nationalId) {
        this.nationalId = nationalId;
    }

    public @NotNull LocalDate getDob() {
        return dob;
    }

    public void setDob(@NotNull LocalDate dob) {
        this.dob = dob;
    }

    public @NotBlank @Size(max = 50) String getResidenceAddress() {
        return residenceAddress;
    }

    public void setResidenceAddress(@NotBlank @Size(max = 50) String residenceAddress) {
        this.residenceAddress = residenceAddress;
    }

    public @NotBlank @Size(min = 10, max = 10) String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(@NotBlank @Size(min = 10, max = 10) String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public @Size(max = 50) String getStudentId() {
        return studentId;
    }

    public void setStudentId(@Size(max = 50) String studentId) {
        this.studentId = studentId;
    }

    public @NotNull Boolean getDisabilityStatus() {
        return disabilityStatus;
    }

    public void setDisabilityStatus(@NotNull Boolean disabilityStatus) {
        this.disabilityStatus = disabilityStatus;
    }

    public @NotNull Boolean getRevolutionaryStatus() {
        return revolutionaryStatus;
    }

    public void setRevolutionaryStatus(@NotNull Boolean revolutionaryStatus) {
        this.revolutionaryStatus = revolutionaryStatus;
    }
}
