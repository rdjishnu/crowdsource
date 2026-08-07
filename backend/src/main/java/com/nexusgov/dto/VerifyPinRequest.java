// File: src/main/java/com/nexusgov/dto/VerifyPinRequest.java
package com.nexusgov.dto;

public class VerifyPinRequest {
    private String email;
    private String securePin;

    public VerifyPinRequest() {}
    public VerifyPinRequest(String email, String securePin) {
        this.email = email;
        this.securePin = securePin;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSecurePin() { return securePin; }
    public void setSecurePin(String securePin) { this.securePin = securePin; }
}
