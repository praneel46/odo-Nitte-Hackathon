package com.dayflow.entity;

import com.dayflow.enums.LeaveType;
import jakarta.persistence.*;

@Entity
@Table(name = "leave_balances", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "year", "leaveType"})
})
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User employee;

    @Column(nullable = false)
    private Integer year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveType leaveType;

    @Column(nullable = false)
    private Double totalEntitled;

    @Column(nullable = false)
    private Double used;

    @Column(nullable = false)
    private Double pending;

    public LeaveBalance() {}

    public LeaveBalance(Long id, User employee, Integer year, LeaveType leaveType, Double totalEntitled, Double used, Double pending) {
        this.id = id;
        this.employee = employee;
        this.year = year;
        this.leaveType = leaveType;
        this.totalEntitled = totalEntitled;
        this.used = used;
        this.pending = pending;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getEmployee() { return employee; }
    public void setEmployee(User employee) { this.employee = employee; }

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
        private User employee;
        private Integer year;
        private LeaveType leaveType;
        private Double totalEntitled;
        private Double used;
        private Double pending;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder employee(User employee) { this.employee = employee; return this; }
        public Builder year(Integer year) { this.year = year; return this; }
        public Builder leaveType(LeaveType leaveType) { this.leaveType = leaveType; return this; }
        public Builder totalEntitled(Double totalEntitled) { this.totalEntitled = totalEntitled; return this; }
        public Builder used(Double used) { this.used = used; return this; }
        public Builder pending(Double pending) { this.pending = pending; return this; }

        public LeaveBalance build() {
            return new LeaveBalance(id, employee, year, leaveType, totalEntitled, used, pending);
        }
    }
}
