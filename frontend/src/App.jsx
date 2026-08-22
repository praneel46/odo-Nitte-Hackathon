import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { AppShell } from './components/layout/AppShell';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/employee/DashboardPage';
import { AttendancePage } from './pages/employee/AttendancePage';
import { AttendanceCalendarPage } from './pages/employee/AttendanceCalendarPage';
import { LeavePage } from './pages/employee/LeavePage';
import { LeaveApplyPage } from './pages/employee/LeaveApplyPage';
import { LeaveDetailPage } from './pages/employee/LeaveDetailPage';
import { PayrollPage } from './pages/employee/PayrollPage';
import { SalarySlipDetailPage } from './pages/employee/SalarySlipDetailPage';
import { DocumentsPage } from './pages/employee/DocumentsPage';
import { ProfilePage } from './pages/employee/ProfilePage';
import { SettingsPage } from './pages/employee/SettingsPage';
import { NotificationsPage } from './pages/employee/NotificationsPage';

// HR Pages
import { EmployeeListPage } from './pages/hr/EmployeeListPage';
import { EmployeeDetailPage } from './pages/hr/EmployeeDetailPage';
import { AnalyticsPage } from './pages/hr/AnalyticsPage';

// Admin Pages
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { SystemSettingsPage } from './pages/admin/SystemSettingsPage';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected App Routes */}
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="attendance/calendar" element={<AttendanceCalendarPage />} />
              <Route path="leave" element={<LeavePage />} />
              <Route path="leave/apply" element={<LeaveApplyPage />} />
              <Route path="leave/:id" element={<LeaveDetailPage />} />
              <Route path="payroll" element={<PayrollPage />} />
              <Route path="payroll/slips/:id" element={<SalarySlipDetailPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />

              {/* HR / Admin Routes */}
              <Route path="employees" element={<EmployeeListPage />} />
              <Route path="employees/:id" element={<EmployeeDetailPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />

              {/* Admin Routes */}
              <Route path="audit-logs" element={<AuditLogsPage />} />
              <Route path="settings/system" element={<SystemSettingsPage />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
