import React from 'react';
import { Clock, Play, StopCircle, Coffee, Laptop, Check } from 'lucide-react';

export const WorkdayTimeline = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400 text-xs font-medium bg-slate-50/50 rounded-2xl border border-slate-100">
        <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        No attendance events recorded today yet.
      </div>
    );
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'CHECK_IN':
        return <Play className="w-3.5 h-3.5 text-blue-600 fill-current" />;
      case 'CHECK_OUT':
        return <StopCircle className="w-3.5 h-3.5 text-red-600 fill-current" />;
      case 'BREAK_START':
      case 'BREAK_END':
        return <Coffee className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Laptop className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-3">
      {events.map((event, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3.5 px-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-200/70 transition-all"
        >
          <div className="flex items-center gap-3.5">
            <span className="text-xs font-mono font-bold text-slate-700 min-w-[70px]">
              {event.time}
            </span>

            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
              {getEventIcon(event.type)}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {event.label || event.type.replace('_', ' ')}
              </p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                Marked from Web App
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <Check className="w-3 h-3 stroke-[3]" /> Completed
          </span>
        </div>
      ))}
    </div>
  );
};
