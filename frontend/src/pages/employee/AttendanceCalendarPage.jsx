import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendance';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AttendanceCalendarPage = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    attendanceService.getMyLogs().then((data) => setLogs(data || []));
  }, []);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Attendance Calendar Matrix</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Monthly breakdown of working sessions & attendance marks</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/app/attendance')}>
          <ArrowLeft className="w-4 h-4" /> Table View
        </Button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-700 mb-4">August 2026</h3>
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 mb-2">
          <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day) => {
            const dateStr = `2026-08-${String(day).padStart(2, '0')}`;
            const log = logs.find((l) => l.date === dateStr);
            const isWeekend = day % 7 === 0 || day % 7 === 6;

            return (
              <div
                key={day}
                className={`p-3 rounded-lg border flex flex-col justify-between h-20 text-left transition-all ${
                  log
                    ? 'border-green-200 bg-green-50/50'
                    : isWeekend
                    ? 'border-slate-100 bg-slate-50 text-slate-400'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <span className="font-bold text-xs">{day}</span>
                {log && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-green-700">
                    <CheckCircle2 className="w-3 h-3" /> Present
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
