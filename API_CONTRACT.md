# DAYFLOW REST API Contract & Integration Reference

This document serves as the official API contract for **Member 2 (Frontend)** and **Member 3 (Integration & QA)**.

---

## Authentication & Headers

All requests to secured endpoints must include the JWT token in the `Authorization` header:

```http
Authorization: Bearer <JWT_TOKEN>
```

Standard Error Response Format:
```json
{
  "timestamp": "2026-08-22T10:20:00.000Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired JWT token",
  "path": "/api/employees/me"
}
```

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
**Request Body**:
```json
{
  "email": "john.doe@company.com",
  "password": "Password123!",
  "employeeId": "EMP-001",
  "role": "EMPLOYEE", // "EMPLOYEE" or "HR" (ADMIN public registration is forbidden)
  "firstName": "John",
  "lastName": "Doe"
}
```
**Response (201 Created)**:
```json
{
  "message": "User registered successfully. Email verification required.",
  "userId": 1,
  "employeeId": "EMP-001",
  "email": "john.doe@company.com",
  "status": "ACTIVE", // or "PENDING_APPROVAL" for HR
  "devVerificationToken": "abc123token" // Dev-only helper
}
```

### `POST /api/auth/login`
**Request Body**:
```json
{
  "email": "john.doe@company.com",
  "password": "Password123!"
}
```
**Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "email": "john.doe@company.com",
  "employeeId": "EMP-001",
  "role": "EMPLOYEE",
  "status": "ACTIVE",
  "firstName": "John",
  "lastName": "Doe"
}
```

### `GET /api/auth/me`
**Headers**: `Authorization: Bearer <TOKEN>`
**Response (200 OK)**: Returns authenticated user profile context.

### `GET /api/auth/verify-email?token=<TOKEN>`
**Response (200 OK)**: `{ "message": "Email verified successfully", "status": "ACTIVE" }`

---

## 2. Employees (`/api/employees`)

### `GET /api/employees` (HR / ADMIN)
Returns list of all employee profiles.

### `GET /api/employees/{id}` (Self / HR / ADMIN)
Returns employee profile details, job title, department, phone, address.

### `PUT /api/employees/{id}` (Self for phone/address/pic; ADMIN for full edit)
**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St, Tech Park",
  "jobTitle": "Senior Software Engineer",
  "departmentId": 2,
  "profilePictureUrl": "https://example.com/avatar.png"
}
```

### `PUT /api/employees/{id}/role` (ADMIN only)
`{ "role": "HR" }`

### `PUT /api/employees/{id}/status` (HR / ADMIN)
`{ "status": "ACTIVE" }`

---

## 3. Attendance (`/api/attendance`)

### `GET /api/attendance/me`
Returns current employee's daily/monthly attendance history.

### `GET /api/attendance/today`
Returns today's check-in/out status, total work minutes, active break.

### `GET /api/attendance` (HR / ADMIN)
Filterable by `date` or `employeeId`.

### `POST /api/attendance/check-in`
**Response**: Records `checkInTime`, sets status to `PRESENT`.

### `POST /api/attendance/check-out`
**Response**: Records `checkOutTime`, calculates `totalWorkMinutes`. Fails if active break exists.

### `POST /api/attendance/break/start`
`{ "breakType": "LUNCH" }` (LUNCH, TEA, PERSONAL)

### `POST /api/attendance/break/end`
Ends currently active break and accumulates break duration.

### `GET /api/attendance/timeline/today`
Returns timestamps for check-in, breaks, check-out for today's timeline.

---

## 4. Leave & Time-Off (`/api/leaves`)

### `GET /api/leaves/me`
Returns current employee's leave requests.

### `GET /api/leaves/balance/me`
Returns leave balances for PAID, SICK, UNPAID types.

### `POST /api/leaves`
**Request Body**:
```json
{
  "leaveType": "PAID",
  "startDate": "2026-09-01",
  "endDate": "2026-09-05",
  "reason": "Family vacation"
}
```
*Backend automatically calculates `requestedDays` excluding weekends and checks balance/overlap.*

### `GET /api/leaves` (HR / ADMIN)
View all pending/approved/rejected leave requests across the company.

### `GET /api/leaves/insights` (HR / ADMIN)
Returns overall leave statistics and team availability metrics.

### `PUT /api/leaves/{id}/approve` (HR / ADMIN)
`{ "adminComment": "Approved. Enjoy your vacation." }`

### `PUT /api/leaves/{id}/reject` (HR / ADMIN)
`{ "adminComment": "Project deadline conflict." }`

---

## 5. Payroll & Salary Slips (`/api/payroll`)

### `GET /api/payroll/me` (EMPLOYEE)
Returns read-only base salary, allowances, deductions, and net salary structure for authenticated employee.

### `GET /api/payroll/{employeeId}` (HR / ADMIN)
Returns target employee's current payroll configuration.

### `PUT /api/payroll/{employeeId}` (ADMIN only)
`{ "baseSalary": 75000.00, "allowances": 15000.00, "deductions": 5000.00, "effectiveDate": "2026-08-01" }`
*Automatically updates `netSalary = baseSalary + allowances - deductions` and audits salary change.*

### `GET /api/payroll/slips/me`
Returns list of historical generated salary slip snapshots for authenticated employee.

### `GET /api/payroll/slips/{employeeId}` (HR / ADMIN)
Returns salary slip history for target employee.

### `GET /api/payroll/slips/{id}/download`
Downloads / retrieves PDF metadata for an immutable historical salary slip.

---

## 6. Documents (`/api/documents`)

### `GET /api/documents/me`
Returns metadata of documents uploaded by authenticated employee.

### `GET /api/documents/{employeeId}` (HR / ADMIN)
Returns documents uploaded for employee.

### `POST /api/documents` (Multipart Form Data)
`file`: File binary
`documentType`: `ID_PROOF` | `TAX_FORM` | `CERTIFICATE` | `CONTRACT` | `OTHER`
`documentName`: "Passport Copy"

### `GET /api/documents/{id}/download`
Returns file binary with `Content-Disposition: attachment`.

### `DELETE /api/documents/{id}` (Self / HR / ADMIN)
Deletes document record and backing storage file.

---

## 7. Notifications (`/api/notifications`)

### `GET /api/notifications/me`
Returns notification alerts for authenticated user.

### `PUT /api/notifications/{id}/read`
Marks single notification as read.

### `PUT /api/notifications/read-all`
Marks all user notifications as read.

---

## 8. Analytics (`/api/analytics`) (HR / ADMIN)

- `GET /api/analytics/workforce`: Department counts, headcount by role/status.
- `GET /api/analytics/attendance`: Monthly attendance rate %, present vs absent counts.
- `GET /api/analytics/leave`: Active leaves, pending requests count, distribution by leave type.
- `GET /api/analytics/payroll`: Total monthly payroll expenditure, average net salary.

---

## 9. Audit Logs (`/api/audit-logs`) (ADMIN only)

- `GET /api/audit-logs`: Returns chronological append-only list of system governance audit events.
