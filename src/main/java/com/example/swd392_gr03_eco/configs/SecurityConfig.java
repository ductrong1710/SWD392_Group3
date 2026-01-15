package com.example.swd392_gr03_eco.configs;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // --- PUBLIC ENDPOINTS ---
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/products/**",
                                "/api/v1/categories/**",
                                "/api/v1/reviews/**"
                        ).permitAll()

                        // --- CUSTOMER ENDPOINTS ---
                        .requestMatchers(
                                "/api/v1/cart/**",
                                "/api/v1/orders/**",
                                "/api/v1/user/**",
                                "/api/v1/chat-sessions/**"
                        ).hasAnyAuthority("CUSTOMER", "STAFF", "ADMIN") // Allow staff and admin too
                        .requestMatchers(HttpMethod.POST, "/api/v1/reviews").hasAnyAuthority("CUSTOMER", "STAFF", "ADMIN")

                        // --- STAFF & ADMIN ENDPOINTS ---
                        .requestMatchers("/api/v1/admin/**").hasAnyAuthority("STAFF", "ADMIN") // Order management
                        .requestMatchers(HttpMethod.POST, "/api/v1/products", "/api/v1/categories").hasAnyAuthority("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/products/**", "/api/v1/categories/**").hasAnyAuthority("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**", "/api/v1/categories/**").hasAnyAuthority("STAFF", "ADMIN")

                        // --- ADMIN-ONLY ENDPOINTS (Example: if you add user management later) ---
                        // .requestMatchers("/api/v1/super-admin/**").hasAuthority("ADMIN")

                        // All other requests must be authenticated
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
