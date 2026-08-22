package com.dayflow.dto;

public class AttendanceAnalyticsDto {
    private long presentToday;
    private long absentToday;
    private long onLeaveToday;
    private double attendanceRatePercentage;

    public AttendanceAnalyticsDto() {}

    public AttendanceAnalyticsDto(long presentToday, long absentToday, long onLeaveToday, double attendanceRatePercentage) {
        this.presentToday = presentToday;
        this.absentToday = absentToday;
        this.onLeaveToday = onLeaveToday;
        this.attendanceRatePercentage = attendanceRatePercentage;
    }

    public long getPresentToday() { return presentToday; }
    public void setPresentToday(long presentToday) { this.presentToday = presentToday; }

    public long getAbsentToday() { return absentToday; }
    public void setAbsentToday(long absentToday) { this.absentToday = absentToday; }

    public long getOnLeaveToday() { return onLeaveToday; }
    public void setOnLeaveToday(long onLeaveToday) { this.onLeaveToday = onLeaveToday; }

    public double getAttendanceRatePercentage() { return attendanceRatePercentage; }
    public void setAttendanceRatePercentage(double attendanceRatePercentage) { this.attendanceRatePercentage = attendanceRatePercentage; }
}
