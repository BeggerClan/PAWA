package com.begger.pawa.demo.Ticket;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.bson.types.ObjectId;

public interface TicketHistoryRepository extends MongoRepository<TicketHistory, ObjectId> {
}
