package com.opwa.opwa_be.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.opwa.opwa_be.model.User;

import java.util.Optional;

public interface UserRepo  extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByNationalId(String nationalId);
}
