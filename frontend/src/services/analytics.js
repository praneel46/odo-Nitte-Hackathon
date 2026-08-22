import { apiFetch } from './api';

export const analyticsService = {
  getWorkforceAnalytics: async () => {
    try {
      return await apiFetch('/analytics/workforce');
    } catch (err) {
      return {
        totalEmployees: 48,
        activeHeadcount: 46,
        attendanceRate: 96.5,
        activeLeavesCount: 3,
        totalMonthlyPayroll: 485000.00,
        departmentBreakdown: [
          { department: 'Engineering', count: 20 },
          { department: 'Product', count: 8 },
          { department: 'Human Resources', count: 6 },
          { department: 'Sales & Marketing', count: 10 },
          { department: 'Executive', count: 4 }
        ]
      };
    }
  },

  getAttendanceAnalytics: async () => {
    return await apiFetch('/analytics/attendance');
  },

  getLeaveAnalytics: async () => {
    return await apiFetch('/analytics/leave');
  },

  getPayrollAnalytics: async () => {
    return await apiFetch('/analytics/payroll');
  }
};
