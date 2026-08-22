import { apiFetch } from './api';

export const notificationsService = {
  getMyNotifications: async () => {
    try {
      return await apiFetch('/notifications/me');
    } catch (err) {
      return [
        { id: 1, title: 'Leave Approved', message: 'Your leave request for Sept 1-5 has been approved.', isRead: false, createdAt: '10 mins ago' },
        { id: 2, title: 'Salary Slip Ready', message: 'Your salary slip for July 2026 is now available.', isRead: false, createdAt: '2 hours ago' },
        { id: 3, title: 'System Security Update', message: 'JWT Security patch successfully applied.', isRead: true, createdAt: '1 day ago' }
      ];
    }
  },

  markAsRead: async (id) => {
    return await apiFetch(`/notifications/${id}/read`, { method: 'PUT' });
  },

  markAllAsRead: async () => {
    return await apiFetch('/notifications/read-all', { method: 'PUT' });
  }
};
