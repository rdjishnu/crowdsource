package com.nexusgov.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class StatusUpdateDTO {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(Reported|In Progress|Resolved|Rejected)$", message = "Status must be one of: Reported, In Progress, Resolved, Rejected")
    private String status;

    public StatusUpdateDTO() {
    }

    public StatusUpdateDTO(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
