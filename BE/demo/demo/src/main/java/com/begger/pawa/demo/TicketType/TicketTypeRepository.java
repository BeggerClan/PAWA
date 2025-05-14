package com.begger.pawa.demo.TicketType;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface TicketTypeRepository extends MongoRepository<TicketType, ObjectId> {
    Optional<TicketType> findByCode(String code);
}
