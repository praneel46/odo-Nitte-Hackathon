import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendance';
import { leaveService } from '../../services/leave';
import { payrollService } from '../../services/payroll';
import { notificationsService } from '../../services/notifications';
import { WorkdayTrackerCard } from '../../components/cards/WorkdayTrackerCard';
import { WorkdayTimeline } from '../../components/timeline/WorkdayTimeline';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import {
  Calendar,
  CreditCard,
  Umbrella,
  ArrowRight,
  Bell,
  Plus,
  FileText,
  Users,
  MapPin,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserCheck2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [payroll, setPayroll] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [attData, tlData, lvsData, balData, payData, notifData] = await Promise.all([
        attendanceService.getToday().catch(() => null),
        attendanceService.getTimelineToday().catch(() => []),
        leaveService.getMyLeaves().catch(() => []),
        leaveService.getMyBalances().catch(() => []),
        payrollService.getMyPayroll().catch(() => null),
        notificationsService.getMyNotifications().catch(() => []),
      ]);

      setAttendance(attData);
      setTimeline(tlData || []);
      setLeaves(lvsData || []);
      setLeaveBalances(balData || []);
      setPayroll(payData);
      setNotifications(notifData || []);
    } catch (err) {
      console.warn('Dashboard fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      await attendanceService.checkIn();
      showToast('Checked in successfully!', 'success');
      loadDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to check in', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      await attendanceService.checkOut();
      showToast('Checked out successfully!', 'info');
      loadDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to check out', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartBreak = async (type) => {
    setActionLoading(true);
    try {
      await attendanceService.startBreak(type);
      showToast('Break started.', 'warning');
      loadDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to start break', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndBreak = async () => {
    setActionLoading(true);
    try {
      await attendanceService.endBreak();
      showToast('Break ended.', 'success');
      loadDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to end break', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const paidLeave = leaveBalances.find((b) => b.leaveType === 'PAID');
  const pendingLeaves = leaves.filter((l) => l.status === 'PENDING');

  // Compute attendance stats
  const presentDays = attendance?.checkInTime ? 18 : 17;
  const totalWorkDays = 20;
  const attendanceRate = Math.round((presentDays / totalWorkDays) * 100);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      {/* HERO WELCOME BANNER */}
      <div className="bg-gradient-to-r from-[#1E62EC] via-[#1A58E1] to-[#1244C8] text-white p-6 sm:p-7 rounded-2xl shadow-lg shadow-blue-900/10 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Background Ambient Circles */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 right-40 w-48 h-48 rounded-full bg-cyan-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">👋</span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Good day, {user?.firstName || 'Alex'}!
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-medium text-blue-100/90 flex items-center gap-1.5">
            Welcome to Dayflow — Your workplace hub. Let's make today productive. <Sparkles className="w-4 h-4 text-cyan-300 inline" />
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-semibold text-white shrink-0 self-start sm:self-auto shadow-xs">
          <Calendar className="w-4 h-4 text-cyan-200" />
          <span>{todayFormatted}</span>
          <span className="text-blue-200">•</span>
          <MapPin className="w-3.5 h-3.5 text-cyan-200" />
          <span>Bengaluru, India</span>
        </div>
      </div>

      {/* KPI / SUMMARY CARDS (4 Cards Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Paid Leave Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-blue-200 transition-all">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">PAID LEAVE BALANCE</p>
            <h2 className="text-2xl font-black text-slate-900">
              {paidLeave ? `${paidLeave.totalEntitled - paidLeave.used}` : '12'}{' '}
              <span className="text-xs font-bold text-slate-500">Days</span>
            </h2>
            <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 2 vs last month
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100/80 shrink-0">
            <Umbrella className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Net Present Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-green-200 transition-all">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">NET PRESENT TODAY</p>
            <h2 className="text-2xl font-black text-slate-900">
              {presentDays} / {totalWorkDays}
            </h2>
            <p className="text-[10px] font-bold text-emerald-600">{attendanceRate}% attendance rate</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100/80 shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Monthly Salary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-purple-200 transition-all">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">MONTHLY SALARY</p>
            <h2 className="text-2xl font-black text-slate-900">
              ₹{payroll?.netSalary ? payroll.netSalary.toLocaleString() : '52,000'}
            </h2>
            <button
              onClick={() => navigate('/app/payroll')}
              className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
            >
              View Payslip <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold border border-purple-100/80 shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Pending Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-amber-200 transition-all">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">PENDING REQUESTS</p>
            <h2 className="text-2xl font-black text-slate-900">
              {pendingLeaves.length} <span className="text-xs font-bold text-slate-500">Requests</span>
            </h2>
            <button
              onClick={() => navigate('/app/leave')}
              className="text-[10px] font-bold text-amber-600 hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-100/80 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: WORKDAY TRACKER + ATTENDANCE OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Workday Tracker (Left ~65%) */}
        <div className="lg:col-span-7">
          <WorkdayTrackerCard
            attendance={attendance}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onStartBreak={handleStartBreak}
            onEndBreak={handleEndBreak}
            isLoading={actionLoading}
          />
        </div>

        {/* Attendance Overview (Right ~35%) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-4">
            Attendance Overview
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto py-2">
            {/* Donut SVG Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600 transition-all duration-1000"
                  strokeDasharray={`${attendanceRate}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 leading-none">{attendanceRate}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Present</span>
              </div>
            </div>

            {/* Legend Stats */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <div>
                  <p className="text-xs font-bold text-slate-700">Present — <span className="text-slate-900 font-extrabold">{presentDays}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-slate-200" />
                <div>
                  <p className="text-xs font-bold text-slate-700">Absent — <span className="text-slate-900 font-extrabold">{totalWorkDays - presentDays}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: WORKDAY TIMELINE + QUICK ACTIONS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Workday Timeline (Left ~65%) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Workday Timeline</h3>
            <button
              onClick={() => navigate('/app/attendance')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
            >
              View Full History <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <WorkdayTimeline events={timeline} />
        </div>

        {/* Quick Actions & Recent Activity (Right ~35%) */}
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
          {/* Quick Actions Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => navigate('/app/leave/apply')}
                className="p-3 bg-blue-50/60 hover:bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700">Apply Leave</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/app/documents')}
                className="p-3 bg-purple-50/60 hover:bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-between transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-purple-700">Documents</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/app/payroll')}
                className="p-3 bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Payroll &amp; Slips</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/app/profile')}
                className="p-3 bg-amber-50/60 hover:bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                    <UserCheck2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700">Update Profile</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Recent Activity</h3>
              <button
                onClick={() => navigate('/app/notifications')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {notifications.length > 0 ? (
                notifications.slice(0, 2).map((notif) => (
                  <div key={notif.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{notif.title}</p>
                      <p className="text-[10px] text-slate-500 truncate">{notif.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">Payslip for Aug 2026 is available</p>
                    <p className="text-[10px] text-slate-500">2 hours ago</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
