package com.dayflow.controller;

import com.dayflow.dto.PayrollDto;
import com.dayflow.dto.SalarySlipDto;
import com.dayflow.dto.UpdatePayrollRequest;
import com.dayflow.service.PayrollService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @GetMapping("/me")
    public ResponseEntity<PayrollDto> getMyPayroll() {
        return ResponseEntity.ok(payrollService.getMyPayroll());
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<PayrollDto> getEmployeePayroll(@PathVariable("employeeId") Long employeeId) {
        return ResponseEntity.ok(payrollService.getEmployeePayroll(employeeId));
    }

    @PutMapping("/{employeeId}")
    public ResponseEntity<PayrollDto> updateEmployeePayroll(@PathVariable("employeeId") Long employeeId,
                                                             @Valid @RequestBody UpdatePayrollRequest request) {
        return ResponseEntity.ok(payrollService.updateEmployeePayroll(employeeId, request));
    }

    @GetMapping("/slips/me")
    public ResponseEntity<List<SalarySlipDto>> getMySalarySlips() {
        return ResponseEntity.ok(payrollService.getMySalarySlips());
    }

    @GetMapping("/slips/{employeeId}")
    public ResponseEntity<List<SalarySlipDto>> getEmployeeSalarySlips(@PathVariable("employeeId") Long employeeId) {
        return ResponseEntity.ok(payrollService.getEmployeeSalarySlips(employeeId));
    }

    @GetMapping("/slips/{id}/download")
    public ResponseEntity<SalarySlipDto> getSalarySlipById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(payrollService.getSalarySlipById(id));
    }
}
