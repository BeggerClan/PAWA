package com.opwa.opwa_be.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JWTAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/api/data-generator/**",
                                "/api/metro-lines/**",
                                "/api/suspensions/**",
                                "/api/stations/**"
                        ).permitAll()
                        .requestMatchers(
                                "/api/v1/user/getAll",
                                "/api/v1/user/add",
                                "/api/v1/user/update/**",
                                "/api/v1/user/delete/**",
                                "/api/v1/user/get/**"
                        ).hasAnyAuthority("ADMIN", "OPERATOR")
                        // MetroLine CRUD
                        .requestMatchers(
                                "/api/metro-lines/create",
                                "/api/metro-lines/{id}",
                                "/api/metro-lines/update/**",
                                "/api/metro-lines/delete/**"
                        ).hasAnyAuthority("ADMIN", "OPERATOR")
                        // Station CRUD within MetroLine
                        .requestMatchers(
                                "/api/metro-lines/{lineId}/stations/{stationId}",
                                "/api/metro-lines/{lineId}/stations/update/**",
                                "/api/metro-lines/{lineId}/stations/delete/**"
                        ).permitAll()//.hasAnyAuthority("ADMIN", "OPERATOR")
                        // Suspension CRUD (ADMIN, OPERATOR)
                        .requestMatchers(
                                "/api/suspensions/**"
                        ).hasAnyAuthority("ADMIN", "OPERATOR")
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
