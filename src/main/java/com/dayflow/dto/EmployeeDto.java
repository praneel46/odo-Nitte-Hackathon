package com.dayflow.dto;

import com.dayflow.enums.Role;
import com.dayflow.enums.UserStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class EmployeeDto {
    private Long id;
    private Long userId;
    private String email;
    private String employeeId;
    private Role role;
    private UserStatus status;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private String jobTitle;
    private Long departmentId;
    private String departmentName;
    private LocalDate dateOfJoining;
    private String profilePictureUrl;
    private LocalDateTime createdAt;

    public EmployeeDto() {}

    public EmployeeDto(Long id, Long userId, String email, String employeeId, Role role, UserStatus status, String firstName, String lastName, String phone, String address, String jobTitle, Long departmentId, String departmentName, LocalDate dateOfJoining, String profilePictureUrl, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.email = email;
        this.employeeId = employeeId;
        this.role = role;
        this.status = status;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.address = address;
        this.jobTitle = jobTitle;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.dateOfJoining = dateOfJoining;
        this.profilePictureUrl = profilePictureUrl;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public LocalDate getDateOfJoining() { return dateOfJoining; }
    public void setDateOfJoining(LocalDate dateOfJoining) { this.dateOfJoining = dateOfJoining; }

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long userId;
        private String email;
        private String employeeId;
        private Role role;
        private UserStatus status;
        private String firstName;
        private String lastName;
        private String phone;
        private String address;
        private String jobTitle;
        private Long departmentId;
        private String departmentName;
        private LocalDate dateOfJoining;
        private String profilePictureUrl;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder employeeId(String employeeId) { this.employeeId = employeeId; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder status(UserStatus status) { this.status = status; return this; }
        public Builder firstName(String firstName) { this.firstName = firstName; return this; }
        public Builder lastName(String lastName) { this.lastName = lastName; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder jobTitle(String jobTitle) { this.jobTitle = jobTitle; return this; }
        public Builder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder dateOfJoining(LocalDate dateOfJoining) { this.dateOfJoining = dateOfJoining; return this; }
        public Builder profilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public EmployeeDto build() {
            return new EmployeeDto(id, userId, email, employeeId, role, status, firstName, lastName, phone, address, jobTitle, departmentId, departmentName, dateOfJoining, profilePictureUrl, createdAt);
        }
    }
}
