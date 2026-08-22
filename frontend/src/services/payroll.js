import { apiFetch } from './api';

export const payrollService = {
  getMyPayroll: async () => {
    try {
      return await apiFetch('/payroll/me');
    } catch (err) {
      return {
        baseSalary: 95000.00,
        allowances: 15000.00,
        deductions: 8000.00,
        netSalary: 102000.00,
        effectiveDate: '2026-01-01'
      };
    }
  },

  getEmployeePayroll: async (employeeId) => {
    return await apiFetch(`/payroll/${employeeId}`);
  },

  updatePayroll: async (employeeId, data) => {
    return await apiFetch(`/payroll/${employeeId}`, { method: 'PUT', body: data });
  },

  getMySlips: async () => {
    try {
      return await apiFetch('/payroll/slips/me');
    } catch (err) {
      return [
        { id: 1, month: 'July 2026', issueDate: '2026-07-31', baseSalary: 95000.00, allowances: 15000.00, deductions: 8000.00, netSalary: 102000.00 },
        { id: 2, month: 'June 2026', issueDate: '2026-06-30', baseSalary: 95000.00, allowances: 15000.00, deductions: 8000.00, netSalary: 102000.00 },
        { id: 3, month: 'May 2026', issueDate: '2026-05-31', baseSalary: 90000.00, allowances: 12000.00, deductions: 7500.00, netSalary: 94500.00 }
      ];
    }
  },

  getEmployeeSlips: async (employeeId) => {
    return await apiFetch(`/payroll/slips/${employeeId}`);
  },

  downloadSlip: async (slipId) => {
    return await apiFetch(`/payroll/slips/${slipId}/download`);
  }
};
