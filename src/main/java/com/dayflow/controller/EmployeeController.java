package com.dayflow.controller;

import com.dayflow.dto.EmployeeDto;
import com.dayflow.dto.UpdateEmployeeRequest;
import com.dayflow.dto.UpdateRoleRequest;
import com.dayflow.dto.UpdateStatusRequest;
import com.dayflow.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable("id") Long id,
                                                       @RequestBody UpdateEmployeeRequest request) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, request));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<EmployeeDto> updateRole(@PathVariable("id") Long id,
                                                   @Valid @RequestBody UpdateRoleRequest request) {
        return ResponseEntity.ok(employeeService.updateRole(id, request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<EmployeeDto> updateStatus(@PathVariable("id") Long id,
                                                     @Valid @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(employeeService.updateStatus(id, request));
    }
}
