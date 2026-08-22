package com.dayflow.dto;

import com.dayflow.enums.BreakType;
import java.time.LocalDateTime;

public class WorkBreakDto {
    private Long id;
    private BreakType breakType;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long durationMinutes;

    public WorkBreakDto() {}

    public WorkBreakDto(Long id, BreakType breakType, LocalDateTime startTime, LocalDateTime endTime, Long durationMinutes) {
        this.id = id;
        this.breakType = breakType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.durationMinutes = durationMinutes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BreakType getBreakType() { return breakType; }
    public void setBreakType(BreakType breakType) { this.breakType = breakType; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public Long getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Long durationMinutes) { this.durationMinutes = durationMinutes; }
}
