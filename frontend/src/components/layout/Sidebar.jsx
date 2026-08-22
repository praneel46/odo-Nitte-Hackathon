import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Clock,
  Calendar,
  FileText,
  FolderOpen,
  Users,
  BarChart3,
  ShieldAlert,
  Bell,
  User,
  Settings,
  LogOut,
  Layers,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isHr, isAdmin, logout } = useAuth();

  const navSections = [
    {
      title: 'CORE WORKPLACE',
      items: [
        { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
        { label: 'Attendance', path: '/app/attendance', icon: Clock },
        { label: 'Leave Management', path: '/app/leave', icon: Calendar },
        { label: 'Payroll & Slips', path: '/app/payroll', icon: FileText },
        { label: 'Document Vault', path: '/app/documents', icon: FolderOpen },
      ],
    },
    ...(isHr
      ? [
          {
            title: 'MANAGEMENT & HR',
            items: [
              { label: 'Employee Directory', path: '/app/employees', icon: Users },
              { label: 'Workforce Analytics', path: '/app/analytics', icon: BarChart3 },
            ],
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            title: 'SYSTEM GOVERNANCE',
            items: [
              { label: 'Security Audit Logs', path: '/app/audit-logs', icon: ShieldAlert },
              { label: 'System Settings', path: '/app/settings/system', icon: Settings },
            ],
          },
        ]
      : []),
    {
      title: 'USER ACCOUNT',
      items: [
        { label: 'Notifications', path: '/app/notifications', icon: Bell },
        { label: 'Profile Settings', path: '/app/profile', icon: User },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between hidden md:flex shrink-0">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">Dayflow</h1>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Enterprise HRMS</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="p-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-r-lg border-l-[3px] transition-all ${
                          isActive
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Footer Brief */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={user?.profilePictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="User"
            className="w-9 h-9 rounded-full object-cover border border-slate-200"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <span className="inline-block text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
              {user?.role || 'EMPLOYEE'}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          title="Log out"
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
