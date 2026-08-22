import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { X, Layers, LayoutDashboard, Clock, Calendar, FileText, FolderOpen, Users, BarChart3, ShieldAlert, Bell, User, Settings, LogOut } from 'lucide-react';

export const MobileNav = ({ isOpen, onClose }) => {
  const { user, isHr, isAdmin, logout } = useAuth();

  if (!isOpen) return null;

  const items = [
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Attendance', path: '/app/attendance', icon: Clock },
    { label: 'Leave Management', path: '/app/leave', icon: Calendar },
    { label: 'Payroll & Slips', path: '/app/payroll', icon: FileText },
    { label: 'Document Vault', path: '/app/documents', icon: FolderOpen },
    ...(isHr ? [
      { label: 'Employee Directory', path: '/app/employees', icon: Users },
      { label: 'Workforce Analytics', path: '/app/analytics', icon: BarChart3 }
    ] : []),
    ...(isAdmin ? [
      { label: 'Audit Logs', path: '/app/audit-logs', icon: ShieldAlert },
      { label: 'System Settings', path: '/app/settings/system', icon: Settings }
    ] : []),
    { label: 'Notifications', path: '/app/notifications', icon: Bell },
    { label: 'Profile Settings', path: '/app/profile', icon: User }
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white w-72 max-w-full h-full flex flex-col justify-between z-10 shadow-2xl p-4">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900">Dayflow</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4 space-y-1 overflow-y-auto max-h-[70vh]">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg border-l-4 ${
                      isActive
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-transparent text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={user?.profilePictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt="User" className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-xs font-bold text-slate-900">{user?.firstName} {user?.lastName}</p>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">{user?.role}</span>
            </div>
          </div>
          <button onClick={logout} className="p-2 text-slate-400 hover:text-red-600">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
