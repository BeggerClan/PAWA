package com.opwa.opwa_be.Controller;

import com.opwa.opwa_be.Repository.UserRepo;
import com.opwa.opwa_be.auth.AddUserRequest;
import com.opwa.opwa_be.config.JwtService;
import com.opwa.opwa_be.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {
    private final UserRepo userRepo;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/add")
    public ResponseEntity<?> addUser(@Valid @RequestBody AddUserRequest request, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Authorization header missing or invalid.");
        }

        String token = authHeader.substring(7);
        List<String> roles = jwtService.extractRoles(token);

        // Sửa: chỉ kiểm tra "ADMIN" và "OPERATOR"
        if (roles.contains("ADMIN") || roles.contains("OPERATOR")) {
            var user = User.builder()
                    .firstName(request.getFirstName())
                    .middleName(request.getMiddleName())
                    .lastName(request.getLastName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .nationalId(request.getNationalId())
                    .dateOfBirth(request.getDateOfBirth())
                    .addressNumber(request.getAddressNumber())
                    .street(request.getStreet())
                    .ward(request.getWard())
                    .district(request.getDistrict())
                    .city(request.getCity())
                    .phone(request.getPhone())
                    .employed(request.getEmployed())
                    .role(request.getRole())
                    .shift(request.getShift())
                    .build();
            userRepo.save(user);
            return ResponseEntity.ok(Map.of("message", "User added successfully!"));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied."));
        }
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody AddUserRequest request, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Authorization header missing or invalid.");
        }

        String token = authHeader.substring(7);
        List<String> roles = jwtService.extractRoles(token);

        if (roles.contains("ADMIN") || roles.contains("OPERATOR")) {
            var user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found."));

            if (request.getFirstName() != null && !request.getFirstName().isBlank()) user.setFirstName(request.getFirstName());
            if (request.getMiddleName() != null) user.setMiddleName(request.getMiddleName());
            if (request.getLastName() != null && !request.getLastName().isBlank()) user.setLastName(request.getLastName());
            if (request.getEmail() != null && !request.getEmail().isBlank()) user.setEmail(request.getEmail());
            if (request.getPassword() != null && !request.getPassword().isBlank()) user.setPassword(passwordEncoder.encode(request.getPassword()));
            if (request.getNationalId() != null) user.setNationalId(request.getNationalId());
            if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
            if (request.getAddressNumber() != null) user.setAddressNumber(request.getAddressNumber());
            if (request.getStreet() != null) user.setStreet(request.getStreet());
            if (request.getWard() != null) user.setWard(request.getWard());
            if (request.getDistrict() != null) user.setDistrict(request.getDistrict());
            if (request.getCity() != null) user.setCity(request.getCity());
            if (request.getPhone() != null) user.setPhone(request.getPhone());
            if (request.getEmployed() != null) user.setEmployed(request.getEmployed());
            if (request.getRole() != null) user.setRole(request.getRole());
            if (request.getShift() != null) user.setShift(request.getShift());

            userRepo.save(user);
            return ResponseEntity.ok(Map.of("message", "User updated successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied."));
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<User>> getAllUsers(HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        String token = authHeader.substring(7);
        List<String> roles = jwtService.extractRoles(token);

        if (roles.contains("ADMIN") || roles.contains("OPERATOR")) {
            List<User> users = userRepo.findAll();
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        String token = authHeader.substring(7);
        List<String> roles = jwtService.extractRoles(token);

        if (roles.contains("ADMIN") || roles.contains("OPERATOR")) {
            User user = userRepo.findById(id).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Authorization header missing or invalid."));
        }

        String token = authHeader.substring(7);
        List<String> roles = jwtService.extractRoles(token);

        if (roles.contains("ADMIN") || roles.contains("OPERATOR")) {
            userRepo.deleteById(userId);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully!"));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied."));
        }
    }
}
