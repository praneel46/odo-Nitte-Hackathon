package com.dayflow.dto;

import com.dayflow.enums.DocumentType;
import java.time.LocalDateTime;

public class DocumentDto {
    private Long id;
    private Long userId;
    private String employeeName;
    private String documentName;
    private DocumentType documentType;
    private Long fileSize;
    private String mimeType;
    private LocalDateTime uploadedAt;
    private String downloadUrl;

    public DocumentDto() {}

    public DocumentDto(Long id, Long userId, String employeeName, String documentName, DocumentType documentType, Long fileSize, String mimeType, LocalDateTime uploadedAt, String downloadUrl) {
        this.id = id;
        this.userId = userId;
        this.employeeName = employeeName;
        this.documentName = documentName;
        this.documentType = documentType;
        this.fileSize = fileSize;
        this.mimeType = mimeType;
        this.uploadedAt = uploadedAt;
        this.downloadUrl = downloadUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public DocumentType getDocumentType() { return documentType; }
    public void setDocumentType(DocumentType documentType) { this.documentType = documentType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long userId;
        private String employeeName;
        private String documentName;
        private DocumentType documentType;
        private Long fileSize;
        private String mimeType;
        private LocalDateTime uploadedAt;
        private String downloadUrl;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder employeeName(String employeeName) { this.employeeName = employeeName; return this; }
        public Builder documentName(String documentName) { this.documentName = documentName; return this; }
        public Builder documentType(DocumentType documentType) { this.documentType = documentType; return this; }
        public Builder fileSize(Long fileSize) { this.fileSize = fileSize; return this; }
        public Builder mimeType(String mimeType) { this.mimeType = mimeType; return this; }
        public Builder uploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; return this; }
        public Builder downloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; return this; }

        public DocumentDto build() {
            return new DocumentDto(id, userId, employeeName, documentName, documentType, fileSize, mimeType, uploadedAt, downloadUrl);
        }
    }
}
