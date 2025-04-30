package com.begger.pawa.demo.Transaction;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.bson.types.ObjectId;

public interface TransactionRepository extends MongoRepository<Transaction, ObjectId> {
}
