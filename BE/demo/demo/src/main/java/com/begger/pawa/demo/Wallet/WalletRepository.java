package com.begger.pawa.demo.Wallet;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface WalletRepository extends MongoRepository <PassengerWallet, String> {

    //find wallet base on passenger id
    Optional<PassengerWallet> findByPassengerId(String passengerId);
}
