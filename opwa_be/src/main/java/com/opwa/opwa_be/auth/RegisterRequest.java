package com.opwa.opwa_be.auth;

import com.opwa.opwa_be.model.Role;
import com.opwa.opwa_be.model.Shift;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private String password;
    private String nationalId;
    private String dateOfBirth;
    private String addressNumber;
    private String street;
    private String ward;
    private String district;
    private String city;
    private String phone;
    private Boolean employed;
    private Role role;
    private Shift shift;
}
