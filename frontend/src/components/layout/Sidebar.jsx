import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  ArrowRight,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isHr, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

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
    <aside className="w-64 bg-white dark:bg-[#111827] border-r border-slate-200/90 dark:border-slate-800 h-screen sticky top-0 flex flex-col justify-between hidden md:flex shrink-0 z-20 transition-colors">
      <div className="flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1E62EC] text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-none">Dayflow</h1>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mt-0.5">
              ENTERPRISE HRMS
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="p-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
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
                        `flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                          isActive
                            ? 'bg-blue-50/90 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-500 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
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

      {/* Compact User Profile Card Footer */}
      <div className="p-3 m-3 bg-gradient-to-br from-blue-50/70 to-slate-50 dark:from-slate-800/60 dark:to-slate-900/80 rounded-2xl border border-blue-100/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.profilePictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
              {user?.jobTitle || user?.role || 'HR Operations'}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[9px] font-bold text-green-700 dark:text-green-400">Online</span>
            </div>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => navigate('/app/profile')}
            className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 hover:underline cursor-pointer"
          >
            View Profile <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={logout}
            title="Log out"
            className="p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
