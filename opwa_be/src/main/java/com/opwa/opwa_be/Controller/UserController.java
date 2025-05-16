package com.opwa.opwa_be.Controller;

import com.opwa.opwa_be.Repository.UserRepo;
import com.opwa.opwa_be.auth.AddUserRequest;
import com.opwa.opwa_be.config.JwtService;
import com.opwa.opwa_be.model.Role;
import com.opwa.opwa_be.model.User;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {
    private final UserRepo userRepo;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/add")
    public ResponseEntity<String> addUser(@RequestBody AddUserRequest request, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Authorization header missing or invalid.");
        }

        String token = authHeader.substring(7);
        List<String> roles = jwtService.extractRoles(token);
        System.out.println("Roles extracted: " + roles); // Debugging

        if (roles.contains("ROLE_ADMIN") || roles.contains("ROLE_OPERATOR")) {
            var user = User.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.USER)
                    .build();
            userRepo.save(user);
            return ResponseEntity.ok("User added successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }
    }
    @PutMapping("/update/{userId}")
    public ResponseEntity<String> updateUser(@PathVariable String userId, @RequestBody AddUserRequest request, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Authorization header missing or invalid.");
        }
    
        String token = authHeader.substring(7);
        List<String> roles = jwtService.extractRoles(token);
    
        if (roles.contains("ROLE_ADMIN") || roles.contains("ROLE_OPERATOR")) {
            var user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found."));
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole()); // Optional
            userRepo.save(user);
            return ResponseEntity.ok("User updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
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

        if (roles.contains("ROLE_ADMIN") || roles.contains("ROLE_OPERATOR")) {
            List<User> users = userRepo.findAll();
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }
    @DeleteMapping ("/delete/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable String userId, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Authorization header missing or invalid.");
        }

        String token = authHeader.substring(7);
        List<String> roles = jwtService.extractRoles(token);

        if (roles.contains("ROLE_ADMIN") || roles.contains("ROLE_OPERATOR")) {
            userRepo.deleteById(userId);
            return ResponseEntity.ok("User deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }
    }
    
}
