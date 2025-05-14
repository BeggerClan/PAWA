package com.begger.pawa.demo.Passenger;

import com.begger.pawa.demo.Wallet.PassengerWallet;
import com.begger.pawa.demo.Wallet.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.Period;

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
     * Register a new Passenger with enhanced validation.
     * @throws ResponseStatusException with specific error messages for validation failures
     */
    public Passenger register(PassengerRegistrationRequest req) {
        // Email validation
        if (!req.getEmail().matches("^[a-zA-Z0-9.]+@[a-zA-Z0-9]+(\\.[c][o][m]|\\.[v][n])$")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, 
                    "Invalid email format. The email must end with '.com' or '.vn' (e.g., example@domain.com)."
            );
        }

        // Check for duplicate email
        repo.findByEmail(req.getEmail())
                .ifPresent(p -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT, "Email is already registered"
                    );
                });

        // Check for duplicate national ID
        repo.findByNationalId(req.getNationalId())
                .ifPresent(p -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT, "National ID has already been registered"
                    );
                });

        // Password complexity validation
        if (!req.getPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).+$")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, 
                    "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
            );
        }

        // Name validation (Vietnamese characters allowed)
        String nameRegex = "^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$";
        if (req.getFirstName() != null && !req.getFirstName().matches(nameRegex)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, 
                    "First name must contain only alphabet characters, including Vietnamese characters."
            );
        }
        if (req.getMiddleName() != null && !req.getMiddleName().isEmpty() && !req.getMiddleName().matches(nameRegex)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, 
                    "Middle name must contain only alphabet characters, including Vietnamese characters."
            );
        }
        if (req.getLastName() != null && !req.getLastName().matches(nameRegex)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, 
                    "Last name must contain only alphabet characters, including Vietnamese characters."
            );
        }

        // National ID validation
        if (req.getNationalId() != null && !req.getNationalId().matches("^\\d{12}$")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, 
                    "National ID must be exactly 12 digits."
            );
        }

        // Date of birth validation - at least 6 years old
        if (req.getDob() != null) {
            LocalDateTime minDob = LocalDateTime.now().minusYears(6);
            if (req.getDob().isAfter(minDob)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, 
                        "You must be at least 6 years old to register."
                );
            }
        }

        // Residence address validation
        if (req.getResidenceAddress() != null && 
            !req.getResidenceAddress().matches("^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s,./-]+$")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, 
                    "Residence address can only contain alphanumeric characters, Vietnamese characters, and the symbols , . - /"
            );
        }

        // Phone number validation
        if (req.getPhoneNumber() != null && !req.getPhoneNumber().matches("^0\\d{9}$")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, 
                    "Phone number must be exactly 10 digits and start with 0."
            );
        }

        // Student ID validation
        if (req.getStudentId() != null && !req.getStudentId().isEmpty() && 
            !req.getStudentId().matches("^[a-zA-Z0-9]{1,15}$")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, 
                    "Student ID must contain only alphanumeric characters and not exceed 15 characters."
            );
        }

        // Map DTO to Entity
        Passenger p = new Passenger();
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

        // Set default for missing attribute
        Instant now = Instant.now();
        p.setPasswordChangedAt(now);
        p.setCreatedAt(now);
        p.setUpdatedAt(now);
        p.setVerified(false);
        p.setGuest(false);

        // Save passenger
        Passenger saved = repo.save(p);

        // Create wallet with zero balance
        PassengerWallet wallet = new PassengerWallet();
        wallet.setPassengerId(saved.getPassengerId());
        wallet.setBalance(0L);
        wallet.setCreatedAt(now);
        wallet.setUpdatedAt(now);

        walletRepo.save(wallet);

        return saved;
    }
}