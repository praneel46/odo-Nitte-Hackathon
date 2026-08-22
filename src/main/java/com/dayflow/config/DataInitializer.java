package com.dayflow.config;

import com.dayflow.entity.*;
import com.dayflow.enums.*;
import com.dayflow.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final WorkBreakRepository workBreakRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final PayrollRepository payrollRepository;
    private final SalarySlipRepository salarySlipRepository;
    private final NotificationRepository notificationRepository;
    private final DocumentRepository documentRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, EmployeeProfileRepository employeeProfileRepository, DepartmentRepository departmentRepository, AttendanceRepository attendanceRepository, WorkBreakRepository workBreakRepository, LeaveRequestRepository leaveRequestRepository, LeaveBalanceRepository leaveBalanceRepository, PayrollRepository payrollRepository, SalarySlipRepository salarySlipRepository, NotificationRepository notificationRepository, DocumentRepository documentRepository, AuditLogRepository auditLogRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.departmentRepository = departmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.workBreakRepository = workBreakRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.payrollRepository = payrollRepository;
        this.salarySlipRepository = salarySlipRepository;
        this.notificationRepository = notificationRepository;
        this.documentRepository = documentRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        System.out.println("====== SEEDING DAYFLOW DEVELOPMENT DATA ======");

        Department eng = departmentRepository.save(Department.builder().name("Engineering").code("ENG").description("Software Development").build());
        Department hrDept = departmentRepository.save(Department.builder().name("Human Resources").code("HR").description("HR & People Ops").build());
        Department fin = departmentRepository.save(Department.builder().name("Finance").code("FIN").description("Finance & Payroll").build());
        Department prod = departmentRepository.save(Department.builder().name("Product Management").code("PROD").description("Product Strategy").build());

        User admin = createUser("admin@dayflow.com", "Admin@123", "EMP-000", Role.ADMIN, UserStatus.ACTIVE, true);
        createProfile(admin, "System", "Administrator", "+1000000000", "HQ Office", "Chief Administrator", eng);

        User hr1 = createUser("hr1@dayflow.com", "Hr@12345", "EMP-001", Role.HR, UserStatus.ACTIVE, true);
        createProfile(hr1, "Sarah", "Connor", "+1000000001", "12 HR Blvd", "Senior HR Manager", hrDept);
        hrDept.setManager(hr1);
        departmentRepository.save(hrDept);

        User hr2 = createUser("hr2@dayflow.com", "Hr@12345", "EMP-002", Role.HR, UserStatus.ACTIVE, true);
        createProfile(hr2, "Michael", "Scott", "+1000000002", "15 HR Blvd", "HR Specialist", hrDept);

        String[][] empData = {
            {"employee1@dayflow.com", "EMP-003", "Alice", "Smith", "Software Engineer", "ENG"},
            {"employee2@dayflow.com", "EMP-004", "Bob", "Johnson", "Frontend Developer", "ENG"},
            {"employee3@dayflow.com", "EMP-005", "Charlie", "Brown", "Backend Developer", "ENG"},
            {"employee4@dayflow.com", "EMP-006", "David", "Miller", "QA Engineer", "ENG"},
            {"employee5@dayflow.com", "EMP-007", "Emma", "Davis", "Product Manager", "PROD"},
            {"employee6@dayflow.com", "EMP-008", "Frank", "Wilson", "Financial Analyst", "FIN"},
            {"employee7@dayflow.com", "EMP-009", "Grace", "Taylor", "UI/UX Designer", "PROD"},
            {"employee8@dayflow.com", "EMP-010", "Henry", "Anderson", "DevOps Engineer", "ENG"},
            {"employee9@dayflow.com", "EMP-011", "Ivy", "Thomas", "HR Assistant", "HR"},
            {"employee10@dayflow.com", "EMP-012", "Jack", "White", "Accountant", "FIN"}
        };

        for (String[] data : empData) {
            User emp = createUser(data[0], "Emp@12345", data[1], Role.EMPLOYEE, UserStatus.ACTIVE, true);
            Department d = switch (data[5]) {
                case "HR" -> hrDept;
                case "FIN" -> fin;
                case "PROD" -> prod;
                default -> eng;
            };
            createProfile(emp, data[2], data[3], "+1999888777", "City Center", data[4], d);

            seedBalances(emp);
            seedPayroll(emp);
            seedAttendanceHistory(emp);
        }

        User emp1 = userRepository.findByEmail("employee1@dayflow.com").orElseThrow();
        createLeaveRequest(emp1, LeaveType.PAID, LocalDate.now().plusDays(5), LocalDate.now().plusDays(7), "Family Event", LeaveStatus.PENDING, null, null);
        createLeaveRequest(emp1, LeaveType.SICK, LocalDate.now().minusDays(10), LocalDate.now().minusDays(9), "Fever", LeaveStatus.APPROVED, "Approved by HR", hr1);

        documentRepository.save(Document.builder()
                .employee(emp1)
                .documentName("Identity_Proof_Passport.pdf")
                .documentType(DocumentType.ID_PROOF)
                .filePath("./uploads/documents/sample_passport.pdf")
                .fileSize(1024500L)
                .mimeType("application/pdf")
                .build());

        notificationRepository.save(Notification.builder()
                .user(emp1)
                .title("Welcome to Dayflow")
                .message("Your Dayflow account has been successfully created.")
                .type(NotificationType.SUCCESS)
                .build());

        auditLogRepository.save(AuditLog.builder()
                .user(admin)
                .action("SYSTEM_INIT")
                .entityName("System")
                .entityId(1L)
                .details("System initialized with seed data")
                .ipAddress("127.0.0.1")
                .timestamp(LocalDateTime.now())
                .build());

        System.out.println("====== DAYFLOW DEMO CREDENTIALS ======");
        System.out.println("ADMIN: admin@dayflow.com / Admin@123");
        System.out.println("HR 1:  hr1@dayflow.com / Hr@12345");
        System.out.println("HR 2:  hr2@dayflow.com / Hr@12345");
        System.out.println("EMP:   employee1@dayflow.com through employee10@dayflow.com / Emp@12345");
        System.out.println("=======================================");
    }

    private User createUser(String email, String password, String empId, Role role, UserStatus status, boolean verified) {
        User u = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .employeeId(empId)
                .role(role)
                .status(status)
                .emailVerified(verified)
                .build();
        return userRepository.save(u);
    }

    private void createProfile(User user, String fn, String ln, String phone, String addr, String title, Department dept) {
        EmployeeProfile p = EmployeeProfile.builder()
                .user(user)
                .firstName(fn)
                .lastName(ln)
                .phone(phone)
                .address(addr)
                .jobTitle(title)
                .department(dept)
                .dateOfJoining(LocalDate.now().minusMonths(6))
                .build();
        employeeProfileRepository.save(p);
    }

    private void seedBalances(User user) {
        int year = LocalDate.now().getYear();
        leaveBalanceRepository.save(LeaveBalance.builder().employee(user).year(year).leaveType(LeaveType.PAID).totalEntitled(15.0).used(2.0).pending(0.0).build());
        leaveBalanceRepository.save(LeaveBalance.builder().employee(user).year(year).leaveType(LeaveType.SICK).totalEntitled(10.0).used(1.0).pending(0.0).build());
        leaveBalanceRepository.save(LeaveBalance.builder().employee(user).year(year).leaveType(LeaveType.UNPAID).totalEntitled(30.0).used(0.0).pending(0.0).build());
    }

    private void seedPayroll(User user) {
        BigDecimal base = new BigDecimal("65000.00");
        BigDecimal allowances = new BigDecimal("12000.00");
        BigDecimal deductions = new BigDecimal("4500.00");
        BigDecimal net = base.add(allowances).subtract(deductions);

        payrollRepository.save(Payroll.builder()
                .employee(user)
                .baseSalary(base)
                .allowances(allowances)
                .deductions(deductions)
                .netSalary(net)
                .effectiveDate(LocalDate.now().minusMonths(3))
                .build());

        salarySlipRepository.save(SalarySlip.builder()
                .employee(user)
                .payPeriod(String.format("%d-%02d", LocalDate.now().getYear(), LocalDate.now().minusMonths(1).getMonthValue()))
                .baseSalarySnapshot(base)
                .allowancesSnapshot(allowances)
                .deductionsSnapshot(deductions)
                .netSalarySnapshot(net)
                .pdfUrl("/api/payroll/slips/" + user.getId() + "/download")
                .build());
    }

    private void seedAttendanceHistory(User user) {
        for (int i = 1; i <= 5; i++) {
            LocalDate date = LocalDate.now().minusDays(i);
            Attendance a = Attendance.builder()
                    .employee(user)
                    .date(date)
                    .status(AttendanceStatus.PRESENT)
                    .checkInTime(date.atTime(9, 0))
                    .checkOutTime(date.atTime(17, 30))
                    .totalWorkMinutes(480L)
                    .build();
            attendanceRepository.save(a);
        }
    }

    private void createLeaveRequest(User user, LeaveType type, LocalDate start, LocalDate end, String reason, LeaveStatus status, String comment, User approvedBy) {
        leaveRequestRepository.save(LeaveRequest.builder()
                .employee(user)
                .leaveType(type)
                .startDate(start)
                .endDate(end)
                .requestedDays(3.0)
                .reason(reason)
                .status(status)
                .adminComment(comment)
                .approvedBy(approvedBy)
                .build());
    }
}
