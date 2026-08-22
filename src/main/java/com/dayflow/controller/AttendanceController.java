package com.dayflow.controller;

import com.dayflow.dto.AttendanceDto;
import com.dayflow.dto.StartBreakRequest;
import com.dayflow.dto.WorkBreakDto;
import com.dayflow.service.AttendanceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<AttendanceDto>> getMyAttendance() {
        return ResponseEntity.ok(attendanceService.getMyAttendance());
    }

    @GetMapping("/today")
    public ResponseEntity<AttendanceDto> getTodayAttendance() {
        return ResponseEntity.ok(attendanceService.getTodayAttendance());
    }

    @GetMapping("/timeline/today")
    public ResponseEntity<AttendanceDto> getTodayTimeline() {
        return ResponseEntity.ok(attendanceService.getTodayAttendance());
    }

    @GetMapping
    public ResponseEntity<List<AttendanceDto>> getAllAttendance(
            @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(value = "employeeId", required = false) Long employeeId) {
        return ResponseEntity.ok(attendanceService.getAllAttendance(date, employeeId));
    }

    @PostMapping("/check-in")
    public ResponseEntity<AttendanceDto> checkIn() {
        return ResponseEntity.ok(attendanceService.checkIn());
    }

    @PostMapping("/check-out")
    public ResponseEntity<AttendanceDto> checkOut() {
        return ResponseEntity.ok(attendanceService.checkOut());
    }

    @PostMapping("/break/start")
    public ResponseEntity<WorkBreakDto> startBreak(@RequestBody(required = false) StartBreakRequest request) {
        return ResponseEntity.ok(attendanceService.startBreak(request));
    }

    @PostMapping("/break/end")
    public ResponseEntity<WorkBreakDto> endBreak() {
        return ResponseEntity.ok(attendanceService.endBreak());
    }
}
