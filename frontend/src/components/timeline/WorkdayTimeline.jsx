import React from 'react';
import { Clock, Play, StopCircle, Coffee, Utensils } from 'lucide-react';

export const WorkdayTimeline = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        No attendance events recorded today yet.
      </div>
    );
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'CHECK_IN':
        return <Play className="w-3.5 h-3.5 text-blue-600" />;
      case 'CHECK_OUT':
        return <StopCircle className="w-3.5 h-3.5 text-red-600" />;
      case 'BREAK_START':
        return <Coffee className="w-3.5 h-3.5 text-amber-500" />;
      case 'LUNCH_START':
        return <Utensils className="w-3.5 h-3.5 text-orange-500" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'CHECK_IN':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CHECK_OUT':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'BREAK_START':
      case 'BREAK_END':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {events.map((event, index) => (
        <div key={index} className="relative flex items-start gap-4">
          <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-xs">
            {getEventIcon(event.type)}
          </div>

          <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">{event.time}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeColor(event.type)}`}>
                {event.type.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">{event.label || event.type}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
