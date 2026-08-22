package com.dayflow.dto;

import java.time.LocalDateTime;

public class AuditLogDto {
    private Long id;
    private Long userId;
    private String userEmail;
    private String action;
    private String entityName;
    private Long entityId;
    private String details;
    private String ipAddress;
    private LocalDateTime timestamp;

    public AuditLogDto() {}

    public AuditLogDto(Long id, Long userId, String userEmail, String action, String entityName, Long entityId, String details, String ipAddress, LocalDateTime timestamp) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.action = action;
        this.entityName = entityName;
        this.entityId = entityId;
        this.details = details;
        this.ipAddress = ipAddress;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long userId;
        private String userEmail;
        private String action;
        private String entityName;
        private Long entityId;
        private String details;
        private String ipAddress;
        private LocalDateTime timestamp;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder userEmail(String userEmail) { this.userEmail = userEmail; return this; }
        public Builder action(String action) { this.action = action; return this; }
        public Builder entityName(String entityName) { this.entityName = entityName; return this; }
        public Builder entityId(Long entityId) { this.entityId = entityId; return this; }
        public Builder details(String details) { this.details = details; return this; }
        public Builder ipAddress(String ipAddress) { this.ipAddress = ipAddress; return this; }
        public Builder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public AuditLogDto build() {
            return new AuditLogDto(id, userId, userEmail, action, entityName, entityId, details, ipAddress, timestamp);
        }
    }
}
