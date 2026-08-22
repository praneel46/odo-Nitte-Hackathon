package com.dayflow.dto;

import com.dayflow.enums.UserStatus;

public class UpdateStatusRequest {
    private UserStatus status;

    public UpdateStatusRequest() {}

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
}
