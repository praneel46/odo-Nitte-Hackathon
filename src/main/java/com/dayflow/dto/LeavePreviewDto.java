package com.dayflow.dto;

import com.dayflow.enums.LeaveType;

public class LeavePreviewDto {
    private LeaveType leaveType;
    private double requestedDays;
    private double currentBalance;
    private double remainingBalance;
    private double teamAvailabilityPercentage;
    private long overlappingLeavesCount;
    private boolean valid;
    private String validationMessage;

    public LeavePreviewDto() {}

    public LeavePreviewDto(LeaveType leaveType, double requestedDays, double currentBalance, double remainingBalance, double teamAvailabilityPercentage, long overlappingLeavesCount, boolean valid, String validationMessage) {
        this.leaveType = leaveType;
        this.requestedDays = requestedDays;
        this.currentBalance = currentBalance;
        this.remainingBalance = remainingBalance;
        this.teamAvailabilityPercentage = teamAvailabilityPercentage;
        this.overlappingLeavesCount = overlappingLeavesCount;
        this.valid = valid;
        this.validationMessage = validationMessage;
    }

    public LeaveType getLeaveType() { return leaveType; }
    public void setLeaveType(LeaveType leaveType) { this.leaveType = leaveType; }

    public double getRequestedDays() { return requestedDays; }
    public void setRequestedDays(double requestedDays) { this.requestedDays = requestedDays; }

    public double getCurrentBalance() { return currentBalance; }
    public void setCurrentBalance(double currentBalance) { this.currentBalance = currentBalance; }

    public double getRemainingBalance() { return remainingBalance; }
    public void setRemainingBalance(double remainingBalance) { this.remainingBalance = remainingBalance; }

    public double getTeamAvailabilityPercentage() { return teamAvailabilityPercentage; }
    public void setTeamAvailabilityPercentage(double teamAvailabilityPercentage) { this.teamAvailabilityPercentage = teamAvailabilityPercentage; }

    public long getOverlappingLeavesCount() { return overlappingLeavesCount; }
    public void setOverlappingLeavesCount(long overlappingLeavesCount) { this.overlappingLeavesCount = overlappingLeavesCount; }

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public String getValidationMessage() { return validationMessage; }
    public void setValidationMessage(String validationMessage) { this.validationMessage = validationMessage; }
}
