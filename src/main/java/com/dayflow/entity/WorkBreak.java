package com.dayflow.entity;

import com.dayflow.enums.BreakType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_breaks")
public class WorkBreak {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attendance_id", nullable = false)
    private Attendance attendance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BreakType breakType;

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Long durationMinutes;

    public WorkBreak() {}

    public WorkBreak(Long id, Attendance attendance, BreakType breakType, LocalDateTime startTime, LocalDateTime endTime, Long durationMinutes) {
        this.id = id;
        this.attendance = attendance;
        this.breakType = breakType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.durationMinutes = durationMinutes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Attendance getAttendance() { return attendance; }
    public void setAttendance(Attendance attendance) { this.attendance = attendance; }

    public BreakType getBreakType() { return breakType; }
    public void setBreakType(BreakType breakType) { this.breakType = breakType; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public Long getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Long durationMinutes) { this.durationMinutes = durationMinutes; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Attendance attendance;
        private BreakType breakType;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Long durationMinutes;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder attendance(Attendance attendance) { this.attendance = attendance; return this; }
        public Builder breakType(BreakType breakType) { this.breakType = breakType; return this; }
        public Builder startTime(LocalDateTime startTime) { this.startTime = startTime; return this; }
        public Builder endTime(LocalDateTime endTime) { this.endTime = endTime; return this; }
        public Builder durationMinutes(Long durationMinutes) { this.durationMinutes = durationMinutes; return this; }

        public WorkBreak build() {
            return new WorkBreak(id, attendance, breakType, startTime, endTime, durationMinutes);
        }
    }
}
