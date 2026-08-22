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
    <aside className="w-64 bg-white border-r border-slate-200/90 h-screen sticky top-0 flex flex-col justify-between hidden md:flex shrink-0 z-20">
      <div className="flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1E62EC] text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">Dayflow</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
              ENTERPRISE HRMS
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="p-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                            ? 'bg-blue-50/90 text-blue-600 border-l-4 border-blue-600 font-bold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
      <div className="p-3 m-3 bg-gradient-to-br from-blue-50/70 to-slate-50 rounded-2xl border border-blue-100/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.profilePictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              {user?.jobTitle || user?.role || 'HR Operations'}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[9px] font-bold text-green-700">Online</span>
            </div>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
          <button
            onClick={() => navigate('/app/profile')}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            View Profile <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={logout}
            title="Log out"
            className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
