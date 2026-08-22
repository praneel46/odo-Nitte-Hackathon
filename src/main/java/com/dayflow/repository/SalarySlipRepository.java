package com.dayflow.repository;

import com.dayflow.entity.SalarySlip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalarySlipRepository extends JpaRepository<SalarySlip, Long> {
    List<SalarySlip> findByEmployeeIdOrderByGeneratedAtDesc(Long userId);
    Optional<SalarySlip> findByEmployeeIdAndPayPeriod(Long userId, String payPeriod);
}
