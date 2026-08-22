package com.dayflow.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SalarySlipDto {
    private Long id;
    private Long userId;
    private String employeeName;
    private String employeeId;
    private String payPeriod;
    private BigDecimal baseSalarySnapshot;
    private BigDecimal allowancesSnapshot;
    private BigDecimal deductionsSnapshot;
    private BigDecimal netSalarySnapshot;
    private LocalDateTime generatedAt;
    private String pdfUrl;

    public SalarySlipDto() {}

    public SalarySlipDto(Long id, Long userId, String employeeName, String employeeId, String payPeriod, BigDecimal baseSalarySnapshot, BigDecimal allowancesSnapshot, BigDecimal deductionsSnapshot, BigDecimal netSalarySnapshot, LocalDateTime generatedAt, String pdfUrl) {
        this.id = id;
        this.userId = userId;
        this.employeeName = employeeName;
        this.employeeId = employeeId;
        this.payPeriod = payPeriod;
        this.baseSalarySnapshot = baseSalarySnapshot;
        this.allowancesSnapshot = allowancesSnapshot;
        this.deductionsSnapshot = deductionsSnapshot;
        this.netSalarySnapshot = netSalarySnapshot;
        this.generatedAt = generatedAt;
        this.pdfUrl = pdfUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getPayPeriod() { return payPeriod; }
    public void setPayPeriod(String payPeriod) { this.payPeriod = payPeriod; }

    public BigDecimal getBaseSalarySnapshot() { return baseSalarySnapshot; }
    public void setBaseSalarySnapshot(BigDecimal baseSalarySnapshot) { this.baseSalarySnapshot = baseSalarySnapshot; }

    public BigDecimal getAllowancesSnapshot() { return allowancesSnapshot; }
    public void setAllowancesSnapshot(BigDecimal allowancesSnapshot) { this.allowancesSnapshot = allowancesSnapshot; }

    public BigDecimal getDeductionsSnapshot() { return deductionsSnapshot; }
    public void setDeductionsSnapshot(BigDecimal deductionsSnapshot) { this.deductionsSnapshot = deductionsSnapshot; }

    public BigDecimal getNetSalarySnapshot() { return netSalarySnapshot; }
    public void setNetSalarySnapshot(BigDecimal netSalarySnapshot) { this.netSalarySnapshot = netSalarySnapshot; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }

    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long userId;
        private String employeeName;
        private String employeeId;
        private String payPeriod;
        private BigDecimal baseSalarySnapshot;
        private BigDecimal allowancesSnapshot;
        private BigDecimal deductionsSnapshot;
        private BigDecimal netSalarySnapshot;
        private LocalDateTime generatedAt;
        private String pdfUrl;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder employeeName(String employeeName) { this.employeeName = employeeName; return this; }
        public Builder employeeId(String employeeId) { this.employeeId = employeeId; return this; }
        public Builder payPeriod(String payPeriod) { this.payPeriod = payPeriod; return this; }
        public Builder baseSalarySnapshot(BigDecimal baseSalarySnapshot) { this.baseSalarySnapshot = baseSalarySnapshot; return this; }
        public Builder allowancesSnapshot(BigDecimal allowancesSnapshot) { this.allowancesSnapshot = allowancesSnapshot; return this; }
        public Builder deductionsSnapshot(BigDecimal deductionsSnapshot) { this.deductionsSnapshot = deductionsSnapshot; return this; }
        public Builder netSalarySnapshot(BigDecimal netSalarySnapshot) { this.netSalarySnapshot = netSalarySnapshot; return this; }
        public Builder generatedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; return this; }
        public Builder pdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; return this; }

        public SalarySlipDto build() {
            return new SalarySlipDto(id, userId, employeeName, employeeId, payPeriod, baseSalarySnapshot, allowancesSnapshot, deductionsSnapshot, netSalarySnapshot, generatedAt, pdfUrl);
        }
    }
}
