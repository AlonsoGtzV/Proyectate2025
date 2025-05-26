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
                                "/api/users",
                                "/api/users/**",
                                "/api/users/{id}",
                                "/api/users/{id}/add-key",
                                "/api/users/{id}/unlock-unit/{unitId}",
                                "/api/users/{id}/update-partial",
                                "/api/users/{id}/keys",
                                "/api/lessons/create",
                                "/api/lessons/bulk",
                                "/api/lessons/update",
                                "/api/lessons/delete",
                                "/api/lessons",
                                "/api/lessons/{id}",
                                "/api/lessons/questions/unit/**",
                                "/swagger-ui/**",     // Permite Swagger UI
                                "/v3/api-docs/**",
                                "/error"// Permite la documentación OpenAPI
                        ).permitAll()             // Sin autenticación
                        .anyRequest().authenticated()  // Resto de endpoints protegidos
                )
                .csrf(csrf -> csrf.disable()); // Deshabilita CSRF para POST/PUT/DELETE

        return http.build();
    }
}