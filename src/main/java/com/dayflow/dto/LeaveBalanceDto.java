package com.dayflow.dto;

import com.dayflow.enums.LeaveType;

public class LeaveBalanceDto {
    private Long id;
    private Long userId;
    private Integer year;
    private LeaveType leaveType;
    private Double totalEntitled;
    private Double used;
    private Double pending;

    public LeaveBalanceDto() {}

    public LeaveBalanceDto(Long id, Long userId, Integer year, LeaveType leaveType, Double totalEntitled, Double used, Double pending) {
        this.id = id;
        this.userId = userId;
        this.year = year;
        this.leaveType = leaveType;
        this.totalEntitled = totalEntitled;
        this.used = used;
        this.pending = pending;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public LeaveType getLeaveType() { return leaveType; }
    public void setLeaveType(LeaveType leaveType) { this.leaveType = leaveType; }

    public Double getTotalEntitled() { return totalEntitled; }
    public void setTotalEntitled(Double totalEntitled) { this.totalEntitled = totalEntitled; }

    public Double getUsed() { return used; }
    public void setUsed(Double used) { this.used = used; }

    public Double getPending() { return pending; }
    public void setPending(Double pending) { this.pending = pending; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long userId;
        private Integer year;
        private LeaveType leaveType;
        private Double totalEntitled;
        private Double used;
        private Double pending;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder year(Integer year) { this.year = year; return this; }
        public Builder leaveType(LeaveType leaveType) { this.leaveType = leaveType; return this; }
        public Builder totalEntitled(Double totalEntitled) { this.totalEntitled = totalEntitled; return this; }
        public Builder used(Double used) { this.used = used; return this; }
        public Builder pending(Double pending) { this.pending = pending; return this; }

        public LeaveBalanceDto build() {
            return new LeaveBalanceDto(id, userId, year, leaveType, totalEntitled, used, pending);
        }
    }
}
