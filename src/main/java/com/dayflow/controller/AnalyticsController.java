package com.dayflow.controller;

import com.dayflow.dto.AttendanceAnalyticsDto;
import com.dayflow.dto.LeaveAnalyticsDto;
import com.dayflow.dto.PayrollAnalyticsDto;
import com.dayflow.dto.WorkforceAnalyticsDto;
import com.dayflow.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/workforce")
    public ResponseEntity<WorkforceAnalyticsDto> getWorkforceAnalytics() {
        return ResponseEntity.ok(analyticsService.getWorkforceAnalytics());
    }

    @GetMapping("/attendance")
    public ResponseEntity<AttendanceAnalyticsDto> getAttendanceAnalytics() {
        return ResponseEntity.ok(analyticsService.getAttendanceAnalytics());
    }

    @GetMapping("/leave")
    public ResponseEntity<LeaveAnalyticsDto> getLeaveAnalytics() {
        return ResponseEntity.ok(analyticsService.getLeaveAnalytics());
    }

    @GetMapping("/payroll")
    public ResponseEntity<PayrollAnalyticsDto> getPayrollAnalytics() {
        return ResponseEntity.ok(analyticsService.getPayrollAnalytics());
    }
}
