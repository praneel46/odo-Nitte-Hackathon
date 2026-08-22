package com.dayflow.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class UpdatePayrollRequest {
    @NotNull(message = "Base salary is required")
    private BigDecimal baseSalary;

    private BigDecimal allowances;
    private BigDecimal deductions;

    @NotNull(message = "Effective date is required")
    private LocalDate effectiveDate;

    public UpdatePayrollRequest() {}

    public BigDecimal getBaseSalary() { return baseSalary; }
    public void setBaseSalary(BigDecimal baseSalary) { this.baseSalary = baseSalary; }

    public BigDecimal getAllowances() { return allowances; }
    public void setAllowances(BigDecimal allowances) { this.allowances = allowances; }

    public BigDecimal getDeductions() { return deductions; }
    public void setDeductions(BigDecimal deductions) { this.deductions = deductions; }

    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }
}
