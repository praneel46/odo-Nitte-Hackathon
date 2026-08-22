package com.dayflow.service;

import com.dayflow.dto.AttendanceDto;
import com.dayflow.dto.StartBreakRequest;
import com.dayflow.dto.WorkBreakDto;
import com.dayflow.entity.Attendance;
import com.dayflow.entity.EmployeeProfile;
import com.dayflow.entity.User;
import com.dayflow.entity.WorkBreak;
import com.dayflow.enums.AttendanceStatus;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.ForbiddenException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.AttendanceRepository;
import com.dayflow.repository.EmployeeProfileRepository;
import com.dayflow.repository.UserRepository;
import com.dayflow.repository.WorkBreakRepository;
import com.dayflow.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final WorkBreakRepository workBreakRepository;
    private final UserRepository userRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final AuditLogService auditLogService;

    public AttendanceService(AttendanceRepository attendanceRepository, WorkBreakRepository workBreakRepository, UserRepository userRepository, EmployeeProfileRepository employeeProfileRepository, AuditLogService auditLogService) {
        this.attendanceRepository = attendanceRepository;
        this.workBreakRepository = workBreakRepository;
        this.userRepository = userRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public AttendanceDto checkIn() {
        Long userId = SecurityUtils.getCurrentUserId();
        LocalDate today = LocalDate.now();

        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(userId, today);
        if (existing.isPresent() && existing.get().getCheckInTime() != null) {
            throw new BadRequestException("Cannot double check-in: already checked in for today (" + today + ")");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Attendance attendance = existing.orElseGet(() -> Attendance.builder()
                .employee(user)
                .date(today)
                .status(AttendanceStatus.PRESENT)
                .build());

        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setStatus(AttendanceStatus.PRESENT);
        attendance = attendanceRepository.save(attendance);

        auditLogService.logAction(userId, "CHECK_IN", "Attendance", attendance.getId(), "Check-in at " + attendance.getCheckInTime(), "127.0.0.1");

        return mapToDto(attendance);
    }

    @Transactional
    public AttendanceDto checkOut() {
        Long userId = SecurityUtils.getCurrentUserId();
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(userId, today)
                .orElseThrow(() -> new BadRequestException("Cannot check out before check-in. No check-in record found for today."));

        if (attendance.getCheckInTime() == null) {
            throw new BadRequestException("Cannot check out before check-in.");
        }

        Optional<WorkBreak> activeBreak = workBreakRepository.findFirstByAttendanceAndEndTimeIsNull(attendance);
        if (activeBreak.isPresent()) {
            throw new BadRequestException("Cannot check out while an active break exists. Please end your break first.");
        }

        LocalDateTime checkOutTime = LocalDateTime.now();
        attendance.setCheckOutTime(checkOutTime);

        long totalDurationMinutes = Duration.between(attendance.getCheckInTime(), checkOutTime).toMinutes();

        List<WorkBreak> breaks = workBreakRepository.findByAttendanceId(attendance.getId());
        long totalBreakMinutes = breaks.stream()
                .filter(b -> b.getDurationMinutes() != null)
                .mapToLong(WorkBreak::getDurationMinutes)
                .sum();

        long netWorkMinutes = Math.max(0, totalDurationMinutes - totalBreakMinutes);
        attendance.setTotalWorkMinutes(netWorkMinutes);

        attendance = attendanceRepository.save(attendance);

        auditLogService.logAction(userId, "CHECK_OUT", "Attendance", attendance.getId(), "Check-out at " + checkOutTime + ", net minutes: " + netWorkMinutes, "127.0.0.1");

        return mapToDto(attendance);
    }

    @Transactional
    public WorkBreakDto startBreak(StartBreakRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(userId, today)
                .orElseThrow(() -> new BadRequestException("Must check-in before starting a break."));

        if (attendance.getCheckOutTime() != null) {
            throw new BadRequestException("Cannot start break after check-out.");
        }

        Optional<WorkBreak> activeBreak = workBreakRepository.findFirstByAttendanceAndEndTimeIsNull(attendance);
        if (activeBreak.isPresent()) {
            throw new BadRequestException("Cannot start multiple active breaks. End current break first.");
        }

        WorkBreak workBreak = WorkBreak.builder()
                .attendance(attendance)
                .breakType(request.getBreakType())
                .startTime(LocalDateTime.now())
                .build();

        workBreak = workBreakRepository.save(workBreak);

        return new WorkBreakDto(workBreak.getId(), workBreak.getBreakType(), workBreak.getStartTime(), workBreak.getEndTime(), workBreak.getDurationMinutes());
    }

    @Transactional
    public WorkBreakDto endBreak() {
        Long userId = SecurityUtils.getCurrentUserId();
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(userId, today)
                .orElseThrow(() -> new BadRequestException("No attendance record for today."));

        WorkBreak workBreak = workBreakRepository.findFirstByAttendanceAndEndTimeIsNull(attendance)
                .orElseThrow(() -> new BadRequestException("Cannot end inactive break. No active break found."));

        LocalDateTime endTime = LocalDateTime.now();
        workBreak.setEndTime(endTime);
        long duration = Math.max(1, Duration.between(workBreak.getStartTime(), endTime).toMinutes());
        workBreak.setDurationMinutes(duration);

        workBreak = workBreakRepository.save(workBreak);

        return new WorkBreakDto(workBreak.getId(), workBreak.getBreakType(), workBreak.getStartTime(), workBreak.getEndTime(), workBreak.getDurationMinutes());
    }

    @Transactional(readOnly = true)
    public AttendanceDto getTodayAttendance() {
        Long userId = SecurityUtils.getCurrentUserId();
        LocalDate today = LocalDate.now();

        Optional<Attendance> attendance = attendanceRepository.findByEmployeeIdAndDate(userId, today);
        return attendance.map(this::mapToDto).orElseGet(() -> {
            User user = userRepository.findById(userId).orElseThrow();
            EmployeeProfile profile = employeeProfileRepository.findByUser(user).orElse(null);
            String name = profile != null ? profile.getFirstName() + " " + profile.getLastName() : user.getEmail();
            return AttendanceDto.builder()
                    .userId(userId)
                    .employeeName(name)
                    .employeeId(user.getEmployeeId())
                    .date(today)
                    .status(AttendanceStatus.ABSENT)
                    .build();
        });
    }

    @Transactional(readOnly = true)
    public List<AttendanceDto> getMyAttendance() {
        Long userId = SecurityUtils.getCurrentUserId();
        return attendanceRepository.findByEmployeeIdOrderByDateDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AttendanceDto> getAllAttendance(LocalDate date, Long employeeId) {
        if (!SecurityUtils.isAdminOrHr()) {
            throw new ForbiddenException("Only HR or Admin can view company-wide attendance.");
        }

        if (employeeId != null) {
            return attendanceRepository.findByEmployeeIdOrderByDateDesc(employeeId).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        }

        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        return attendanceRepository.findByDate(targetDate).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AttendanceDto mapToDto(Attendance attendance) {
        User user = attendance.getEmployee();
        EmployeeProfile profile = employeeProfileRepository.findByUser(user).orElse(null);
        String name = profile != null ? profile.getFirstName() + " " + profile.getLastName() : user.getEmail();

        List<WorkBreak> breaks = workBreakRepository.findByAttendanceId(attendance.getId());
        List<WorkBreakDto> breakDtos = breaks.stream()
                .map(b -> new WorkBreakDto(b.getId(), b.getBreakType(), b.getStartTime(), b.getEndTime(), b.getDurationMinutes()))
                .collect(Collectors.toList());

        WorkBreakDto activeBreakDto = breaks.stream()
                .filter(b -> b.getEndTime() == null)
                .findFirst()
                .map(b -> new WorkBreakDto(b.getId(), b.getBreakType(), b.getStartTime(), b.getEndTime(), b.getDurationMinutes()))
                .orElse(null);

        return AttendanceDto.builder()
                .id(attendance.getId())
                .userId(user.getId())
                .employeeName(name)
                .employeeId(user.getEmployeeId())
                .date(attendance.getDate())
                .status(attendance.getStatus())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .totalWorkMinutes(attendance.getTotalWorkMinutes())
                .activeBreak(activeBreakDto)
                .breaks(breakDtos)
                .build();
    }
}
