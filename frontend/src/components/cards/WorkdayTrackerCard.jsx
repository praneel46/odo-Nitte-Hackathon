import React, { useState, useEffect } from 'react';
import { Play, Square, Coffee, CheckCircle2, Laptop, Home, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export const WorkdayTrackerCard = ({ attendance, onCheckIn, onCheckOut, onStartBreak, onEndBreak, isLoading }) => {
  const isCheckedIn = (!!attendance?.checkInTime && !attendance?.checkOutTime) || !!attendance?.checkedIn;
  const activeBreak = attendance?.activeBreak;
  const isCheckedOut = !!attendance?.checkOutTime;

  const [elapsedMinutes, setElapsedMinutes] = useState(attendance?.totalWorkMinutes || 0);

  useEffect(() => {
    setElapsedMinutes(attendance?.totalWorkMinutes || 0);
  }, [attendance?.totalWorkMinutes]);

  useEffect(() => {
    let interval;
    if (isCheckedIn && !activeBreak) {
      interval = setInterval(() => {
        setElapsedMinutes((prev) => prev + 1);
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, activeBreak]);

  const formatHours = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const formatTimeStr = (rawTime) => {
    if (!rawTime) return '--:--';
    if (typeof rawTime === 'string' && rawTime.includes('T')) {
      const dateObj = new Date(rawTime);
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return rawTime;
  };

  // Progress percentage calculation (target 8 hours = 480 mins)
  const targetMins = 480;
  const progressPercent = Math.min(100, Math.round((elapsedMinutes / targetMins) * 100));

  const checkInTime = formatTimeStr(attendance?.checkInTime);
  const checkOutTime = formatTimeStr(attendance?.checkOutTime);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Workday Tracker</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
            isCheckedIn && !activeBreak ? 'bg-green-100 text-green-700' :
            activeBreak ? 'bg-amber-100 text-amber-700' :
            isCheckedOut ? 'bg-slate-100 text-slate-600' :
            'bg-blue-100 text-blue-700'
          }`}>
            {isCheckedIn ? (activeBreak ? 'ON BREAK' : 'LIVE') : isCheckedOut ? 'COMPLETED' : 'READY'}
          </span>
        </div>
        <span className="text-xs font-semibold text-blue-600">
          Today's Progress • <span className="font-bold">{progressPercent}%</span>
        </span>
      </div>

      {/* Progress Timeline Tracker */}
      <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 relative">
        {/* Horizontal Connector Line */}
        <div className="absolute top-8 left-12 right-12 h-1 bg-slate-200 z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: isCheckedOut ? '100%' : isCheckedIn ? (activeBreak ? '50%' : '25%') : '0%' }}
          />
        </div>

        {/* 5 Timeline Nodes */}
        <div className="grid grid-cols-5 gap-2 relative z-10 text-center">
          {/* Node 1: Check In */}
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              isCheckedIn || isCheckedOut ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-200 text-slate-500'
            }`}>
              {isCheckedIn || isCheckedOut ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
            </div>
            <span className="text-xs font-bold text-slate-800">Check In</span>
            <span className="text-[10px] text-slate-500 font-medium">{checkInTime}</span>
          </div>

          {/* Node 2: Working */}
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              isCheckedIn && !activeBreak ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-200 text-slate-500'
            }`}>
              <Laptop className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800">Working</span>
            <span className="text-[10px] text-blue-600 font-bold">{isCheckedIn && !activeBreak ? 'Now' : '--:--'}</span>
          </div>

          {/* Node 3: Break */}
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              activeBreak ? 'bg-amber-500 text-white ring-4 ring-amber-100' : 'bg-slate-200 text-slate-500'
            }`}>
              <Coffee className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800">Break</span>
            <span className="text-[10px] text-slate-500 font-medium">{activeBreak ? 'Active' : '--:--'}</span>
          </div>

          {/* Node 4: Working */}
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              isCheckedIn && !activeBreak && elapsedMinutes > 240 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              <Laptop className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800">Working</span>
            <span className="text-[10px] text-slate-500 font-medium">--:--</span>
          </div>

          {/* Node 5: Check Out */}
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              isCheckedOut ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              <Home className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800">Check Out</span>
            <span className="text-[10px] text-slate-500 font-medium">{checkOutTime}</span>
          </div>
        </div>
      </div>

      {/* Working Status Banner */}
      <div className="p-3 px-4 bg-emerald-50/80 rounded-xl border border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            {activeBreak ? <Coffee className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
          </div>
          <span className="text-xs font-bold text-emerald-900">
            {isCheckedIn
              ? activeBreak
                ? `You are currently on break`
                : `You are currently working • ${formatHours(elapsedMinutes)} today`
              : isCheckedOut
              ? `Shift completed • ${formatHours(elapsedMinutes)} worked`
              : `Ready to start shift`}
          </span>
        </div>
        <span className="text-xs font-extrabold text-emerald-700">Live</span>
      </div>

      {/* Interactive Action Buttons */}
      <div className="space-y-2">
        {!isCheckedIn && !isCheckedOut ? (
          <Button variant="primary" className="w-full py-3 text-sm font-bold shadow-md shadow-blue-600/20" onClick={onCheckIn} isLoading={isLoading}>
            <Play className="w-4 h-4 fill-current" /> Check In Now
          </Button>
        ) : isCheckedOut ? (
          <div className="text-center py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">
            Shift Ended for Today
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {!activeBreak ? (
              <Button variant="warning" size="md" onClick={() => onStartBreak('LUNCH')} isLoading={isLoading} className="font-bold">
                <Coffee className="w-4 h-4" /> Take Break
              </Button>
            ) : (
              <Button variant="success" size="md" onClick={onEndBreak} isLoading={isLoading} className="font-bold">
                <CheckCircle2 className="w-4 h-4" /> End Break
              </Button>
            )}

            <Button variant="danger" size="md" onClick={onCheckOut} isLoading={isLoading} className="font-bold">
              <Square className="w-4 h-4 fill-current" /> Check Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
