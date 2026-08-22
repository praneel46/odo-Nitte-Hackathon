import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendance';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AttendancePage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    attendanceService.getMyLogs().then((data) => {
      setLogs(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Attendance Log History</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Track your check-ins, check-outs, and total daily duration</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/app/attendance/calendar')}>
          <CalendarIcon className="w-4 h-4" /> Calendar View
        </Button>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Date</th>
                  <th className="p-4">Check In</th>
                  <th className="p-4">Check Out</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {logs.map((log, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{log.date}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-blue-700 font-medium bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                        <Clock className="w-3.5 h-3.5" /> {log.checkInTime || '--'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {log.checkOutTime || 'In Progress'}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-900">
                      {log.totalWorkMinutes ? `${Math.floor(log.totalWorkMinutes / 60)}h ${log.totalWorkMinutes % 60}m` : '--'}
                    </td>
                    <td className="p-4">
                      <Badge variant={log.status === 'PRESENT' ? 'success' : 'danger'}>
                        {log.status === 'PRESENT' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
