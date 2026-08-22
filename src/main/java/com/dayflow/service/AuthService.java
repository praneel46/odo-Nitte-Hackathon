package com.dayflow.service;

import com.dayflow.dto.AuthResponse;
import com.dayflow.dto.LoginRequest;
import com.dayflow.dto.RegisterRequest;
import com.dayflow.dto.UserSummaryDto;
import com.dayflow.entity.EmployeeProfile;
import com.dayflow.entity.User;
import com.dayflow.enums.Role;
import com.dayflow.enums.UserStatus;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.ConflictException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.exception.UnauthorizedException;
import com.dayflow.repository.EmployeeProfileRepository;
import com.dayflow.repository.UserRepository;
import com.dayflow.security.JwtTokenProvider;
import com.dayflow.security.SecurityUtils;
import com.dayflow.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${app.dev-mode:true}")
    private boolean devMode;

    public AuthService(UserRepository userRepository, EmployeeProfileRepository employeeProfileRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email is already registered: " + request.getEmail());
        }
        if (userRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new ConflictException("Employee ID is already registered: " + request.getEmployeeId());
        }

        Role requestedRole = request.getRole();
        if (requestedRole == Role.ADMIN) {
            throw new BadRequestException("Public registration for ADMIN role is strictly forbidden");
        }

        Role assignedRole = (requestedRole == Role.HR) ? Role.HR : Role.EMPLOYEE;
        UserStatus status = (assignedRole == Role.HR) ? UserStatus.PENDING_APPROVAL : UserStatus.ACTIVE;
        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .employeeId(request.getEmployeeId())
                .role(assignedRole)
                .status(status)
                .emailVerified(devMode)
                .verificationToken(verificationToken)
                .build();

        user = userRepository.save(user);

        EmployeeProfile profile = EmployeeProfile.builder()
                .user(user)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();

        employeeProfileRepository.save(profile);

        String message = (assignedRole == Role.HR) 
                ? "HR Registration submitted and pending Admin approval." 
                : "Registration successful.";

        return AuthResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .employeeId(user.getEmployeeId())
                .role(user.getRole())
                .status(user.getStatus())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .message(message)
                .devVerificationToken(devMode ? verificationToken : null)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (user.getStatus() == UserStatus.DISABLED) {
            throw new UnauthorizedException("Account is disabled. Contact HR/Admin.");
        }

        if (user.getStatus() == UserStatus.PENDING_APPROVAL) {
            throw new UnauthorizedException("HR account pending admin approval.");
        }

        EmployeeProfile profile = employeeProfileRepository.findByUser(user).orElse(null);
        String firstName = profile != null ? profile.getFirstName() : "";
        String lastName = profile != null ? profile.getLastName() : "";

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .employeeId(user.getEmployeeId())
                .role(user.getRole())
                .status(user.getStatus())
                .firstName(firstName)
                .lastName(lastName)
                .message("Login successful")
                .build();
    }

    @Transactional(readOnly = true)
    public UserSummaryDto getMe() {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        EmployeeProfile profile = employeeProfileRepository.findByUser(user).orElse(null);

        return UserSummaryDto.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .employeeId(user.getEmployeeId())
                .role(user.getRole())
                .status(user.getStatus())
                .emailVerified(user.isEmailVerified())
                .firstName(profile != null ? profile.getFirstName() : "")
                .lastName(profile != null ? profile.getLastName() : "")
                .build();
    }

    @Transactional
    public Map<String, Object> verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired verification token"));

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return Map.of(
                "message", "Email verified successfully",
                "status", user.getStatus()
        );
    }
}
