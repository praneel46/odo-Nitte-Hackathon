import { apiFetch } from './api';

export const auditLogsService = {
  getLogs: async () => {
    try {
      return await apiFetch('/audit-logs');
    } catch (err) {
      return [
        { id: 1, action: 'USER_LOGIN', userEmail: 'alex.morgan@dayflow.com', ipAddress: '192.168.1.45', timestamp: '2026-08-22 10:55:12' },
        { id: 2, action: 'LEAVE_APPROVED', userEmail: 'alex.morgan@dayflow.com', ipAddress: '192.168.1.45', timestamp: '2026-08-22 10:30:00' },
        { id: 3, action: 'ATTENDANCE_CHECKIN', userEmail: 'sarah.j@dayflow.com', ipAddress: '192.168.1.88', timestamp: '2026-08-22 09:00:05' }
      ];
    }
  }
};
