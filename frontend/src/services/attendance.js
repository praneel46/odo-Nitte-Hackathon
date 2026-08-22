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
      const data = await apiFetch('/attendance/timeline/today');
      if (!data) return [];

      const events = [];
      const fmtTime = (t) => {
        if (!t) return '';
        if (typeof t === 'string' && t.includes('T')) {
          return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return String(t);
      };

      if (data.checkInTime) {
        events.push({ time: fmtTime(data.checkInTime), type: 'CHECK_IN', label: 'Checked In' });
      }

      if (data.breaks && Array.isArray(data.breaks)) {
        data.breaks.forEach((b) => {
          if (b.startTime) {
            events.push({
              time: fmtTime(b.startTime),
              type: 'BREAK_START',
              label: `${b.breakType || 'Break'} Started`,
            });
          }
          if (b.endTime) {
            events.push({
              time: fmtTime(b.endTime),
              type: 'BREAK_END',
              label: `${b.breakType || 'Break'} Ended`,
            });
          }
        });
      }

      if (data.checkOutTime) {
        events.push({ time: fmtTime(data.checkOutTime), type: 'CHECK_OUT', label: 'Checked Out' });
      }

      return events;
    } catch (err) {
      return [];
    }
  }
};
