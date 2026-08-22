package com.dayflow.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "salary_slips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalarySlip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User employee;

    @Column(nullable = false)
    private String payPeriod; // e.g. "2026-07"

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

    @PrePersist
    protected void onCreate() {
        if (generatedAt == null) {
            generatedAt = LocalDateTime.now();
        }
    }
}
