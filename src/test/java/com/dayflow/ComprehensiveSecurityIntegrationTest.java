package com.dayflow;

import com.dayflow.dto.LoginRequest;
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

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ComprehensiveSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String employeeToken;
    private String adminToken;

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

        LoginRequest adminLogin = new LoginRequest();
        adminLogin.setEmail("admin@dayflow.com");
        adminLogin.setPassword("Admin@123");

        MvcResult adminRes = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(adminLogin)))
                .andExpect(status().isOk())
                .andReturn();

        Map<?, ?> adminBody = objectMapper.readValue(adminRes.getResponse().getContentAsString(), Map.class);
        adminToken = "Bearer " + adminBody.get("token");
    }

    @Test
    void testEmployeeAccessingAnotherEmployeeProfileFails() throws Exception {
        mockMvc.perform(get("/api/employees/5")
                .header("Authorization", employeeToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testEmployeeAccessingAnotherEmployeePayrollFails() throws Exception {
        mockMvc.perform(get("/api/payroll/5")
                .header("Authorization", employeeToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testEmployeeAccessingAnotherEmployeeDocumentFails() throws Exception {
        mockMvc.perform(get("/api/documents/5")
                .header("Authorization", employeeToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testEmployeeApprovingLeaveFails() throws Exception {
        mockMvc.perform(put("/api/leaves/1/approve")
                .header("Authorization", employeeToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testEmployeeAccessingAnalyticsFails() throws Exception {
        mockMvc.perform(get("/api/analytics/workforce")
                .header("Authorization", employeeToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testEmployeeAccessingAuditLogsFails() throws Exception {
        mockMvc.perform(get("/api/audit-logs")
                .header("Authorization", employeeToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testAdminAccessingAuditLogsSucceeds() throws Exception {
        mockMvc.perform(get("/api/audit-logs")
                .header("Authorization", adminToken))
                .andExpect(status().isOk());
    }
}
