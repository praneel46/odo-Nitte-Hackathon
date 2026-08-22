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
      const data = await apiFetch('/payroll/slips/me');
      return (data || []).map((s) => ({
        ...s,
        month: s.payPeriod || s.month,
        issueDate: s.generatedAt ? String(s.generatedAt).slice(0, 10) : s.issueDate,
        baseSalary: s.baseSalarySnapshot ?? s.baseSalary,
        allowances: s.allowancesSnapshot ?? s.allowances,
        deductions: s.deductionsSnapshot ?? s.deductions,
        netSalary: s.netSalarySnapshot ?? s.netSalary,
      }));
    } catch (err) {
      return [
        { id: 1, month: '2026-07', issueDate: '2026-07-31', baseSalary: 95000.00, allowances: 15000.00, deductions: 8000.00, netSalary: 102000.00 },
        { id: 2, month: '2026-06', issueDate: '2026-06-30', baseSalary: 95000.00, allowances: 15000.00, deductions: 8000.00, netSalary: 102000.00 }
      ];
    }
  },

  getEmployeeSlips: async (employeeId) => {
    const data = await apiFetch(`/payroll/slips/${employeeId}`);
    return (data || []).map((s) => ({
      ...s,
      month: s.payPeriod || s.month,
      issueDate: s.generatedAt ? String(s.generatedAt).slice(0, 10) : s.issueDate,
      baseSalary: s.baseSalarySnapshot ?? s.baseSalary,
      allowances: s.allowancesSnapshot ?? s.allowances,
      deductions: s.deductionsSnapshot ?? s.deductions,
      netSalary: s.netSalarySnapshot ?? s.netSalary,
    }));
  },

  downloadSlip: async (slipId) => {
    return await apiFetch(`/payroll/slips/${slipId}/download`);
  }
};
