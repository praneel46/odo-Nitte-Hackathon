package com.dayflow.dto;

import com.dayflow.enums.Role;
import com.dayflow.enums.UserStatus;

public class UserSummaryDto {
    private Long userId;
    private String email;
    private String employeeId;
    private Role role;
    private UserStatus status;
    private boolean emailVerified;
    private String firstName;
    private String lastName;

    public UserSummaryDto() {}

    public UserSummaryDto(Long userId, String email, String employeeId, Role role, UserStatus status, boolean emailVerified, String firstName, String lastName) {
        this.userId = userId;
        this.email = email;
        this.employeeId = employeeId;
        this.role = role;
        this.status = status;
        this.emailVerified = emailVerified;
        this.firstName = firstName;
        this.lastName = lastName;
    }

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

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long userId;
        private String email;
        private String employeeId;
        private Role role;
        private UserStatus status;
        private boolean emailVerified;
        private String firstName;
        private String lastName;

        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder employeeId(String employeeId) { this.employeeId = employeeId; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder status(UserStatus status) { this.status = status; return this; }
        public Builder emailVerified(boolean emailVerified) { this.emailVerified = emailVerified; return this; }
        public Builder firstName(String firstName) { this.firstName = firstName; return this; }
        public Builder lastName(String lastName) { this.lastName = lastName; return this; }

        public UserSummaryDto build() {
            return new UserSummaryDto(userId, email, employeeId, role, status, emailVerified, firstName, lastName);
        }
    }
}
