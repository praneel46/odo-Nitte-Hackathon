package com.dayflow.service;

import com.dayflow.dto.PayrollDto;
import com.dayflow.dto.SalarySlipDto;
import com.dayflow.dto.UpdatePayrollRequest;
import com.dayflow.entity.EmployeeProfile;
import com.dayflow.entity.Payroll;
import com.dayflow.entity.SalarySlip;
import com.dayflow.entity.User;
import com.dayflow.enums.NotificationType;
import com.dayflow.exception.ForbiddenException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.EmployeeProfileRepository;
import com.dayflow.repository.PayrollRepository;
import com.dayflow.repository.SalarySlipRepository;
import com.dayflow.repository.UserRepository;
import com.dayflow.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final SalarySlipRepository salarySlipRepository;
    private final UserRepository userRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    public PayrollService(PayrollRepository payrollRepository, SalarySlipRepository salarySlipRepository, UserRepository userRepository, EmployeeProfileRepository employeeProfileRepository, AuditLogService auditLogService, NotificationService notificationService) {
        this.payrollRepository = payrollRepository;
        this.salarySlipRepository = salarySlipRepository;
        this.userRepository = userRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public PayrollDto getMyPayroll() {
        Long userId = SecurityUtils.getCurrentUserId();
        Payroll payroll = payrollRepository.findByEmployeeId(userId)
                .orElseGet(() -> createDefaultPayroll(userId));
        return mapToDto(payroll);
    }

    @Transactional(readOnly = true)
    public PayrollDto getEmployeePayroll(Long employeeId) {
        if (!SecurityUtils.isSelfOrAdminOrHr(employeeId)) {
            throw new ForbiddenException("You are not authorized to view this payroll.");
        }
        Payroll payroll = payrollRepository.findByEmployeeId(employeeId)
                .orElseGet(() -> createDefaultPayroll(employeeId));
        return mapToDto(payroll);
    }

    @Transactional
    public PayrollDto updateEmployeePayroll(Long employeeId, UpdatePayrollRequest request) {
        if (!SecurityUtils.isAdmin()) {
            throw new ForbiddenException("Only Admin can update salary structures.");
        }

        User user = userRepository.findById(employeeId)
                .or(() -> userRepository.findByEmployeeId(String.valueOf(employeeId)))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + employeeId));

        Payroll payroll = payrollRepository.findByEmployeeId(user.getId())
                .orElseGet(() -> Payroll.builder()
                        .employee(user)
                        .baseSalary(BigDecimal.ZERO)
                        .allowances(BigDecimal.ZERO)
                        .deductions(BigDecimal.ZERO)
                        .netSalary(BigDecimal.ZERO)
                        .effectiveDate(LocalDate.now())
                        .build());

        BigDecimal base = request.getBaseSalary();
        BigDecimal allowances = request.getAllowances() != null ? request.getAllowances() : BigDecimal.ZERO;
        BigDecimal deductions = request.getDeductions() != null ? request.getDeductions() : BigDecimal.ZERO;
        BigDecimal net = base.add(allowances).subtract(deductions);

        payroll.setBaseSalary(base);
        payroll.setAllowances(allowances);
        payroll.setDeductions(deductions);
        payroll.setNetSalary(net);
        payroll.setEffectiveDate(request.getEffectiveDate());

        payroll = payrollRepository.save(payroll);

        String payPeriod = String.format("%d-%02d", request.getEffectiveDate().getYear(), request.getEffectiveDate().getMonthValue());
        SalarySlip slip = SalarySlip.builder()
                .employee(user)
                .payPeriod(payPeriod)
                .baseSalarySnapshot(base)
                .allowancesSnapshot(allowances)
                .deductionsSnapshot(deductions)
                .netSalarySnapshot(net)
                .pdfUrl("/api/payroll/slips/" + user.getId() + "/download")
                .build();
        salarySlipRepository.save(slip);

        auditLogService.logAction(
                SecurityUtils.getCurrentUserId(),
                "UPDATE_PAYROLL",
                "Payroll",
                payroll.getId(),
                "Updated salary structure for employee " + user.getId() + " to net: " + net,
                "127.0.0.1"
        );

        notificationService.createNotification(
                user.getId(),
                "Salary Structure Updated",
                "Your payroll structure has been updated. New net monthly compensation: $" + net + " (Effective: " + request.getEffectiveDate() + ").",
                NotificationType.INFO
        );

        return mapToDto(payroll);
    }

    @Transactional(readOnly = true)
    public List<SalarySlipDto> getMySalarySlips() {
        Long userId = SecurityUtils.getCurrentUserId();
        return salarySlipRepository.findByEmployeeIdOrderByGeneratedAtDesc(userId).stream()
                .map(this::mapSlipToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SalarySlipDto> getEmployeeSalarySlips(Long employeeId) {
        if (!SecurityUtils.isSelfOrAdminOrHr(employeeId)) {
            throw new ForbiddenException("You are not authorized to view salary slips for this employee.");
        }
        return salarySlipRepository.findByEmployeeIdOrderByGeneratedAtDesc(employeeId).stream()
                .map(this::mapSlipToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SalarySlipDto getSalarySlipById(Long id) {
        SalarySlip slip = salarySlipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salary slip not found with ID: " + id));

        if (!SecurityUtils.isSelfOrAdminOrHr(slip.getEmployee().getId())) {
            throw new ForbiddenException("You are not authorized to download this salary slip.");
        }

        return mapSlipToDto(slip);
    }

    private Payroll createDefaultPayroll(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        BigDecimal base = new BigDecimal("50000.00");
        BigDecimal allowances = new BigDecimal("10000.00");
        BigDecimal deductions = new BigDecimal("5000.00");
        BigDecimal net = base.add(allowances).subtract(deductions);

        Payroll payroll = Payroll.builder()
                .employee(user)
                .baseSalary(base)
                .allowances(allowances)
                .deductions(deductions)
                .netSalary(net)
                .effectiveDate(LocalDate.now().withDayOfMonth(1))
                .build();

        return payrollRepository.save(payroll);
    }

    private PayrollDto mapToDto(Payroll payroll) {
        User user = payroll.getEmployee();
        EmployeeProfile profile = employeeProfileRepository.findByUser(user).orElse(null);
        String name = profile != null ? profile.getFirstName() + " " + profile.getLastName() : user.getEmail();

        return PayrollDto.builder()
                .id(payroll.getId())
                .userId(user.getId())
                .employeeName(name)
                .employeeId(user.getEmployeeId())
                .baseSalary(payroll.getBaseSalary())
                .allowances(payroll.getAllowances())
                .deductions(payroll.getDeductions())
                .netSalary(payroll.getNetSalary())
                .effectiveDate(payroll.getEffectiveDate())
                .updatedAt(payroll.getUpdatedAt())
                .build();
    }

    private SalarySlipDto mapSlipToDto(SalarySlip slip) {
        User user = slip.getEmployee();
        EmployeeProfile profile = employeeProfileRepository.findByUser(user).orElse(null);
        String name = profile != null ? profile.getFirstName() + " " + profile.getLastName() : user.getEmail();

        return SalarySlipDto.builder()
                .id(slip.getId())
                .userId(user.getId())
                .employeeName(name)
                .employeeId(user.getEmployeeId())
                .payPeriod(slip.getPayPeriod())
                .baseSalarySnapshot(slip.getBaseSalarySnapshot())
                .allowancesSnapshot(slip.getAllowancesSnapshot())
                .deductionsSnapshot(slip.getDeductionsSnapshot())
                .netSalarySnapshot(slip.getNetSalarySnapshot())
                .generatedAt(slip.getGeneratedAt())
                .pdfUrl(slip.getPdfUrl())
                .build();
    }
}
