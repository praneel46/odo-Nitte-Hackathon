import React, { useState, useEffect } from 'react';
import { Play, Square, Coffee, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const WorkdayTrackerCard = ({ attendance, onCheckIn, onCheckOut, onStartBreak, onEndBreak, isLoading }) => {
  const [elapsedMinutes, setElapsedMinutes] = useState(attendance?.totalWorkMinutes || 0);

  useEffect(() => {
    setElapsedMinutes(attendance?.totalWorkMinutes || 0);
  }, [attendance?.totalWorkMinutes]);

  useEffect(() => {
    let interval;
    if (attendance?.checkedIn && !attendance?.activeBreak) {
      interval = setInterval(() => {
        setElapsedMinutes((prev) => prev + 1);
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [attendance?.checkedIn, attendance?.activeBreak]);

  const formatHours = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const isCheckedIn = attendance?.checkedIn;
  const activeBreak = attendance?.activeBreak;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Workday Tracker</h3>
          <Badge variant={isCheckedIn ? (activeBreak ? 'warning' : 'success') : 'danger'}>
            {isCheckedIn ? (activeBreak ? 'ON BREAK' : 'CHECKED IN') : 'NOT CHECKED IN'}
          </Badge>
        </div>

        <div className="text-center my-4 py-4 bg-slate-50 rounded-lg border border-slate-100">
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {formatHours(elapsedMinutes)}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            {isCheckedIn ? `Checked in at ${attendance?.checkInTime || '09:00 AM'}` : 'Start your workstation session'}
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        {!isCheckedIn ? (
          <Button variant="primary" className="w-full" onClick={onCheckIn} isLoading={isLoading}>
            <Play className="w-4 h-4 fill-current" /> Check In Now
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {!activeBreak ? (
              <Button variant="warning" size="sm" onClick={() => onStartBreak('LUNCH')} isLoading={isLoading}>
                <Coffee className="w-4 h-4" /> Take Break
              </Button>
            ) : (
              <Button variant="success" size="sm" onClick={onEndBreak} isLoading={isLoading}>
                <CheckCircle2 className="w-4 h-4" /> End Break
              </Button>
            )}

            <Button variant="danger" size="sm" onClick={onCheckOut} isLoading={isLoading}>
              <Square className="w-4 h-4 fill-current" /> Check Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
