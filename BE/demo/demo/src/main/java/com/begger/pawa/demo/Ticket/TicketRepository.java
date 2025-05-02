package com.begger.pawa.demo.Ticket;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.bson.types.ObjectId;

public interface TicketRepository extends MongoRepository<Ticket, ObjectId> {
}
