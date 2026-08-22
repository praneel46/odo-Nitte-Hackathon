package com.dayflow.dto;

import com.dayflow.enums.BreakType;
import jakarta.validation.constraints.NotNull;

public class StartBreakRequest {
    @NotNull(message = "Break type is required")
    private BreakType breakType;

    public StartBreakRequest() {}

    public BreakType getBreakType() { return breakType; }
    public void setBreakType(BreakType breakType) { this.breakType = breakType; }
}
