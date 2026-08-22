import { apiFetch } from './api';

export const leaveService = {
  getMyLeaves: async () => {
    try {
      return await apiFetch('/leaves/me');
    } catch (err) {
      return [
        { id: 101, employeeName: 'Alex Morgan', leaveType: 'PAID', startDate: '2026-09-01', endDate: '2026-09-05', requestedDays: 5, reason: 'Annual vacation', status: 'APPROVED', adminComment: 'Approved! Have a great trip.' },
        { id: 102, employeeName: 'Sarah Jenkins', leaveType: 'SICK', startDate: '2026-08-24', endDate: '2026-08-25', requestedDays: 2, reason: 'Medical appointment', status: 'PENDING', adminComment: null },
        { id: 103, employeeName: 'Michael Chen', leaveType: 'UNPAID', startDate: '2026-08-10', endDate: '2026-08-12', requestedDays: 3, reason: 'Personal errands', status: 'REJECTED', adminComment: 'Project deadline conflict.' }
      ];
    }
  },

  getMyBalances: async () => {
    try {
      return await apiFetch('/leaves/balance/me');
    } catch (err) {
      return [
        { leaveType: 'PAID', totalDays: 20, usedDays: 4, remainingDays: 16 },
        { leaveType: 'SICK', totalDays: 10, usedDays: 2, remainingDays: 8 },
        { leaveType: 'UNPAID', totalDays: 15, usedDays: 0, remainingDays: 15 }
      ];
    }
  },

  getAllLeaves: async () => {
    try {
      return await apiFetch('/leaves');
    } catch (err) {
      return [
        { id: 101, employeeName: 'Alex Morgan', leaveType: 'PAID', startDate: '2026-09-01', endDate: '2026-09-05', requestedDays: 5, reason: 'Annual vacation', status: 'APPROVED', adminComment: 'Approved!' },
        { id: 102, employeeName: 'Sarah Jenkins', leaveType: 'SICK', startDate: '2026-08-24', endDate: '2026-08-25', requestedDays: 2, reason: 'Medical appointment', status: 'PENDING', adminComment: null }
      ];
    }
  },

  applyLeave: async (leaveData) => {
    return await apiFetch('/leaves', { method: 'POST', body: leaveData });
  },

  approveLeave: async (id, adminComment) => {
    return await apiFetch(`/leaves/${id}/approve`, { method: 'PUT', body: { adminComment } });
  },

  rejectLeave: async (id, adminComment) => {
    return await apiFetch(`/leaves/${id}/reject`, { method: 'PUT', body: { adminComment } });
  },

  getInsights: async () => {
    return await apiFetch('/leaves/insights');
  }
};
