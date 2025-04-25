package com.begger.pawa.demo.TicketPurchase.repository;

import com.begger.pawa.demo.TicketPurchase.model.Wallet;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface WalletRepository extends MongoRepository<Wallet, String> {}