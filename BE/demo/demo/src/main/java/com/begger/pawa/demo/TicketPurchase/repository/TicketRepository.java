package com.begger.pawa.demo.TicketPurchase.repository;

import com.begger.pawa.demo.TicketPurchase.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TicketRepository extends MongoRepository<Ticket, String> {}
