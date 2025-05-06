package com.ApiSpeech.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/chat",          // Permite el endpoint del chat
                                "/swagger-ui/**",     // Permite Swagger UI
                                "/v3/api-docs/**"     // Permite la documentación OpenAPI
                        ).permitAll()             // Sin autenticación
                        .anyRequest().authenticated()  // Resto de endpoints protegidos
                )
                .csrf(csrf -> csrf.disable()); // Necesario para POST/PUT/DELETE

        return http.build();
    }
}