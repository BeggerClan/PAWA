package com.opwa.opwa_be.Repository;

import com.opwa.opwa_be.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepo  extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

}
