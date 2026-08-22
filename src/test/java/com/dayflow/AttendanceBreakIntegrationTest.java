package com.dayflow;

import com.dayflow.dto.LoginRequest;
import com.dayflow.dto.RegisterRequest;
import com.dayflow.dto.StartBreakRequest;
import com.dayflow.enums.BreakType;
import com.dayflow.enums.Role;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AttendanceBreakIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String testUserToken;

    @BeforeEach
    void setupTestUserToken() throws Exception {
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        String email = "break.test." + uniqueId + "@dayflow.com";
        String empId = "EMP-BRK-" + uniqueId;

        RegisterRequest reg = new RegisterRequest();
        reg.setEmail(email);
        reg.setPassword("Password123!");
        reg.setEmployeeId(empId);
        reg.setRole(Role.EMPLOYEE);
        reg.setFirstName("Break");
        reg.setLastName("Tester");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated());

        LoginRequest login = new LoginRequest();
        login.setEmail(email);
        login.setPassword("Password123!");

        MvcResult res = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();

        Map<?, ?> body = objectMapper.readValue(res.getResponse().getContentAsString(), Map.class);
        testUserToken = "Bearer " + body.get("token");
    }

    @Test
    void testBreakStartWithoutCheckInFailsWith400() throws Exception {
        // Fresh test employee has not checked in today yet
        mockMvc.perform(post("/api/attendance/break/start")
                .header("Authorization", testUserToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void testCheckInBreakStartEndFlow() throws Exception {
        // 1. Check in
        mockMvc.perform(post("/api/attendance/check-in")
                .header("Authorization", testUserToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PRESENT"));

        // 2. Duplicate check-in fails with 400
        mockMvc.perform(post("/api/attendance/check-in")
                .header("Authorization", testUserToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));

        // 3. Start break (explicit type TEA)
        StartBreakRequest breakReq = new StartBreakRequest();
        breakReq.setBreakType(BreakType.TEA);

        mockMvc.perform(post("/api/attendance/break/start")
                .header("Authorization", testUserToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(breakReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.breakType").value("TEA"));

        // 4. Duplicate break start fails with 409 Conflict
        mockMvc.perform(post("/api/attendance/break/start")
                .header("Authorization", testUserToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));

        // 5. End break succeeds
        mockMvc.perform(post("/api/attendance/break/end")
                .header("Authorization", testUserToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.endTime").exists());
    }

    @Test
    void testBreakStartWithNoBodyOrEmptyBodySucceedsAfterCheckIn() throws Exception {
        mockMvc.perform(post("/api/attendance/check-in")
                .header("Authorization", testUserToken))
                .andExpect(status().isOk());

        // Call break/start without body -> defaults to LUNCH
        mockMvc.perform(post("/api/attendance/break/start")
                .header("Authorization", testUserToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.breakType").value("LUNCH"));
    }
}
