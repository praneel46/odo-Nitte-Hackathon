package com.dayflow.service;

import com.dayflow.dto.DocumentDto;
import com.dayflow.entity.Document;
import com.dayflow.entity.EmployeeProfile;
import com.dayflow.entity.User;
import com.dayflow.enums.DocumentType;
import com.dayflow.enums.NotificationType;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.ForbiddenException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.DocumentRepository;
import com.dayflow.repository.EmployeeProfileRepository;
import com.dayflow.repository.UserRepository;
import com.dayflow.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Value("${app.upload.dir:./uploads/documents}")
    private String uploadDir;

    public DocumentService(DocumentRepository documentRepository, UserRepository userRepository, EmployeeProfileRepository employeeProfileRepository, AuditLogService auditLogService, NotificationService notificationService) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
    }

    @Transactional
    public DocumentDto uploadDocument(MultipartFile file, DocumentType documentType, String documentName) {
        Long userId = SecurityUtils.getCurrentUserId();

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty.");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new BadRequestException("File size exceeds maximum allowed limit of 10MB.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.contains("..") || originalFilename.contains("/") || originalFilename.contains("\\")) {
            throw new BadRequestException("Invalid filename containing dangerous path characters.");
        }

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload directory", e);
        }

        String storedFileName = UUID.randomUUID() + "_" + originalFilename;
        Path targetLocation = uploadPath.resolve(storedFileName).normalize();

        if (!targetLocation.startsWith(uploadPath)) {
            throw new BadRequestException("Path traversal attempt detected.");
        }

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + originalFilename, e);
        }

        User user = userRepository.findById(userId).orElseThrow();

        Document document = Document.builder()
                .employee(user)
                .documentName((documentName != null && !documentName.isBlank()) ? documentName : originalFilename)
                .documentType(documentType != null ? documentType : DocumentType.OTHER)
                .filePath(targetLocation.toString())
                .fileSize(file.getSize())
                .mimeType(file.getContentType())
                .build();

        document = documentRepository.save(document);

        auditLogService.logAction(userId, "UPLOAD_DOCUMENT", "Document", document.getId(), "Uploaded document: " + document.getDocumentName(), "127.0.0.1");

        notificationService.createNotification(
                userId,
                "Document Uploaded",
                "Document '" + document.getDocumentName() + "' (" + document.getDocumentType() + ") has been uploaded successfully.",
                NotificationType.INFO
        );

        return mapToDto(document);
    }

    @Transactional(readOnly = true)
    public List<DocumentDto> getMyDocuments() {
        Long userId = SecurityUtils.getCurrentUserId();
        return documentRepository.findByEmployeeIdOrderByUploadedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DocumentDto> getEmployeeDocuments(Long employeeId) {
        if (!SecurityUtils.isSelfOrAdminOrHr(employeeId)) {
            throw new ForbiddenException("You are not authorized to view documents for this employee.");
        }
        return documentRepository.findByEmployeeIdOrderByUploadedAtDesc(employeeId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Resource loadDocumentAsResource(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        if (!SecurityUtils.isSelfOrAdminOrHr(document.getEmployee().getId())) {
            throw new ForbiddenException("You are not authorized to download this document.");
        }

        try {
            Path filePath = Paths.get(document.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found on server disk: " + document.getDocumentName());
            }
        } catch (Exception ex) {
            throw new ResourceNotFoundException("File error: " + ex.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Document getDocumentRecord(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));
    }

    @Transactional
    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        if (!SecurityUtils.isSelfOrAdminOrHr(document.getEmployee().getId())) {
            throw new ForbiddenException("You are not authorized to delete this document.");
        }

        try {
            Path filePath = Paths.get(document.getFilePath()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
        }

        documentRepository.delete(document);

        auditLogService.logAction(SecurityUtils.getCurrentUserId(), "DELETE_DOCUMENT", "Document", id, "Deleted document ID " + id, "127.0.0.1");
    }

    private DocumentDto mapToDto(Document doc) {
        User user = doc.getEmployee();
        EmployeeProfile profile = employeeProfileRepository.findByUser(user).orElse(null);
        String name = profile != null ? profile.getFirstName() + " " + profile.getLastName() : user.getEmail();

        return DocumentDto.builder()
                .id(doc.getId())
                .userId(user.getId())
                .employeeName(name)
                .documentName(doc.getDocumentName())
                .documentType(doc.getDocumentType())
                .fileSize(doc.getFileSize())
                .mimeType(doc.getMimeType())
                .uploadedAt(doc.getUploadedAt())
                .downloadUrl("/api/documents/" + doc.getId() + "/download")
                .build();
    }
}
