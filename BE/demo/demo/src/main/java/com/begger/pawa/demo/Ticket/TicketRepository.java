package com.begger.pawa.demo.Ticket;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.bson.types.ObjectId;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, ObjectId> {

    List<Ticket> findByPassengerId(ObjectId passengerId);

}
