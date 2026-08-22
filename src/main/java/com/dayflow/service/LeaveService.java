package com.dayflow.service;

import com.dayflow.dto.*;
import com.dayflow.entity.EmployeeProfile;
import com.dayflow.entity.LeaveBalance;
import com.dayflow.entity.LeaveRequest;
import com.dayflow.entity.User;
import com.dayflow.enums.LeaveStatus;
import com.dayflow.enums.LeaveType;
import com.dayflow.enums.NotificationType;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.ForbiddenException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.EmployeeProfileRepository;
import com.dayflow.repository.LeaveBalanceRepository;
import com.dayflow.repository.LeaveRequestRepository;
import com.dayflow.repository.UserRepository;
import com.dayflow.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final UserRepository userRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    public LeaveService(LeaveRequestRepository leaveRequestRepository, LeaveBalanceRepository leaveBalanceRepository, UserRepository userRepository, EmployeeProfileRepository employeeProfileRepository, AuditLogService auditLogService, NotificationService notificationService) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.userRepository = userRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
    }

    @Transactional
    public LeaveRequestDto createLeaveRequest(CreateLeaveRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date.");
        }

        double requestedDays = calculateWorkingDays(request.getStartDate(), request.getEndDate());
        if (requestedDays <= 0) {
            throw new BadRequestException("Requested leave range contains no working days (weekends excluded).");
        }

        List<LeaveRequest> overlapping = leaveRequestRepository.findOverlappingApprovedLeaves(userId, request.getStartDate(), request.getEndDate());
        if (!overlapping.isEmpty()) {
            throw new BadRequestException("Requested dates overlap with an existing approved leave request.");
        }

        int year = request.getStartDate().getYear();
        User user = userRepository.findById(userId).orElseThrow();

        if (request.getLeaveType() != LeaveType.UNPAID) {
            LeaveBalance balance = leaveBalanceRepository.findByEmployeeAndYearAndLeaveType(user, year, request.getLeaveType())
                    .orElseGet(() -> createDefaultBalance(user, year, request.getLeaveType()));

            double available = balance.getTotalEntitled() - balance.getUsed() - balance.getPending();
            if (requestedDays > available) {
                throw new BadRequestException("Insufficient " + request.getLeaveType() + " leave balance. Available: " + available + " days, Requested: " + requestedDays + " days.");
            }

            balance.setPending(balance.getPending() + requestedDays);
            leaveBalanceRepository.save(balance);
        }

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employee(user)
                .leaveType(request.getLeaveType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .requestedDays(requestedDays)
                .reason(request.getReason())
                .status(LeaveStatus.PENDING)
                .build();

        leaveRequest = leaveRequestRepository.save(leaveRequest);

        auditLogService.logAction(userId, "CREATE_LEAVE_REQUEST", "LeaveRequest", leaveRequest.getId(), "Created " + request.getLeaveType() + " leave for " + requestedDays + " days", "127.0.0.1");

        return mapToDto(leaveRequest);
    }

    @Transactional
    public LeaveRequestDto approveLeave(Long id, ApproveRejectLeaveRequest request) {
        if (!SecurityUtils.isAdminOrHr()) {
            throw new ForbiddenException("Only HR or Admin can approve leave requests.");
        }

        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with ID: " + id));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Leave request has already been processed (Status: " + leaveRequest.getStatus() + ").");
        }

        Long adminId = SecurityUtils.getCurrentUserId();
        User admin = userRepository.findById(adminId).orElseThrow();

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setAdminComment(request != null ? request.getAdminComment() : null);
        leaveRequest.setApprovedBy(admin);

        leaveRequest = leaveRequestRepository.save(leaveRequest);

        if (leaveRequest.getLeaveType() != LeaveType.UNPAID) {
            int year = leaveRequest.getStartDate().getYear();
            Optional<LeaveBalance> balanceOpt = leaveBalanceRepository.findByEmployeeAndYearAndLeaveType(leaveRequest.getEmployee(), year, leaveRequest.getLeaveType());
            if (balanceOpt.isPresent()) {
                LeaveBalance balance = balanceOpt.get();
                balance.setPending(Math.max(0, balance.getPending() - leaveRequest.getRequestedDays()));
                balance.setUsed(balance.getUsed() + leaveRequest.getRequestedDays());
                leaveBalanceRepository.save(balance);
            }
        }

        auditLogService.logAction(adminId, "APPROVE_LEAVE", "LeaveRequest", leaveRequest.getId(), "Approved leave ID " + id, "127.0.0.1");

        notificationService.createNotification(
                leaveRequest.getEmployee().getId(),
                "Leave Request Approved",
                "Your " + leaveRequest.getLeaveType() + " leave request from " + leaveRequest.getStartDate() + " to " + leaveRequest.getEndDate() + " has been approved.",
                NotificationType.SUCCESS
        );

        return mapToDto(leaveRequest);
    }

    @Transactional
    public LeaveRequestDto rejectLeave(Long id, ApproveRejectLeaveRequest request) {
        if (!SecurityUtils.isAdminOrHr()) {
            throw new ForbiddenException("Only HR or Admin can reject leave requests.");
        }

        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with ID: " + id));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Leave request has already been processed.");
        }

        Long adminId = SecurityUtils.getCurrentUserId();
        User admin = userRepository.findById(adminId).orElseThrow();

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setAdminComment(request != null ? request.getAdminComment() : null);
        leaveRequest.setApprovedBy(admin);

        leaveRequest = leaveRequestRepository.save(leaveRequest);

        if (leaveRequest.getLeaveType() != LeaveType.UNPAID) {
            int year = leaveRequest.getStartDate().getYear();
            Optional<LeaveBalance> balanceOpt = leaveBalanceRepository.findByEmployeeAndYearAndLeaveType(leaveRequest.getEmployee(), year, leaveRequest.getLeaveType());
            if (balanceOpt.isPresent()) {
                LeaveBalance balance = balanceOpt.get();
                balance.setPending(Math.max(0, balance.getPending() - leaveRequest.getRequestedDays()));
                leaveBalanceRepository.save(balance);
            }
        }

        auditLogService.logAction(adminId, "REJECT_LEAVE", "LeaveRequest", leaveRequest.getId(), "Rejected leave ID " + id, "127.0.0.1");

        notificationService.createNotification(
                leaveRequest.getEmployee().getId(),
                "Leave Request Rejected",
                "Your " + leaveRequest.getLeaveType() + " leave request was rejected. Comment: " + (request != null && request.getAdminComment() != null ? request.getAdminComment() : "No comment provided."),
                NotificationType.WARNING
        );

        return mapToDto(leaveRequest);
    }

    @Transactional(readOnly = true)
    public LeavePreviewDto getLeavePreview(LeaveType leaveType, LocalDate startDate, LocalDate endDate) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (startDate == null || endDate == null || endDate.isBefore(startDate)) {
            return new LeavePreviewDto(leaveType, 0, 0, 0, 100.0, 0, false, "Invalid or missing date range.");
        }

        double requestedDays = calculateWorkingDays(startDate, endDate);
        if (requestedDays <= 0) {
            return new LeavePreviewDto(leaveType, 0, 0, 0, 100.0, 0, false, "Selected dates contain no working days (weekends excluded).");
        }

        User user = userRepository.findById(userId).orElseThrow();
        int year = startDate.getYear();

        double currentBalance = 0;
        if (leaveType == LeaveType.UNPAID) {
            currentBalance = 30.0;
        } else {
            LeaveBalance balance = leaveBalanceRepository.findByEmployeeAndYearAndLeaveType(user, year, leaveType)
                    .orElseGet(() -> createDefaultBalance(user, year, leaveType));
            currentBalance = Math.max(0, balance.getTotalEntitled() - balance.getUsed() - balance.getPending());
        }

        double remainingBalance = currentBalance - requestedDays;
        boolean valid = remainingBalance >= 0 || leaveType == LeaveType.UNPAID;
        String message = valid ? "Sufficient leave quota available." : "Insufficient leave balance.";

        List<LeaveRequest> approvedInRange = leaveRequestRepository.findAllApprovedLeavesInRange(startDate, endDate);
        long overlappingCount = approvedInRange.size();
        long totalEmployees = userRepository.count();
        double availability = totalEmployees > 0 
                ? Math.round(((double)(totalEmployees - overlappingCount) / totalEmployees) * 100.0 * 100.0) / 100.0 
                : 100.0;

        return new LeavePreviewDto(leaveType, requestedDays, currentBalance, Math.max(0, remainingBalance), availability, overlappingCount, valid, message);
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestDto> getMyLeaves() {
        Long userId = SecurityUtils.getCurrentUserId();
        return leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveBalanceDto> getMyBalances() {
        Long userId = SecurityUtils.getCurrentUserId();
        int currentYear = LocalDate.now().getYear();

        ensureDefaultBalances(userId, currentYear);

        return leaveBalanceRepository.findByEmployeeIdAndYear(userId, currentYear).stream()
                .map(b -> new LeaveBalanceDto(b.getId(), b.getEmployee().getId(), b.getYear(), b.getLeaveType(), b.getTotalEntitled(), b.getUsed(), b.getPending()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestDto> getAllLeaves() {
        if (!SecurityUtils.isAdminOrHr()) {
            throw new ForbiddenException("Only HR or Admin can view all leave requests.");
        }
        return leaveRequestRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LeaveInsightsDto getLeaveInsights() {
        if (!SecurityUtils.isAdminOrHr()) {
            throw new ForbiddenException("Only HR or Admin can view leave insights.");
        }

        List<LeaveRequest> allRequests = leaveRequestRepository.findAll();
        long approvedCount = allRequests.stream().filter(r -> r.getStatus() == LeaveStatus.APPROVED).count();
        long pendingCount = allRequests.stream().filter(r -> r.getStatus() == LeaveStatus.PENDING).count();

        double sickTaken = allRequests.stream().filter(r -> r.getStatus() == LeaveStatus.APPROVED && r.getLeaveType() == LeaveType.SICK).mapToDouble(LeaveRequest::getRequestedDays).sum();
        double paidTaken = allRequests.stream().filter(r -> r.getStatus() == LeaveStatus.APPROVED && r.getLeaveType() == LeaveType.PAID).mapToDouble(LeaveRequest::getRequestedDays).sum();
        double unpaidTaken = allRequests.stream().filter(r -> r.getStatus() == LeaveStatus.APPROVED && r.getLeaveType() == LeaveType.UNPAID).mapToDouble(LeaveRequest::getRequestedDays).sum();

        long totalEmployees = userRepository.count();
        LocalDate today = LocalDate.now();
        List<LeaveRequest> todayLeaves = leaveRequestRepository.findAllApprovedLeavesInRange(today, today);
        long onLeaveToday = todayLeaves.size();

        double availability = totalEmployees > 0 
                ? Math.round(((double)(totalEmployees - onLeaveToday) / totalEmployees) * 100.0 * 100.0) / 100.0 
                : 100.0;

        return LeaveInsightsDto.builder()
                .totalApprovedLeaves(approvedCount)
                .pendingRequestsCount(pendingCount)
                .sickLeavesTaken(sickTaken)
                .paidLeavesTaken(paidTaken)
                .unpaidLeavesTaken(unpaidTaken)
                .teamAvailabilityPercentage(availability)
                .build();
    }

    private double calculateWorkingDays(LocalDate startDate, LocalDate endDate) {
        double count = 0;
        LocalDate curr = startDate;
        while (!curr.isAfter(endDate)) {
            if (curr.getDayOfWeek() != DayOfWeek.SATURDAY && curr.getDayOfWeek() != DayOfWeek.SUNDAY) {
                count++;
            }
            curr = curr.plusDays(1);
        }
        return count;
    }

    private void ensureDefaultBalances(Long userId, int year) {
        User user = userRepository.findById(userId).orElseThrow();
        for (LeaveType type : LeaveType.values()) {
            if (leaveBalanceRepository.findByEmployeeAndYearAndLeaveType(user, year, type).isEmpty()) {
                createDefaultBalance(user, year, type);
            }
        }
    }

    private LeaveBalance createDefaultBalance(User user, int year, LeaveType type) {
        double entitled = switch (type) {
            case PAID -> 15.0;
            case SICK -> 10.0;
            case UNPAID -> 30.0;
        };
        LeaveBalance balance = LeaveBalance.builder()
                .employee(user)
                .year(year)
                .leaveType(type)
                .totalEntitled(entitled)
                .used(0.0)
                .pending(0.0)
                .build();
        return leaveBalanceRepository.save(balance);
    }

    private LeaveRequestDto mapToDto(LeaveRequest request) {
        User user = request.getEmployee();
        EmployeeProfile profile = employeeProfileRepository.findByUser(user).orElse(null);
        String name = profile != null ? profile.getFirstName() + " " + profile.getLastName() : user.getEmail();

        String approvedName = null;
        if (request.getApprovedBy() != null) {
            EmployeeProfile appProfile = employeeProfileRepository.findByUser(request.getApprovedBy()).orElse(null);
            approvedName = appProfile != null ? appProfile.getFirstName() + " " + appProfile.getLastName() : request.getApprovedBy().getEmail();
        }

        return LeaveRequestDto.builder()
                .id(request.getId())
                .userId(user.getId())
                .employeeName(name)
                .employeeId(user.getEmployeeId())
                .leaveType(request.getLeaveType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .requestedDays(request.getRequestedDays())
                .reason(request.getReason())
                .status(request.getStatus())
                .adminComment(request.getAdminComment())
                .approvedByName(approvedName)
                .createdAt(request.getCreatedAt())
                .build();
    }
}
