package com.begger.pawa.demo.Configuration;

import com.begger.pawa.demo.Authentication.PasswordTimestampValidator;
import com.begger.pawa.demo.Passenger.PassengerRepository;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.stream.Collectors;

@Configuration
@Order(2) // Ưu tiên thấp hơn OPWA
public class PawaSecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain pawaFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // open endpoints for guests
                .requestMatchers(HttpMethod.POST,
                        "/api/passengers/register",
                        "/api/auth/login",
                        "/api/payments/tickets"
                ).permitAll()

                // Allow ticket type & metro line viewing without login
                .requestMatchers(HttpMethod.GET, "/api/ticket-types").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/metro-lines/get-all-metro-lines").permitAll()
                
                .requestMatchers("/error").permitAll()

                // PASSENGER endpoints
                .requestMatchers(
                    "/api/passengers/profile/**",
                    "/api/wallet/**",
                    "/api/payments/tickets/wallet/top-up/credit-card"
                ).hasRole("PASSENGER")

                // OPERATOR endpoints
                .requestMatchers("/api/opwa/operator/").hasAnyRole("OPERATOR", "ADMIN")
                
                // AGENT endpoints
                .requestMatchers("/api/opwa/agent/").hasAnyRole("TICKET_AGENT","ADMIN","OPERATOR")

                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth -> oauth
                .jwt(jwt -> jwt
                    .decoder(pawaJwtDecoder(null, null)) // placeholder, sẽ override bean
                    .jwtAuthenticationConverter(jwtAuthConverter())
                    )
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://127.0.0.1:5501","http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("*"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public JwtDecoder pawaJwtDecoder(JwtProperties props, PassengerRepository passengerRepo) {
        SecretKey key = Keys.hmacShaKeyFor(props.getSecret().getBytes(StandardCharsets.UTF_8));
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(key).build();

        OAuth2TokenValidator<Jwt> defaultValidator = JwtValidators.createDefault();
        OAuth2TokenValidator<Jwt> timestampValidator = new PasswordTimestampValidator(passengerRepo);
        DelegatingOAuth2TokenValidator<Jwt> combined = new DelegatingOAuth2TokenValidator<>(defaultValidator, timestampValidator);

        decoder.setJwtValidator(combined);
        return decoder;
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthConverter() {
        JwtAuthenticationConverter conv = new JwtAuthenticationConverter();
        conv.setJwtGrantedAuthoritiesConverter(jwt -> {
            var roles = jwt.getClaimAsStringList("roles");
            if (roles == null) return Collections.emptyList();
            return roles.stream()
                    .map(r -> new SimpleGrantedAuthority("ROLE_" + r.toUpperCase()))
                    .collect(Collectors.toList());
        });
        return conv;
    }
}
