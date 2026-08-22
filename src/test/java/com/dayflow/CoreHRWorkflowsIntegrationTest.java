package com.dayflow;

import com.dayflow.dto.CreateLeaveRequest;
import com.dayflow.dto.LoginRequest;
import com.dayflow.enums.LeaveType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CoreHRWorkflowsIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String employeeToken;
    private String hrToken;

    @BeforeEach
    void setupTokens() throws Exception {
        LoginRequest empLogin = new LoginRequest();
        empLogin.setEmail("employee1@dayflow.com");
        empLogin.setPassword("Emp@12345");

        MvcResult empRes = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(empLogin)))
                .andExpect(status().isOk())
                .andReturn();

        Map<?, ?> empBody = objectMapper.readValue(empRes.getResponse().getContentAsString(), Map.class);
        employeeToken = "Bearer " + empBody.get("token");

        LoginRequest hrLogin = new LoginRequest();
        hrLogin.setEmail("hr1@dayflow.com");
        hrLogin.setPassword("Hr@12345");

        MvcResult hrRes = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(hrLogin)))
                .andExpect(status().isOk())
                .andReturn();

        Map<?, ?> hrBody = objectMapper.readValue(hrRes.getResponse().getContentAsString(), Map.class);
        hrToken = "Bearer " + hrBody.get("token");
    }

    @Test
    void testSmartLeavePreviewEndpoint() throws Exception {
        LocalDate start = LocalDate.now().plusDays(10);
        LocalDate end = start.plusDays(4);

        mockMvc.perform(get("/api/leaves/preview")
                .param("leaveType", "PAID")
                .param("startDate", start.toString())
                .param("endDate", end.toString())
                .header("Authorization", employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").exists())
                .andExpect(jsonPath("$.requestedDays").exists());
    }

    @Test
    void testAttendanceFullLifecycle() throws Exception {
        // 1. Check in
        mockMvc.perform(post("/api/attendance/check-in")
                .header("Authorization", employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PRESENT"));

        // 2. Start break
        mockMvc.perform(post("/api/attendance/break/start")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"breakType\": \"LUNCH\"}")
                .header("Authorization", employeeToken))
                .andExpect(status().isOk());

        // 3. End break
        mockMvc.perform(post("/api/attendance/break/end")
                .header("Authorization", employeeToken))
                .andExpect(status().isOk());

        // 4. Check out
        mockMvc.perform(post("/api/attendance/check-out")
                .header("Authorization", employeeToken))
                .andExpect(status().isOk());

        // 5. Verify timeline
        mockMvc.perform(get("/api/attendance/timeline/today")
                .header("Authorization", employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.checkInTime").exists())
                .andExpect(jsonPath("$.checkOutTime").exists());
    }

    @Test
    void testLeaveApplyAndHrApprovalWithNotification() throws Exception {
        LocalDate start = LocalDate.now().plusDays(15);
        LocalDate end = start.plusDays(2);

        CreateLeaveRequest request = new CreateLeaveRequest();
        request.setLeaveType(LeaveType.SICK);
        request.setStartDate(start);
        request.setEndDate(end);
        request.setReason("Medical checkup and rest");

        MvcResult applyRes = mockMvc.perform(post("/api/leaves")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .header("Authorization", employeeToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andReturn();

        Map<?, ?> leaveBody = objectMapper.readValue(applyRes.getResponse().getContentAsString(), Map.class);
        Number leaveId = (Number) leaveBody.get("id");

        // HR approves leave
        mockMvc.perform(put("/api/leaves/" + leaveId + "/approve")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"adminComment\": \"Approved by HR\"}")
                .header("Authorization", hrToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));

        // Verify employee receives notification
        mockMvc.perform(get("/api/notifications/me")
                .header("Authorization", employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Leave Request Approved"));
    }
}
