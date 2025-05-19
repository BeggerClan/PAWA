package com.begger.pawa.demo.Configuration;

import org.springframework.core.annotation.Order;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.Customizer;

@Configuration
@Order(1) // Ưu tiên áp dụng trước nếu khớp URL
public class OpwaSecurityConfig {

    @Bean
    public SecurityFilterChain opwaFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/opwa/**") // Chỉ áp dụng cho các request bắt đầu bằng /api/opwa/
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Cho phép tất cả, bạn có thể thay đổi nếu cần bảo vệ một số API
            )
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults());

        return http.build();
    }
}
