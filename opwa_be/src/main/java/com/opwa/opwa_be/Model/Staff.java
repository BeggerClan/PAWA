package com.opwa.opwa_be.model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
@Document(collection = "staff")
@Data
@AllArgsConstructor

public class Staff {
@Id
    private int staff_id;
    
    private String staff_usename;

    private int staff_nationID;

    private String staff_firstname;

    private String staff_lastname;

    private String staff_email;

    private String staff_password;
    
    private String staff_phone;
    private String staff_address;
    private String staff_role;
    private LocalDate staff_birthday; 
}
