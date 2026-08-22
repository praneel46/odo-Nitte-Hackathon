package com.dayflow.dto;

public class LeaveInsightsDto {
    private long totalApprovedLeaves;
    private long pendingRequestsCount;
    private double sickLeavesTaken;
    private double paidLeavesTaken;
    private double unpaidLeavesTaken;
    private double teamAvailabilityPercentage;

    public LeaveInsightsDto() {}

    public LeaveInsightsDto(long totalApprovedLeaves, long pendingRequestsCount, double sickLeavesTaken, double paidLeavesTaken, double unpaidLeavesTaken, double teamAvailabilityPercentage) {
        this.totalApprovedLeaves = totalApprovedLeaves;
        this.pendingRequestsCount = pendingRequestsCount;
        this.sickLeavesTaken = sickLeavesTaken;
        this.paidLeavesTaken = paidLeavesTaken;
        this.unpaidLeavesTaken = unpaidLeavesTaken;
        this.teamAvailabilityPercentage = teamAvailabilityPercentage;
    }

    public long getTotalApprovedLeaves() { return totalApprovedLeaves; }
    public void setTotalApprovedLeaves(long totalApprovedLeaves) { this.totalApprovedLeaves = totalApprovedLeaves; }

    public long getPendingRequestsCount() { return pendingRequestsCount; }
    public void setPendingRequestsCount(long pendingRequestsCount) { this.pendingRequestsCount = pendingRequestsCount; }

    public double getSickLeavesTaken() { return sickLeavesTaken; }
    public void setSickLeavesTaken(double sickLeavesTaken) { this.sickLeavesTaken = sickLeavesTaken; }

    public double getPaidLeavesTaken() { return paidLeavesTaken; }
    public void setPaidLeavesTaken(double paidLeavesTaken) { this.paidLeavesTaken = paidLeavesTaken; }

    public double getUnpaidLeavesTaken() { return unpaidLeavesTaken; }
    public void setUnpaidLeavesTaken(double unpaidLeavesTaken) { this.unpaidLeavesTaken = unpaidLeavesTaken; }

    public double getTeamAvailabilityPercentage() { return teamAvailabilityPercentage; }
    public void setTeamAvailabilityPercentage(double teamAvailabilityPercentage) { this.teamAvailabilityPercentage = teamAvailabilityPercentage; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalApprovedLeaves;
        private long pendingRequestsCount;
        private double sickLeavesTaken;
        private double paidLeavesTaken;
        private double unpaidLeavesTaken;
        private double teamAvailabilityPercentage;

        public Builder totalApprovedLeaves(long totalApprovedLeaves) { this.totalApprovedLeaves = totalApprovedLeaves; return this; }
        public Builder pendingRequestsCount(long pendingRequestsCount) { this.pendingRequestsCount = pendingRequestsCount; return this; }
        public Builder sickLeavesTaken(double sickLeavesTaken) { this.sickLeavesTaken = sickLeavesTaken; return this; }
        public Builder paidLeavesTaken(double paidLeavesTaken) { this.paidLeavesTaken = paidLeavesTaken; return this; }
        public Builder unpaidLeavesTaken(double unpaidLeavesTaken) { this.unpaidLeavesTaken = unpaidLeavesTaken; return this; }
        public Builder teamAvailabilityPercentage(double teamAvailabilityPercentage) { this.teamAvailabilityPercentage = teamAvailabilityPercentage; return this; }

        public LeaveInsightsDto build() {
            return new LeaveInsightsDto(totalApprovedLeaves, pendingRequestsCount, sickLeavesTaken, paidLeavesTaken, unpaidLeavesTaken, teamAvailabilityPercentage);
        }
    }
}
