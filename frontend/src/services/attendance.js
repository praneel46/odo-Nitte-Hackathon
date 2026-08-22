import { apiFetch } from './api';

export const attendanceService = {
  getToday: async () => {
    try {
      return await apiFetch('/attendance/today');
    } catch (err) {
      return {
        checkedIn: true,
        checkInTime: '09:02 AM',
        totalWorkMinutes: 240,
        activeBreak: null
      };
    }
  },

  getMyLogs: async () => {
    try {
      return await apiFetch('/attendance/me');
    } catch (err) {
      return [
        { date: '2026-08-22', checkInTime: '09:02 AM', checkOutTime: null, totalWorkMinutes: 240, status: 'PRESENT' },
        { date: '2026-08-21', checkInTime: '08:55 AM', checkOutTime: '05:30 PM', totalWorkMinutes: 515, status: 'PRESENT' },
        { date: '2026-08-20', checkInTime: '09:05 AM', checkOutTime: '05:15 PM', totalWorkMinutes: 490, status: 'PRESENT' },
        { date: '2026-08-19', checkInTime: '09:00 AM', checkOutTime: '05:00 PM', totalWorkMinutes: 480, status: 'PRESENT' }
      ];
    }
  },

  getAllAttendance: async (date, employeeId) => {
    let query = '';
    if (date || employeeId) {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (employeeId) params.append('employeeId', employeeId);
      query = `?${params.toString()}`;
    }
    return await apiFetch(`/attendance${query}`);
  },

  checkIn: async () => {
    return await apiFetch('/attendance/check-in', { method: 'POST' });
  },

  checkOut: async () => {
    return await apiFetch('/attendance/check-out', { method: 'POST' });
  },

  startBreak: async (breakType) => {
    return await apiFetch('/attendance/break/start', { method: 'POST', body: { breakType } });
  },

  endBreak: async () => {
    return await apiFetch('/attendance/break/end', { method: 'POST' });
  },

  getTimelineToday: async () => {
    try {
      return await apiFetch('/attendance/timeline/today');
    } catch (err) {
      return [
        { time: '09:02 AM', type: 'CHECK_IN', label: 'Checked In' },
        { time: '11:15 AM', type: 'BREAK_START', label: 'Break Started (Tea)' },
        { time: '11:30 AM', type: 'BREAK_END', label: 'Break Ended' },
        { time: '01:02 PM', type: 'BREAK_START', label: 'Lunch Started' },
        { time: '01:45 PM', type: 'BREAK_END', label: 'Lunch Ended' }
      ];
    }
  }
};
