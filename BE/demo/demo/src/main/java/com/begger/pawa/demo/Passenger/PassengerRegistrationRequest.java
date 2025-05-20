package com.begger.pawa.demo.Passenger;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PassengerRegistrationRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    @Pattern(regexp = "^[a-zA-Z0-9.]+@[a-zA-Z0-9]+(\\.[c][o][m]|\\.[v][n])$", 
             message = "Email must end with .com or .vn domain extensions")
    @Size(max = 255, message = "Email cannot exceed 255 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).+$", 
             message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character")
    private String password;

    @NotBlank(message = "First name is required")
    @Pattern(regexp = "^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$", 
            message = "First name must contain only alphabet characters, including Vietnamese characters")
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    private String firstName;

    @Pattern(regexp = "^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]*$", 
            message = "Middle name must contain only alphabet characters, including Vietnamese characters")
    @Size(max = 50, message = "Middle name cannot exceed 50 characters")
    private String middleName;    // optional

    @NotBlank(message = "Last name is required")
    @Pattern(regexp = "^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$", 
            message = "Last name must contain only alphabet characters, including Vietnamese characters")
    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    private String lastName;

    @NotBlank(message = "National ID is required")
    @Pattern(regexp = "^\\d{12}$", message = "National ID must be exactly 12 digits")
    private String nationalId;

    @NotNull(message = "Date of birth is required")
    private @NotNull LocalDate dob;    // maps to DATETIME

    @NotBlank(message = "Residence address is required")
    @Pattern(regexp = "^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s,./-]+$", 
             message = "Residence address can only contain alphanumeric characters, Vietnamese characters, and the symbols , . - /")
    @Size(max = 50, message = "Residence address cannot exceed 50 characters")
    private String residenceAddress;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^0\\d{9}$", message = "Phone number must be exactly 10 digits and start with 0")
    private String phoneNumber;

    @Pattern(regexp = "^[a-zA-Z0-9]{0,15}$", 
             message = "Student ID must contain only alphanumeric characters and not exceed 15 characters")
    private String studentId;     // optional

    @NotNull(message = "Disability status is required")
    private Boolean disabilityStatus;

    @NotNull(message = "Revolutionary status is required")
    private Boolean revolutionaryStatus;

    // Use existing getters and setters
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

    public @NotBlank @Size(max = 12) String getNationalId() {
        return nationalId;
    }

    public void setNationalId(@NotBlank @Size(max = 12) String nationalId) {
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