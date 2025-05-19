package com.opwa.opwa_be.auth;

import com.opwa.opwa_be.model.Role;
import com.opwa.opwa_be.model.Shift;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class AddUserRequest {
    @NotBlank
    @Pattern(
        regexp = "^[\\p{L} .'-]{1,50}$",
        message = "First name must only contain letters and be max 50 characters (e.g., Nguyễn)"
    )
    private String firstName;

    @Pattern(
        regexp = "^[\\p{L} .'-]{0,50}$",
        message = "Middle name must only contain letters and be max 50 characters"
    )
    private String middleName;

    @NotBlank
    @Pattern(
        regexp = "^[\\p{L} .'-]{1,50}$",
        message = "Last name must only contain letters and be max 50 characters"
    )
    private String lastName;

    @NotBlank
    @Email(message = "Invalid email format. The email must end with '.com' or '.vn' (e.g., example@domain.com).")
    @Pattern(
        regexp = "^[^\\s@]+@[^\\s@]+\\.(com|vn)$",
        message = "Invalid email format. The email must end with '.com' or '.vn' (e.g., example@domain.com)."
    )
    private String email;

    @NotBlank
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%]).{8,}$",
        message = "Password must be at least 8 characters, include uppercase, lowercase, digit, and special character (e.g., @, #, $, %)."
    )
    private String password;

    @NotBlank
    @Pattern(
        regexp = "^\\d{12}$",
        message = "National ID must be exactly 12 digits (e.g., 012345678912)."
    )
    private String nationalId;

    @NotBlank
    @Pattern(
        regexp = "^\\d{2}/\\d{2}/\\d{4}$",
        message = "Invalid date of birth format. Please use 'dd/mm/yyyy' (e.g., 15/08/2000)."
    )
    private String dateOfBirth;

    @NotBlank
    @Pattern(
        regexp = "^[\\w\\s,.-]{1,100}$",
        message = "Address must not contain special symbols except , . -"
    )
    private String addressNumber;

    @NotBlank
    @Pattern(
        regexp = "^[\\w\\s,.-]{1,100}$",
        message = "Street must not contain special symbols except , . -"
    )
    private String street;

    @NotBlank
    @Pattern(
        regexp = "^[\\w\\s,.-]{1,100}$",
        message = "Ward must not contain special symbols except , . -"
    )
    private String ward;

    @NotBlank
    @Pattern(
        regexp = "^[\\w\\s,.-]{1,100}$",
        message = "District must not contain special symbols except , . -"
    )
    private String district;

    @NotBlank
    @Pattern(
        regexp = "^[\\w\\s,.-]{1,100}$",
        message = "City must not contain special symbols except , . -"
    )
    private String city;

    @NotBlank
    @Pattern(
        regexp = "^0\\d{9}$",
        message = "Phone number must be 10 digits and start with 0 (e.g., 0921123456)."
    )
    private String phone;

    @NotNull
    private Boolean employed;

    @NotNull
    private Role role; 

    @NotNull(message = "Shift is required and must be one of: DAY, EVENING, NIGHT")
    private Shift shift;
}