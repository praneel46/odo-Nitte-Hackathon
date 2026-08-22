package com.dayflow.dto;

import java.util.Map;

public class LeaveAnalyticsDto {
    private long totalRequests;
    private long pendingRequests;
    private long approvedRequests;
    private long rejectedRequests;
    private Map<String, Long> requestsByLeaveType;

    public LeaveAnalyticsDto() {}

    public LeaveAnalyticsDto(long totalRequests, long pendingRequests, long approvedRequests, long rejectedRequests, Map<String, Long> requestsByLeaveType) {
        this.totalRequests = totalRequests;
        this.pendingRequests = pendingRequests;
        this.approvedRequests = approvedRequests;
        this.rejectedRequests = rejectedRequests;
        this.requestsByLeaveType = requestsByLeaveType;
    }

    public long getTotalRequests() { return totalRequests; }
    public void setTotalRequests(long totalRequests) { this.totalRequests = totalRequests; }

    public long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; }

    public long getApprovedRequests() { return approvedRequests; }
    public void setApprovedRequests(long approvedRequests) { this.approvedRequests = approvedRequests; }

    public long getRejectedRequests() { return rejectedRequests; }
    public void setRejectedRequests(long rejectedRequests) { this.rejectedRequests = rejectedRequests; }

    public Map<String, Long> getRequestsByLeaveType() { return requestsByLeaveType; }
    public void setRequestsByLeaveType(Map<String, Long> requestsByLeaveType) { this.requestsByLeaveType = requestsByLeaveType; }
}
