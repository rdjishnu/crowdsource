package com.nexusgov.controller;

import com.nexusgov.entity.User;
import com.nexusgov.repository.UserRepository;
import com.nexusgov.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/citizen/register")
    public ResponseEntity<?> registerCitizen(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("CITIZEN")
                .build();
        userRepository.save(user);
        return ResponseEntity.ok("Citizen registered successfully");
    }

    @PostMapping("/citizen/login")
    public ResponseEntity<?> loginCitizen(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent() && 
            "CITIZEN".equals(userOpt.get().getRole()) && 
            passwordEncoder.matches(request.getPassword(), userOpt.get().getPasswordHash())) {
            
            String token = jwtService.generateToken(userOpt.get().getEmail());
            return ResponseEntity.ok(Map.of("token", token, "email", userOpt.get().getEmail(), "fullName", userOpt.get().getFullName()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid citizen credentials");
    }

    @PostMapping("/official/register")
    public ResponseEntity<?> registerOfficial(@RequestBody OfficialRegisterRequest request) {
        if (!"SIH-JHARKHAND-2025".equals(request.getGovMasterKey())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid Government Master Key");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .securePin(request.getSecurePin())
                .role("OFFICIAL")
                .build();
        userRepository.save(user);
        return ResponseEntity.ok("Official registered successfully");
    }

    @PostMapping("/official/login")
    public ResponseEntity<?> loginOfficial(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent() && 
            "OFFICIAL".equals(userOpt.get().getRole()) && 
            passwordEncoder.matches(request.getPassword(), userOpt.get().getPasswordHash())) {
            
            return ResponseEntity.ok(Map.of("requiresPin", true, "email", request.getEmail()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid official credentials");
    }

    @PostMapping("/official/verify-pin")
    public ResponseEntity<?> verifyPin(@RequestBody PinVerificationRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent() && userOpt.get().getSecurePin().equals(request.getSecurePin())) {
            String token = jwtService.generateToken(userOpt.get().getEmail());
            return ResponseEntity.ok(Map.of("token", token));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid PIN");
    }

    @GetMapping("/citizens")
    public ResponseEntity<List<UserResponse>> getCitizens() {
        List<UserResponse> citizens = userRepository.findByRole("CITIZEN").stream()
                .map(u -> new UserResponse(u.getId(), u.getFullName(), u.getEmail(), u.getRole(), null))
                .collect(Collectors.toList());
        return ResponseEntity.ok(citizens);
    }

    @GetMapping("/officials")
    public ResponseEntity<List<UserResponse>> getOfficials() {
        List<UserResponse> officials = userRepository.findByRole("OFFICIAL").stream()
                .map(u -> new UserResponse(u.getId(), u.getFullName(), u.getEmail(), u.getRole(), u.getSecurePin()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(officials);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long citizenCount = userRepository.findByRole("CITIZEN").size();
        long officialCount = userRepository.findByRole("OFFICIAL").size();
        long totalUsers = userRepository.count();
        return ResponseEntity.ok(Map.of(
            "totalCitizens", citizenCount,
            "totalOfficials", officialCount,
            "totalUsers", totalUsers
        ));
    }

    public static class UserResponse {
        private Long id;
        private String fullName;
        private String email;
        private String role;
        private String securePin;

        public UserResponse(Long id, String fullName, String email, String role, String securePin) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.role = role;
            this.securePin = securePin;
        }

        public Long getId() { return id; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
        public String getSecurePin() { return securePin; }
    }

    public static class RegisterRequest {
        private String fullName;
        private String email;
        private String password;

        public RegisterRequest() {}

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class OfficialRegisterRequest extends RegisterRequest {
        private String securePin;
        private String govMasterKey;

        public OfficialRegisterRequest() {}

        public String getSecurePin() { return securePin; }
        public void setSecurePin(String securePin) { this.securePin = securePin; }

        public String getGovMasterKey() { return govMasterKey; }
        public void setGovMasterKey(String govMasterKey) { this.govMasterKey = govMasterKey; }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class PinVerificationRequest {
        private String email;
        private String securePin;

        public PinVerificationRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getSecurePin() { return securePin; }
        public void setSecurePin(String securePin) { this.securePin = securePin; }
    }
}
