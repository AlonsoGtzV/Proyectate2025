package com.ApiSpeech.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configure(http)) // Habilita CORS
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/chat",
                                "/api/users/register",
                                "/api/users/login",
                                "/api/users",          // Permite acceso a todos los usuarios
                                "/swagger-ui/**",     // Permite Swagger UI
                                "/v3/api-docs/**"     // Permite la documentación OpenAPI
                        ).permitAll()             // Sin autenticación
                        .anyRequest().authenticated()  // Resto de endpoints protegidos
                )
                .csrf(csrf -> csrf.disable()); // Deshabilita CSRF para POST/PUT/DELETE

        return http.build();
    }
}