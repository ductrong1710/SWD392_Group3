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
@EnableMethodSecurity // Enable method-level security (e.g., @PreAuthorize)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/api/v1/products", // Allow anyone to view products
                                "/api/v1/products/{productId}", // Allow anyone to view product details
                                "/api/v1/products/{productId}/reviews", // Allow anyone to view reviews
                                "/api/v1/categories", // Allow anyone to view categories
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Admin-only endpoints
                        .requestMatchers("/api/v1/admin/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/products").hasAuthority("ADMIN") // Only admin can create products
                        .requestMatchers(HttpMethod.PUT, "/api/v1/products/{id}").hasAuthority("ADMIN") // Only admin can update products
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/products/{id}").hasAuthority("ADMIN") // Only admin can delete products
                        .requestMatchers(HttpMethod.POST, "/api/v1/categories").hasAuthority("ADMIN") // Only admin can create categories
                        .requestMatchers(HttpMethod.PUT, "/api/v1/categories/{id}").hasAuthority("ADMIN") // Only admin can update categories
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/categories/{id}").hasAuthority("ADMIN") // Only admin can delete categories


                        // Authenticated users (CUSTOMER or ADMIN)
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
