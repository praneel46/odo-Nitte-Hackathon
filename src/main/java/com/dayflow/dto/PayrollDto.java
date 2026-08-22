package com.dayflow.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PayrollDto {
    private Long id;
    private Long userId;
    private String employeeName;
    private String employeeId;
    private BigDecimal baseSalary;
    private BigDecimal allowances;
    private BigDecimal deductions;
    private BigDecimal netSalary;
    private LocalDate effectiveDate;
    private LocalDateTime updatedAt;

    public PayrollDto() {}

    public PayrollDto(Long id, Long userId, String employeeName, String employeeId, BigDecimal baseSalary, BigDecimal allowances, BigDecimal deductions, BigDecimal netSalary, LocalDate effectiveDate, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.employeeName = employeeName;
        this.employeeId = employeeId;
        this.baseSalary = baseSalary;
        this.allowances = allowances;
        this.deductions = deductions;
        this.netSalary = netSalary;
        this.effectiveDate = effectiveDate;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public BigDecimal getBaseSalary() { return baseSalary; }
    public void setBaseSalary(BigDecimal baseSalary) { this.baseSalary = baseSalary; }

    public BigDecimal getAllowances() { return allowances; }
    public void setAllowances(BigDecimal allowances) { this.allowances = allowances; }

    public BigDecimal getDeductions() { return deductions; }
    public void setDeductions(BigDecimal deductions) { this.deductions = deductions; }

    public BigDecimal getNetSalary() { return netSalary; }
    public void setNetSalary(BigDecimal netSalary) { this.netSalary = netSalary; }

    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long userId;
        private String employeeName;
        private String employeeId;
        private BigDecimal baseSalary;
        private BigDecimal allowances;
        private BigDecimal deductions;
        private BigDecimal netSalary;
        private LocalDate effectiveDate;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder employeeName(String employeeName) { this.employeeName = employeeName; return this; }
        public Builder employeeId(String employeeId) { this.employeeId = employeeId; return this; }
        public Builder baseSalary(BigDecimal baseSalary) { this.baseSalary = baseSalary; return this; }
        public Builder allowances(BigDecimal allowances) { this.allowances = allowances; return this; }
        public Builder deductions(BigDecimal deductions) { this.deductions = deductions; return this; }
        public Builder netSalary(BigDecimal netSalary) { this.netSalary = netSalary; return this; }
        public Builder effectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public PayrollDto build() {
            return new PayrollDto(id, userId, employeeName, employeeId, baseSalary, allowances, deductions, netSalary, effectiveDate, updatedAt);
        }
    }
}
