package com.opwa.opwa_be.auth;

import com.opwa.opwa_be.Model.Role;
import lombok.Data;

@Data
public class AddUserRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Role role; 
}
