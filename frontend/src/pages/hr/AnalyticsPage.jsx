import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analytics';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Users, Clock, Calendar, DollarSign, Building } from 'lucide-react';

export const AnalyticsPage = () => {
  const [workforce, setWorkforce] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [leave, setLeave] = useState(null);
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsService.getWorkforceAnalytics(),
      analyticsService.getAttendanceAnalytics(),
      analyticsService.getLeaveAnalytics(),
      analyticsService.getPayrollAnalytics(),
    ])
      .then(([wf, att, lv, pay]) => {
        setWorkforce(wf);
        setAttendance(att);
        setLeave(lv);
        setPayroll(pay);
      })
      .catch((err) => console.warn('Analytics fetch error', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CardSkeleton />;

  const deptList = workforce?.departmentBreakdown
    ? Array.isArray(workforce.departmentBreakdown)
      ? workforce.departmentBreakdown
      : Object.entries(workforce.departmentBreakdown).map(([department, count]) => ({ department, count }))
    : [];

  const roleList = workforce?.roleBreakdown
    ? Array.isArray(workforce.roleBreakdown)
      ? workforce.roleBreakdown
      : Object.entries(workforce.roleBreakdown).map(([role, count]) => ({ role, count }))
    : [];

  const leaveTypeList = leave?.leaveTypeBreakdown
    ? Array.isArray(leave.leaveTypeBreakdown)
      ? leave.leaveTypeBreakdown
      : Object.entries(leave.leaveTypeBreakdown).map(([type, count]) => ({ type, count }))
    : [];

  const totalEmp = workforce?.totalEmployees || 1;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">Workforce Analytics & Intelligence</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time database aggregated metrics for workforce, attendance, leaves, and compensation</p>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Headcount</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{workforce?.totalEmployees ?? 0}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Attendance Rate</p>
            <h3 className="text-2xl font-extrabold text-green-600 mt-0.5">{attendance?.attendanceRate ?? 0}%</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Pending Leaves</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-0.5">{leave?.pendingRequests ?? 0}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Monthly Payroll Net</p>
            <h3 className="text-2xl font-extrabold text-purple-600 mt-0.5">
              ${payroll?.totalNetSalary ? payroll.totalNetSalary.toLocaleString() : '0'}
            </h3>
          </div>
        </div>
      </div>

      {/* Grid: Department & Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" /> Department Breakdown
          </h3>
          <div className="space-y-3 pt-2">
            {deptList.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.department}</span>
                  <span>{item.count} Members</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (item.count / totalEmp) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" /> Role & Privilege Distribution
          </h3>
          <div className="space-y-3 pt-2">
            {roleList.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.role}</span>
                  <span>{item.count} Accounts</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (item.count / totalEmp) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
