package com.dayflow.service;

import com.dayflow.dto.NotificationDto;
import com.dayflow.entity.Notification;
import com.dayflow.entity.User;
import com.dayflow.enums.NotificationType;
import com.dayflow.exception.ForbiddenException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.NotificationRepository;
import com.dayflow.repository.UserRepository;
import com.dayflow.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public NotificationDto createNotification(Long userId, String title, String message, NotificationType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type != null ? type : NotificationType.INFO)
                .build();

        notification = notificationRepository.save(notification);
        return mapToDto(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getMyNotifications() {
        Long userId = SecurityUtils.getCurrentUserId();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationDto markAsRead(Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You cannot mark another user's notification as read.");
        }

        notification.setRead(true);
        notification = notificationRepository.save(notification);
        return mapToDto(notification);
    }

    @Transactional
    public void markAllAsRead() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    private NotificationDto mapToDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .userId(notification.getUser().getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
