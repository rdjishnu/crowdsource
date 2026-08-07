// File: src/main/java/com/nexusgov/dto/OfficialRegisterRequest.java
package com.nexusgov.dto;

public class OfficialRegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String securePin;
    private String govMasterKey;

    public OfficialRegisterRequest() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getSecurePin() { return securePin; }
    public void setSecurePin(String securePin) { this.securePin = securePin; }

    public String getGovMasterKey() { return govMasterKey; }
    public void setGovMasterKey(String govMasterKey) { this.govMasterKey = govMasterKey; }
}
