package com.example.swd392_gr03_eco.configs;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
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

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    /**
     * Cấu hình CORS cho toàn bộ ứng dụng.
     * Cho phép FE trên Render và localhost truy cập.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Các domain FE được phép
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "https://swd392-group3-fe.onrender.com"
        ));

        // Các method HTTP được phép
        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // Header gửi lên server
        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin"
        ));

        // Header mà client có thể đọc
        configuration.setExposedHeaders(List.of(
                "Authorization"
        ));

        // Cho phép gửi cookie / credentials
        configuration.setAllowCredentials(true);

        // Thời gian cache preflight request
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /**
     * Cấu hình SecurityFilterChain với Spring Security.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Bật CORS theo cấu hình trên
                .cors(Customizer.withDefaults())

                // Tắt CSRF để dễ test API
                .csrf(csrf -> csrf.disable())

                // Quy tắc phân quyền
                .authorizeHttpRequests(auth -> auth
                        // Cho phép tất cả OPTIONS requests (preflight)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Các endpoint public (auth, chatbot, payment)
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/chatbot/**").permitAll()
                        .requestMatchers("/api/v1/payment/**").permitAll()

                        // Các GET public
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/products/**",
                                "/api/v1/categories/**",
                                "/api/v1/reviews/**"
                        ).permitAll()

                        // Các request khác cần authentication
                        .anyRequest().authenticated()
                )

                // Stateless session (JWT)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Provider và filter JWT
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}