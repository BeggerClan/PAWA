package com.begger.pawa.demo.Authentication;

import com.begger.pawa.demo.Authentication.LoginResponse;
import com.begger.pawa.demo.Authentication.LoginRequest;
import com.begger.pawa.demo.Configuration.JwtProperties;


import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtTokenProvider tokenProvider;
    private final JwtProperties props;

    public AuthController(AuthenticationManager authManager,
                          JwtTokenProvider tokenProvider,
                          JwtProperties props) {
        this.authManager = authManager;
        this.tokenProvider = tokenProvider;
        this.props = props;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {

        // authenticate user
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword()
        ));

        // generate token
        String token = tokenProvider.generateToken(request.getEmail());

        // build and response
        LoginResponse response = new LoginResponse(token, props.getExpiration());
        return ResponseEntity.ok(response);
    }


}
