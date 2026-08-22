package com.dayflow.service;

import com.dayflow.dto.EmployeeDto;
import com.dayflow.dto.UpdateEmployeeRequest;
import com.dayflow.dto.UpdateRoleRequest;
import com.dayflow.dto.UpdateStatusRequest;
import com.dayflow.entity.Department;
import com.dayflow.entity.EmployeeProfile;
import com.dayflow.entity.User;
import com.dayflow.exception.ForbiddenException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.DepartmentRepository;
import com.dayflow.repository.EmployeeProfileRepository;
import com.dayflow.repository.UserRepository;
import com.dayflow.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final UserRepository userRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final DepartmentRepository departmentRepository;
    private final AuditLogService auditLogService;

    public EmployeeService(UserRepository userRepository, EmployeeProfileRepository employeeProfileRepository, DepartmentRepository departmentRepository, AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.departmentRepository = departmentRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<EmployeeDto> getAllEmployees() {
        if (!SecurityUtils.isAdminOrHr()) {
            throw new ForbiddenException("Only HR and Admin can view all employees");
        }
        return employeeProfileRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(Long id) {
        EmployeeProfile profile = employeeProfileRepository.findById(id)
                .or(() -> employeeProfileRepository.findByUserId(id))
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found with ID: " + id));

        if (!SecurityUtils.isSelfOrAdminOrHr(profile.getUser().getId())) {
            throw new ForbiddenException("You are not authorized to view this profile");
        }

        return mapToDto(profile);
    }

    @Transactional
    public EmployeeDto updateEmployee(Long id, UpdateEmployeeRequest request) {
        EmployeeProfile profile = employeeProfileRepository.findById(id)
                .or(() -> employeeProfileRepository.findByUserId(id))
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found with ID: " + id));

        Long targetUserId = profile.getUser().getId();
        if (!SecurityUtils.isSelfOrAdminOrHr(targetUserId)) {
            throw new ForbiddenException("You are not authorized to update this profile");
        }

        boolean isAdmin = SecurityUtils.isAdmin();

        if (request.getFirstName() != null && isAdmin) profile.setFirstName(request.getFirstName());
        if (request.getLastName() != null && isAdmin) profile.setLastName(request.getLastName());
        if (request.getJobTitle() != null && isAdmin) profile.setJobTitle(request.getJobTitle());
        if (request.getDepartmentId() != null && isAdmin) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            profile.setDepartment(dept);
        }

        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getAddress() != null) profile.setAddress(request.getAddress());
        if (request.getProfilePictureUrl() != null) profile.setProfilePictureUrl(request.getProfilePictureUrl());

        profile = employeeProfileRepository.save(profile);

        auditLogService.logAction(
                SecurityUtils.getCurrentUserId(),
                "UPDATE_EMPLOYEE",
                "EmployeeProfile",
                profile.getId(),
                "Updated profile for user ID " + targetUserId,
                "127.0.0.1"
        );

        return mapToDto(profile);
    }

    @Transactional
    public EmployeeDto updateRole(Long id, UpdateRoleRequest request) {
        if (!SecurityUtils.isAdmin()) {
            throw new ForbiddenException("Only Admin can update user roles");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        user.setRole(request.getRole());
        userRepository.save(user);

        EmployeeProfile profile = employeeProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        auditLogService.logAction(
                SecurityUtils.getCurrentUserId(),
                "UPDATE_ROLE",
                "User",
                user.getId(),
                "Updated role to " + request.getRole(),
                "127.0.0.1"
        );

        return mapToDto(profile);
    }

    @Transactional
    public EmployeeDto updateStatus(Long id, UpdateStatusRequest request) {
        if (!SecurityUtils.isAdminOrHr()) {
            throw new ForbiddenException("Only HR or Admin can update account status");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        user.setStatus(request.getStatus());
        userRepository.save(user);

        EmployeeProfile profile = employeeProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        auditLogService.logAction(
                SecurityUtils.getCurrentUserId(),
                "UPDATE_STATUS",
                "User",
                user.getId(),
                "Updated status to " + request.getStatus(),
                "127.0.0.1"
        );

        return mapToDto(profile);
    }

    public EmployeeDto mapToDto(EmployeeProfile profile) {
        User user = profile.getUser();
        return EmployeeDto.builder()
                .id(profile.getId())
                .userId(user.getId())
                .email(user.getEmail())
                .employeeId(user.getEmployeeId())
                .role(user.getRole())
                .status(user.getStatus())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .phone(profile.getPhone())
                .address(profile.getAddress())
                .jobTitle(profile.getJobTitle())
                .departmentId(profile.getDepartment() != null ? profile.getDepartment().getId() : null)
                .departmentName(profile.getDepartment() != null ? profile.getDepartment().getName() : null)
                .dateOfJoining(profile.getDateOfJoining())
                .profilePictureUrl(profile.getProfilePictureUrl())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
