package com.dayflow.repository;

import com.dayflow.entity.LeaveBalance;
import com.dayflow.entity.User;
import com.dayflow.enums.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {
    List<LeaveBalance> findByEmployeeIdAndYear(Long userId, Integer year);
    Optional<LeaveBalance> findByEmployeeAndYearAndLeaveType(User employee, Integer year, LeaveType leaveType);
    Optional<LeaveBalance> findByEmployeeIdAndYearAndLeaveType(Long userId, Integer year, LeaveType leaveType);
}
