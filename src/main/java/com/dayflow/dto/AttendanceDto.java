package com.dayflow.dto;

import com.dayflow.enums.AttendanceStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AttendanceDto {
    private Long id;
    private Long userId;
    private String employeeName;
    private String employeeId;
    private LocalDate date;
    private AttendanceStatus status;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private Long totalWorkMinutes;
    private WorkBreakDto activeBreak;
    private List<WorkBreakDto> breaks;

    public AttendanceDto() {}

    public AttendanceDto(Long id, Long userId, String employeeName, String employeeId, LocalDate date, AttendanceStatus status, LocalDateTime checkInTime, LocalDateTime checkOutTime, Long totalWorkMinutes, WorkBreakDto activeBreak, List<WorkBreakDto> breaks) {
        this.id = id;
        this.userId = userId;
        this.employeeName = employeeName;
        this.employeeId = employeeId;
        this.date = date;
        this.status = status;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.totalWorkMinutes = totalWorkMinutes;
        this.activeBreak = activeBreak;
        this.breaks = breaks;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }

    public Long getTotalWorkMinutes() { return totalWorkMinutes; }
    public void setTotalWorkMinutes(Long totalWorkMinutes) { this.totalWorkMinutes = totalWorkMinutes; }

    public WorkBreakDto getActiveBreak() { return activeBreak; }
    public void setActiveBreak(WorkBreakDto activeBreak) { this.activeBreak = activeBreak; }

    public List<WorkBreakDto> getBreaks() { return breaks; }
    public void setBreaks(List<WorkBreakDto> breaks) { this.breaks = breaks; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long userId;
        private String employeeName;
        private String employeeId;
        private LocalDate date;
        private AttendanceStatus status;
        private LocalDateTime checkInTime;
        private LocalDateTime checkOutTime;
        private Long totalWorkMinutes;
        private WorkBreakDto activeBreak;
        private List<WorkBreakDto> breaks;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder employeeName(String employeeName) { this.employeeName = employeeName; return this; }
        public Builder employeeId(String employeeId) { this.employeeId = employeeId; return this; }
        public Builder date(LocalDate date) { this.date = date; return this; }
        public Builder status(AttendanceStatus status) { this.status = status; return this; }
        public Builder checkInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; return this; }
        public Builder checkOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; return this; }
        public Builder totalWorkMinutes(Long totalWorkMinutes) { this.totalWorkMinutes = totalWorkMinutes; return this; }
        public Builder activeBreak(WorkBreakDto activeBreak) { this.activeBreak = activeBreak; return this; }
        public Builder breaks(List<WorkBreakDto> breaks) { this.breaks = breaks; return this; }

        public AttendanceDto build() {
            return new AttendanceDto(id, userId, employeeName, employeeId, date, status, checkInTime, checkOutTime, totalWorkMinutes, activeBreak, breaks);
        }
    }
}
