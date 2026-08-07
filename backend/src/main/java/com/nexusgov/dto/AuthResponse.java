// File: src/main/java/com/nexusgov/dto/AuthResponse.java
package com.nexusgov.dto;

public class AuthResponse {
    private String token;
    private Boolean requiresPin;
    private String email;
    private String role;
    private String fullName;
    private String message;

    public AuthResponse() {}

    public static AuthResponse requiringPin(String email) {
        AuthResponse res = new AuthResponse();
        res.setRequiresPin(true);
        res.setEmail(email);
        res.setMessage("Step 1 authentication successful. Please enter your 6-digit PIN.");
        return res;
    }

    public static AuthResponse successToken(String token, String email, String role, String fullName) {
        AuthResponse res = new AuthResponse();
        res.setToken(token);
        res.setEmail(email);
        res.setRole(role);
        res.setFullName(fullName);
        res.setMessage("Authentication successful");
        return res;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Boolean getRequiresPin() { return requiresPin; }
    public void setRequiresPin(Boolean requiresPin) { this.requiresPin = requiresPin; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
