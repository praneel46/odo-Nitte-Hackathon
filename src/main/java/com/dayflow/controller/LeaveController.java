package com.dayflow.controller;

import com.dayflow.dto.*;
import com.dayflow.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<LeaveRequestDto>> getMyLeaves() {
        return ResponseEntity.ok(leaveService.getMyLeaves());
    }

    @GetMapping("/balance/me")
    public ResponseEntity<List<LeaveBalanceDto>> getMyBalances() {
        return ResponseEntity.ok(leaveService.getMyBalances());
    }

    @PostMapping
    public ResponseEntity<LeaveRequestDto> createLeaveRequest(@Valid @RequestBody CreateLeaveRequest request) {
        LeaveRequestDto response = leaveService.createLeaveRequest(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequestDto>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @GetMapping("/insights")
    public ResponseEntity<LeaveInsightsDto> getLeaveInsights() {
        return ResponseEntity.ok(leaveService.getLeaveInsights());
    }

    @GetMapping("/preview")
    public ResponseEntity<LeavePreviewDto> getLeavePreview(
            @RequestParam("leaveType") com.dayflow.enums.LeaveType leaveType,
            @RequestParam("startDate") @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate startDate,
            @RequestParam("endDate") @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate endDate) {
        return ResponseEntity.ok(leaveService.getLeavePreview(leaveType, startDate, endDate));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveRequestDto> approveLeave(@PathVariable("id") Long id,
                                                        @RequestBody(required = false) ApproveRejectLeaveRequest request) {
        return ResponseEntity.ok(leaveService.approveLeave(id, request));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveRequestDto> rejectLeave(@PathVariable("id") Long id,
                                                       @RequestBody(required = false) ApproveRejectLeaveRequest request) {
        return ResponseEntity.ok(leaveService.rejectLeave(id, request));
    }
}
