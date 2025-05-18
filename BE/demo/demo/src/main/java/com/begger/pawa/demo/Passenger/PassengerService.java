package com.begger.pawa.demo.Passenger;

import com.begger.pawa.demo.Passenger.Passenger;
import com.begger.pawa.demo.Passenger.PassengerRegistrationRequest;
import com.begger.pawa.demo.Passenger.PassengerRepository;

import com.begger.pawa.demo.Wallet.PassengerWallet;
import com.begger.pawa.demo.Wallet.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;

@Service
public class PassengerService {


    private final PassengerRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final WalletRepository walletRepo;

    public PassengerService(PassengerRepository repo, PasswordEncoder passwordEncoder, WalletRepository walletRepo) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.walletRepo = walletRepo;
    }

    /**
     * Register a new Passenger.
     * @throws ResponseStatusException(409) if email or nationalId already exist.
     */

    public Passenger register (PassengerRegistrationRequest req) {
        // check for duplicate email
        repo.findByEmail(req.getEmail())
                .ifPresent(p -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT, "Email is already existed"
                    );
                });

        // check db for exist national ID
        repo.findByNationalId(req.getNationalId())
                .ifPresent(p -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT, "National Id has been registered"
                    );
                });

        // Map DTO to Entity
        Passenger p  = new Passenger();
        p.setEmail(req.getEmail());
        p.setPassword(passwordEncoder.encode(req.getPassword()));
        p.setFirstName(req.getFirstName());
        p.setMiddleName(req.getMiddleName());
        p.setLastName(req.getLastName());
        p.setNationalId(req.getNationalId());
        p.setDob(req.getDob());
        p.setResidenceAddress(req.getResidenceAddress());
        p.setPhoneNumber(req.getPhoneNumber());
        p.setStudentId(req.getStudentId());
        p.setDisabilityStatus(req.getDisabilityStatus());
        p.setRevolutionaryStatus(req.getRevolutionaryStatus());

        // set default for missing attribute
        Instant now = Instant.now();
        p.setPasswordChangedAt(now);
        p.setCreatedAt(now);
        p.setUpdatedAt(now);
        p.setVerified(false);
        p.setGuest(false);

        LocalDate today = LocalDate.now();
        boolean age60OrAbove    = req.getDob().isBefore(today.minusYears(60));
        boolean age6OrBelow     = req.getDob().isAfter(today.minusYears(6));
        boolean hasDisability   = req.getDisabilityStatus();
        boolean isRevolutionary = req.getRevolutionaryStatus();

        p.setEligibleFreeTicket(age60OrAbove || age6OrBelow || hasDisability || isRevolutionary);

        // save passenger
        Passenger saved = repo.save(p);

        // create wallet with zero balance
        PassengerWallet wallet = new PassengerWallet();
        wallet.setPassengerId(saved.getPassengerId());
        wallet.setBalance(0L);
        wallet.setCreatedAt(now);
        wallet.setUpdatedAt(now);

        walletRepo.save(wallet);

        return saved;


    }
}
