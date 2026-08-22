package com.dayflow.service;

import com.dayflow.dto.AuditLogDto;
import com.dayflow.entity.AuditLog;
import com.dayflow.entity.User;
import com.dayflow.repository.AuditLogRepository;
import com.dayflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditLogService(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void logAction(Long userId, String action, String entityName, Long entityId, String details, String ipAddress) {
        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;
        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .details(details)
                .ipAddress(ipAddress)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(auditLog);
    }

    @Transactional(readOnly = true)
    public List<AuditLogDto> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AuditLogDto mapToDto(AuditLog log) {
        return AuditLogDto.builder()
                .id(log.getId())
                .userId(log.getUser() != null ? log.getUser().getId() : null)
                .userEmail(log.getUser() != null ? log.getUser().getEmail() : "SYSTEM")
                .action(log.getAction())
                .entityName(log.getEntityName())
                .entityId(log.getEntityId())
                .details(log.getDetails())
                .ipAddress(log.getIpAddress())
                .timestamp(log.getTimestamp())
                .build();
    }
}
