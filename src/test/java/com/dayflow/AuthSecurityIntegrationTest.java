package com.dayflow;

import com.dayflow.dto.LoginRequest;
import com.dayflow.dto.RegisterRequest;
import com.dayflow.enums.Role;
import com.dayflow.enums.UserStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testEmployeeRegistrationAndLoginFlow() throws Exception {
        RegisterRequest reg = new RegisterRequest();
        reg.setEmail("emp.test@dayflow.com");
        reg.setPassword("Password123!");
        reg.setEmployeeId("EMP-TEST-01");
        reg.setRole(Role.EMPLOYEE);
        reg.setFirstName("Emp");
        reg.setLastName("Test");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.role").value("EMPLOYEE"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));

        LoginRequest login = new LoginRequest();
        login.setEmail("emp.test@dayflow.com");
        login.setPassword("Password123!");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.role").value("EMPLOYEE"));
    }

    @Test
    void testAdminPublicRegistrationForbidden() throws Exception {
        RegisterRequest reg = new RegisterRequest();
        reg.setEmail("hacker@dayflow.com");
        reg.setPassword("Password123!");
        reg.setEmployeeId("EMP-HACK");
        reg.setRole(Role.ADMIN);
        reg.setFirstName("Hacker");
        reg.setLastName("User");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testHrRegistrationRequiresApproval() throws Exception {
        RegisterRequest reg = new RegisterRequest();
        reg.setEmail("hr.test@dayflow.com");
        reg.setPassword("Password123!");
        reg.setEmployeeId("EMP-HR-01");
        reg.setRole(Role.HR);
        reg.setFirstName("HR");
        reg.setLastName("Test");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.role").value("HR"))
                .andExpect(jsonPath("$.status").value("PENDING_APPROVAL"));
    }

    @Test
    void testUnauthenticatedAccessFails() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}
