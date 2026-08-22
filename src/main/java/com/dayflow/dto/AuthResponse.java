package com.dayflow.dto;

import com.dayflow.enums.Role;
import com.dayflow.enums.UserStatus;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String email;
    private String employeeId;
    private Role role;
    private UserStatus status;
    private String firstName;
    private String lastName;
    private String message;
    private String devVerificationToken;

    public AuthResponse() {}

    public AuthResponse(String token, String tokenType, Long userId, String email, String employeeId, Role role, UserStatus status, String firstName, String lastName, String message, String devVerificationToken) {
        this.token = token;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.userId = userId;
        this.email = email;
        this.employeeId = employeeId;
        this.role = role;
        this.status = status;
        this.firstName = firstName;
        this.lastName = lastName;
        this.message = message;
        this.devVerificationToken = devVerificationToken;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getDevVerificationToken() { return devVerificationToken; }
    public void setDevVerificationToken(String devVerificationToken) { this.devVerificationToken = devVerificationToken; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String token;
        private String tokenType = "Bearer";
        private Long userId;
        private String email;
        private String employeeId;
        private Role role;
        private UserStatus status;
        private String firstName;
        private String lastName;
        private String message;
        private String devVerificationToken;

        public Builder token(String token) { this.token = token; return this; }
        public Builder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder employeeId(String employeeId) { this.employeeId = employeeId; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder status(UserStatus status) { this.status = status; return this; }
        public Builder firstName(String firstName) { this.firstName = firstName; return this; }
        public Builder lastName(String lastName) { this.lastName = lastName; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder devVerificationToken(String devVerificationToken) { this.devVerificationToken = devVerificationToken; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, tokenType, userId, email, employeeId, role, status, firstName, lastName, message, devVerificationToken);
        }
    }
}
