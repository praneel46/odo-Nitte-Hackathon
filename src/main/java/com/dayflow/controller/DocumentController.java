package com.dayflow.controller;

import com.dayflow.dto.DocumentDto;
import com.dayflow.entity.Document;
import com.dayflow.enums.DocumentType;
import com.dayflow.service.DocumentService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<DocumentDto>> getMyDocuments() {
        return ResponseEntity.ok(documentService.getMyDocuments());
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<List<DocumentDto>> getEmployeeDocuments(@PathVariable("employeeId") Long employeeId) {
        return ResponseEntity.ok(documentService.getEmployeeDocuments(employeeId));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentDto> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "documentType", required = false) DocumentType documentType,
            @RequestParam(value = "documentName", required = false) String documentName) {
        DocumentDto response = documentService.uploadDocument(file, documentType, documentName);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable("id") Long id) {
        Resource resource = documentService.loadDocumentAsResource(id);
        Document doc = documentService.getDocumentRecord(id);

        String contentType = doc.getMimeType() != null ? doc.getMimeType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getDocumentName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable("id") Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
