package com.dayflow.dto;

import java.math.BigDecimal;
import java.util.Map;

public class WorkforceAnalyticsDto {
    private long totalEmployees;
    private long activeEmployees;
    private long pendingHrApprovals;
    private Map<String, Long> employeesByDepartment;
    private Map<String, Long> employeesByRole;

    public WorkforceAnalyticsDto() {}

    public WorkforceAnalyticsDto(long totalEmployees, long activeEmployees, long pendingHrApprovals, Map<String, Long> employeesByDepartment, Map<String, Long> employeesByRole) {
        this.totalEmployees = totalEmployees;
        this.activeEmployees = activeEmployees;
        this.pendingHrApprovals = pendingHrApprovals;
        this.employeesByDepartment = employeesByDepartment;
        this.employeesByRole = employeesByRole;
    }

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getActiveEmployees() { return activeEmployees; }
    public void setActiveEmployees(long activeEmployees) { this.activeEmployees = activeEmployees; }

    public long getPendingHrApprovals() { return pendingHrApprovals; }
    public void setPendingHrApprovals(long pendingHrApprovals) { this.pendingHrApprovals = pendingHrApprovals; }

    public Map<String, Long> getEmployeesByDepartment() { return employeesByDepartment; }
    public void setEmployeesByDepartment(Map<String, Long> employeesByDepartment) { this.employeesByDepartment = employeesByDepartment; }

    public Map<String, Long> getEmployeesByRole() { return employeesByRole; }
    public void setEmployeesByRole(Map<String, Long> employeesByRole) { this.employeesByRole = employeesByRole; }
}
