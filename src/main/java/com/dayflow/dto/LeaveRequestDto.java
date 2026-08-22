package com.dayflow.dto;

import com.dayflow.enums.LeaveStatus;
import com.dayflow.enums.LeaveType;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveRequestDto {
    private Long id;
    private Long userId;
    private String employeeName;
    private String employeeId;
    private LeaveType leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double requestedDays;
    private String reason;
    private LeaveStatus status;
    private String adminComment;
    private String approvedByName;
    private LocalDateTime createdAt;

    public LeaveRequestDto() {}

    public LeaveRequestDto(Long id, Long userId, String employeeName, String employeeId, LeaveType leaveType, LocalDate startDate, LocalDate endDate, Double requestedDays, String reason, LeaveStatus status, String adminComment, String approvedByName, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.employeeName = employeeName;
        this.employeeId = employeeId;
        this.leaveType = leaveType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.requestedDays = requestedDays;
        this.reason = reason;
        this.status = status;
        this.adminComment = adminComment;
        this.approvedByName = approvedByName;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public LeaveType getLeaveType() { return leaveType; }
    public void setLeaveType(LeaveType leaveType) { this.leaveType = leaveType; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Double getRequestedDays() { return requestedDays; }
    public void setRequestedDays(Double requestedDays) { this.requestedDays = requestedDays; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LeaveStatus getStatus() { return status; }
    public void setStatus(LeaveStatus status) { this.status = status; }

    public String getAdminComment() { return adminComment; }
    public void setAdminComment(String adminComment) { this.adminComment = adminComment; }

    public String getApprovedByName() { return approvedByName; }
    public void setApprovedByName(String approvedByName) { this.approvedByName = approvedByName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long userId;
        private String employeeName;
        private String employeeId;
        private LeaveType leaveType;
        private LocalDate startDate;
        private LocalDate endDate;
        private Double requestedDays;
        private String reason;
        private LeaveStatus status;
        private String adminComment;
        private String approvedByName;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder employeeName(String employeeName) { this.employeeName = employeeName; return this; }
        public Builder employeeId(String employeeId) { this.employeeId = employeeId; return this; }
        public Builder leaveType(LeaveType leaveType) { this.leaveType = leaveType; return this; }
        public Builder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public Builder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public Builder requestedDays(Double requestedDays) { this.requestedDays = requestedDays; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }
        public Builder status(LeaveStatus status) { this.status = status; return this; }
        public Builder adminComment(String adminComment) { this.adminComment = adminComment; return this; }
        public Builder approvedByName(String approvedByName) { this.approvedByName = approvedByName; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public LeaveRequestDto build() {
            return new LeaveRequestDto(id, userId, employeeName, employeeId, leaveType, startDate, endDate, requestedDays, reason, status, adminComment, approvedByName, createdAt);
        }
    }
}
