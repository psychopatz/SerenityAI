package com.SerenityBuilders.SerenityAI.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/home", "/register", "/login/**").permitAll() // Allow public access
                        .requestMatchers("/home/**").permitAll() // Allow access to home page
                        .requestMatchers(HttpMethod.GET, "/api/**").hasRole("USER") // User role for GET requests
                        .requestMatchers(HttpMethod.POST, "/api/**").hasRole("ADMIN") // Admin role for POST requests
                        .anyRequest().authenticated() // All other requests require authentication
                )
                .formLogin(form -> form
                        .loginPage("/login") // Custom login page
                        .defaultSuccessUrl("/home", true) // Redirect after successful login
                        .permitAll() // Allow everyone to see the login page
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/login?logout") // Redirect to login with logout parameter
                        .permitAll() // Allow everyone to log out
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Password encoder
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.inMemoryAuthentication()
                .withUser("user")
                .password(passwordEncoder().encode("password"))
                .roles("USER") // This user has the USER role
                .and()
                .withUser("admin")
                .password(passwordEncoder().encode("admin"))
                .roles("ADMIN"); // This user has the ADMIN role

        return authenticationManagerBuilder.build();
    }
}
