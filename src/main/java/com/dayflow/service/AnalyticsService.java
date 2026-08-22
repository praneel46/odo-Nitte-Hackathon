package com.dayflow.service;

import com.dayflow.dto.AttendanceAnalyticsDto;
import com.dayflow.dto.LeaveAnalyticsDto;
import com.dayflow.dto.PayrollAnalyticsDto;
import com.dayflow.dto.WorkforceAnalyticsDto;
import com.dayflow.entity.Attendance;
import com.dayflow.entity.EmployeeProfile;
import com.dayflow.entity.LeaveRequest;
import com.dayflow.entity.Payroll;
import com.dayflow.entity.User;
import com.dayflow.enums.AttendanceStatus;
import com.dayflow.enums.LeaveStatus;
import com.dayflow.enums.UserStatus;
import com.dayflow.exception.ForbiddenException;
import com.dayflow.repository.AttendanceRepository;
import com.dayflow.repository.EmployeeProfileRepository;
import com.dayflow.repository.LeaveRequestRepository;
import com.dayflow.repository.PayrollRepository;
import com.dayflow.repository.UserRepository;
import com.dayflow.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;

    public AnalyticsService(UserRepository userRepository, EmployeeProfileRepository employeeProfileRepository, AttendanceRepository attendanceRepository, LeaveRequestRepository leaveRequestRepository, PayrollRepository payrollRepository) {
        this.userRepository = userRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.payrollRepository = payrollRepository;
    }

    @Transactional(readOnly = true)
    public WorkforceAnalyticsDto getWorkforceAnalytics() {
        verifyAdminOrHr();

        List<User> users = userRepository.findAll();
        List<EmployeeProfile> profiles = employeeProfileRepository.findAll();

        long total = users.size();
        long active = users.stream().filter(u -> u.getStatus() == UserStatus.ACTIVE).count();
        long pendingHr = users.stream().filter(u -> u.getStatus() == UserStatus.PENDING_APPROVAL).count();

        Map<String, Long> byDepartment = profiles.stream()
                .filter(p -> p.getDepartment() != null)
                .collect(Collectors.groupingBy(p -> p.getDepartment().getName(), Collectors.counting()));

        Map<String, Long> byRole = users.stream()
                .collect(Collectors.groupingBy(u -> u.getRole().name(), Collectors.counting()));

        return new WorkforceAnalyticsDto(total, active, pendingHr, byDepartment, byRole);
    }

    @Transactional(readOnly = true)
    public AttendanceAnalyticsDto getAttendanceAnalytics() {
        verifyAdminOrHr();

        LocalDate today = LocalDate.now();
        List<Attendance> todayRecords = attendanceRepository.findByDate(today);

        long present = todayRecords.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
        long onLeave = todayRecords.stream().filter(a -> a.getStatus() == AttendanceStatus.LEAVE).count();
        long totalUsers = userRepository.count();
        long absent = Math.max(0, totalUsers - present - onLeave);

        double rate = totalUsers > 0 
                ? Math.round(((double) present / totalUsers) * 100.0 * 100.0) / 100.0 
                : 0.0;

        return new AttendanceAnalyticsDto(present, absent, onLeave, rate);
    }

    @Transactional(readOnly = true)
    public LeaveAnalyticsDto getLeaveAnalytics() {
        verifyAdminOrHr();

        List<LeaveRequest> requests = leaveRequestRepository.findAll();

        long total = requests.size();
        long pending = requests.stream().filter(r -> r.getStatus() == LeaveStatus.PENDING).count();
        long approved = requests.stream().filter(r -> r.getStatus() == LeaveStatus.APPROVED).count();
        long rejected = requests.stream().filter(r -> r.getStatus() == LeaveStatus.REJECTED).count();

        Map<String, Long> byType = requests.stream()
                .collect(Collectors.groupingBy(r -> r.getLeaveType().name(), Collectors.counting()));

        return new LeaveAnalyticsDto(total, pending, approved, rejected, byType);
    }

    @Transactional(readOnly = true)
    public PayrollAnalyticsDto getPayrollAnalytics() {
        verifyAdminOrHr();

        List<Payroll> payrolls = payrollRepository.findAll();

        BigDecimal totalBase = payrolls.stream().map(Payroll::getBaseSalary).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalAllowances = payrolls.stream().map(Payroll::getAllowances).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalDeductions = payrolls.stream().map(Payroll::getDeductions).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalNet = payrolls.stream().map(Payroll::getNetSalary).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avgNet = payrolls.isEmpty() 
                ? BigDecimal.ZERO 
                : totalNet.divide(BigDecimal.valueOf(payrolls.size()), 2, RoundingMode.HALF_UP);

        return new PayrollAnalyticsDto(totalBase, totalAllowances, totalDeductions, totalNet, avgNet);
    }

    private void verifyAdminOrHr() {
        if (!SecurityUtils.isAdminOrHr()) {
            throw new ForbiddenException("Only HR or Admin can view analytics data.");
        }
    }
}
