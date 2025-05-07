package com.opwa.opwa_be.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.opwa.opwa_be.model.Staff;

public interface StaffRepo extends MongoRepository<Staff,Integer> {
    
    
}