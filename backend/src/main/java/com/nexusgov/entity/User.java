// File: backend/src/main/java/com/nexusgov/entity/User.java
package com.nexusgov.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role; // 'CITIZEN' or 'OFFICIAL'

    private String securePin; // For officials

    private Integer trustScore = 100; // Default score 100

    public User() {}

    public User(Long id, String fullName, String email, String passwordHash, String role, String securePin, Integer trustScore) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.securePin = securePin;
        this.trustScore = (trustScore != null) ? trustScore : 100;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getSecurePin() { return securePin; }
    public void setSecurePin(String securePin) { this.securePin = securePin; }

    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String fullName;
        private String email;
        private String passwordHash;
        private String role;
        private String securePin;
        private Integer trustScore = 100;

        UserBuilder() {}

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public UserBuilder role(String role) { this.role = role; return this; }
        public UserBuilder securePin(String securePin) { this.securePin = securePin; return this; }
        public UserBuilder trustScore(Integer trustScore) { this.trustScore = trustScore; return this; }

        public User build() {
            return new User(id, fullName, email, passwordHash, role, securePin, trustScore);
        }
    }
}
