package com.dayflow.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "salary_slips")
public class SalarySlip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User employee;

    @Column(nullable = false)
    private String payPeriod;

    @Column(nullable = false, updatable = false)
    private BigDecimal baseSalarySnapshot;

    @Column(nullable = false, updatable = false)
    private BigDecimal allowancesSnapshot;

    @Column(nullable = false, updatable = false)
    private BigDecimal deductionsSnapshot;

    @Column(nullable = false, updatable = false)
    private BigDecimal netSalarySnapshot;

    @Column(nullable = false, updatable = false)
    private LocalDateTime generatedAt;

    private String pdfUrl;

    public SalarySlip() {}

    public SalarySlip(Long id, User employee, String payPeriod, BigDecimal baseSalarySnapshot, BigDecimal allowancesSnapshot, BigDecimal deductionsSnapshot, BigDecimal netSalarySnapshot, LocalDateTime generatedAt, String pdfUrl) {
        this.id = id;
        this.employee = employee;
        this.payPeriod = payPeriod;
        this.baseSalarySnapshot = baseSalarySnapshot;
        this.allowancesSnapshot = allowancesSnapshot;
        this.deductionsSnapshot = deductionsSnapshot;
        this.netSalarySnapshot = netSalarySnapshot;
        this.generatedAt = generatedAt;
        this.pdfUrl = pdfUrl;
    }

    @PrePersist
    protected void onCreate() {
        if (generatedAt == null) {
            generatedAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getEmployee() { return employee; }
    public void setEmployee(User employee) { this.employee = employee; }

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
        private User employee;
        private String payPeriod;
        private BigDecimal baseSalarySnapshot;
        private BigDecimal allowancesSnapshot;
        private BigDecimal deductionsSnapshot;
        private BigDecimal netSalarySnapshot;
        private LocalDateTime generatedAt;
        private String pdfUrl;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder employee(User employee) { this.employee = employee; return this; }
        public Builder payPeriod(String payPeriod) { this.payPeriod = payPeriod; return this; }
        public Builder baseSalarySnapshot(BigDecimal baseSalarySnapshot) { this.baseSalarySnapshot = baseSalarySnapshot; return this; }
        public Builder allowancesSnapshot(BigDecimal allowancesSnapshot) { this.allowancesSnapshot = allowancesSnapshot; return this; }
        public Builder deductionsSnapshot(BigDecimal deductionsSnapshot) { this.deductionsSnapshot = deductionsSnapshot; return this; }
        public Builder netSalarySnapshot(BigDecimal netSalarySnapshot) { this.netSalarySnapshot = netSalarySnapshot; return this; }
        public Builder generatedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; return this; }
        public Builder pdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; return this; }

        public SalarySlip build() {
            return new SalarySlip(id, employee, payPeriod, baseSalarySnapshot, allowancesSnapshot, deductionsSnapshot, netSalarySnapshot, generatedAt, pdfUrl);
        }
    }
}
