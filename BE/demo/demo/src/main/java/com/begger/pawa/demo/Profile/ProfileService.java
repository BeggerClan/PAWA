package com.begger.pawa.demo.Profile;

import com.begger.pawa.demo.Passenger.Passenger;
import com.begger.pawa.demo.Passenger.PassengerRepository;
import com.begger.pawa.demo.Passenger.PassengerService;
import com.begger.pawa.demo.Wallet.WalletService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@Service
public class ProfileService {

    private final PassengerRepository repo;
    private final WalletService walletService;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(PassengerRepository repo,
                          WalletService walletService,
                          PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.walletService = walletService;
        this.passwordEncoder = passwordEncoder;
    }

    // retrieve user profile
    public ProfileResponse getProfile (String passengerId) {
        Passenger p = repo.findById(passengerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,"Passenger not found in DB"
                ));
        long balance = walletService.getWallet(passengerId).getBalance();
        return ProfileResponse.fromEntities(p, balance);
    }

    // update user profile
    public ProfileResponse updateProfile (String passengerId, UpdateProfileRequest req){
        Passenger p = repo.findById(passengerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Passenger not found"));


        // check to see new entered email exist in db if not set the request email to passenger
        if(req.getEmail() != null && !req.getEmail().equals(p.getEmail())) {
            repo.findByEmail(req.getEmail()).ifPresent(
                    __ -> {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT, "Email already existed in DB"
                        );
                    }
            );
            p.setEmail(req.getEmail());
            p.setPasswordChangedAt(Instant.now());
        }

        // update for address and phone
        if (req.getResidenceAddress() != null) {
            p.setResidenceAddress(req.getResidenceAddress());
        }
        if (req.getPhoneNumber() != null) {
            p.setPhoneNumber(req.getPhoneNumber());
        }

        // change password
        if (req.getNewPassword() != null) {
            if (req.getCurrentPassword() == null ||
                !passwordEncoder.matches(req.getCurrentPassword(), p.getPassword())){
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Incorrect current password"
                );
            }
            p.setPassword(passwordEncoder.encode(req.getNewPassword()));
            p.setPasswordChangedAt(Instant.now());
        }

        // update the updatedAt
        p.setUpdatedAt(Instant.now());
        Passenger updated = repo.save(p);

        long balance = walletService.getWallet(passengerId).getBalance();
        return ProfileResponse.fromEntities(updated, balance);
    }
}
