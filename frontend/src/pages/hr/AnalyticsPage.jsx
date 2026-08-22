import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analytics';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Users, Clock, Calendar, DollarSign, Building } from 'lucide-react';

export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getWorkforceAnalytics().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">Workforce Analytics & Insights</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">High-level overview of headcount, attendance rates, and departmental distribution</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Total Headcount</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{data?.totalEmployees}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Attendance Rate</p>
          <h3 className="text-2xl font-extrabold text-green-600 mt-1">{data?.attendanceRate}%</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Active Time-Offs</p>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{data?.activeLeavesCount}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Monthly Payroll Cost</p>
          <h3 className="text-2xl font-extrabold text-blue-600 mt-1">${data?.totalMonthlyPayroll?.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase">Department Headcount Breakdown</h3>
        <div className="space-y-4 pt-2">
          {data?.departmentBreakdown?.map((dept, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>{dept.department}</span>
                <span>{dept.count} Members</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(dept.count / (data.totalEmployees || 1)) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
