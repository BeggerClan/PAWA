package com.opwa.opwa_be.repo;

import com.opwa.opwa_be.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepo  extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

}
