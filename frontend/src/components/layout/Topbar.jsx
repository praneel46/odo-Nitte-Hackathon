import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Topbar = ({ onOpenMobileMenu }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-xs font-mono font-semibold text-blue-700">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeStr || '09:00:00 AM'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/app/notifications')}
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white" />
        </button>

        <div
          onClick={() => navigate('/app/profile')}
          className="flex items-center gap-3 pl-3 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img
            src={user?.profilePictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">{user?.jobTitle || 'Employee'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
