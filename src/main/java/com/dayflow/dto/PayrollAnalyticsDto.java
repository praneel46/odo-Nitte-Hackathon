package com.dayflow.dto;

import java.math.BigDecimal;

public class PayrollAnalyticsDto {
    private BigDecimal totalBaseSalary;
    private BigDecimal totalAllowances;
    private BigDecimal totalDeductions;
    private BigDecimal totalNetPayroll;
    private BigDecimal averageNetSalary;

    public PayrollAnalyticsDto() {}

    public PayrollAnalyticsDto(BigDecimal totalBaseSalary, BigDecimal totalAllowances, BigDecimal totalDeductions, BigDecimal totalNetPayroll, BigDecimal averageNetSalary) {
        this.totalBaseSalary = totalBaseSalary;
        this.totalAllowances = totalAllowances;
        this.totalDeductions = totalDeductions;
        this.totalNetPayroll = totalNetPayroll;
        this.averageNetSalary = averageNetSalary;
    }

    public BigDecimal getTotalBaseSalary() { return totalBaseSalary; }
    public void setTotalBaseSalary(BigDecimal totalBaseSalary) { this.totalBaseSalary = totalBaseSalary; }

    public BigDecimal getTotalAllowances() { return totalAllowances; }
    public void setTotalAllowances(BigDecimal totalAllowances) { this.totalAllowances = totalAllowances; }

    public BigDecimal getTotalDeductions() { return totalDeductions; }
    public void setTotalDeductions(BigDecimal totalDeductions) { this.totalDeductions = totalDeductions; }

    public BigDecimal getTotalNetPayroll() { return totalNetPayroll; }
    public void setTotalNetPayroll(BigDecimal totalNetPayroll) { this.totalNetPayroll = totalNetPayroll; }

    public BigDecimal getAverageNetSalary() { return averageNetSalary; }
    public void setAverageNetSalary(BigDecimal averageNetSalary) { this.averageNetSalary = averageNetSalary; }
}
