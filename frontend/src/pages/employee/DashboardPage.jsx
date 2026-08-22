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
import { Calendar, DollarSign, Umbrella, ArrowRight, Bell, Plus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

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
        attendanceService.getToday(),
        attendanceService.getTimelineToday(),
        leaveService.getMyLeaves(),
        leaveService.getMyBalances(),
        payrollService.getMyPayroll(),
        notificationsService.getMyNotifications(),
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Greeting & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Good day, {user?.firstName}! 👋
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{todayFormatted} • Welcome to your workplace hub</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/app/leave/apply')}>
            <Plus className="w-4 h-4" /> Apply Leave
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/app/documents')}>
            <FileText className="w-4 h-4" /> Documents
          </Button>
        </div>
      </div>

      {/* Top Summary Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Umbrella className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Paid Time-Off</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {paidLeave ? `${paidLeave.remainingDays} / ${paidLeave.totalDays}` : '16 / 20'} <span className="text-xs text-slate-500 font-medium">Days</span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Net Monthly Compensation</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
              ${payroll?.netSalary ? payroll.netSalary.toLocaleString() : '8,500.00'}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Pending Requests</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {leaves.filter((l) => l.status === 'PENDING').length} <span className="text-xs text-slate-500 font-medium">Requests</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Visually Prominent Tracker & Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkdayTrackerCard
          attendance={attendance}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          onStartBreak={handleStartBreak}
          onEndBreak={handleEndBreak}
          isLoading={actionLoading}
        />

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Workday Timeline</h3>
            <button onClick={() => navigate('/app/attendance')} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              Full History <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <WorkdayTimeline events={timeline} />
        </div>
      </div>

      {/* Bottom Grid: Recent Leaves & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Recent Leave Requests</h3>
            <button onClick={() => navigate('/app/leave')} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {leaves.slice(0, 3).map((leave) => (
              <div key={leave.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{leave.leaveType} LEAVE ({leave.requestedDays} Days)</p>
                  <p className="text-xs text-slate-500 mt-0.5">{leave.startDate} to {leave.endDate}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  leave.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                  leave.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {leave.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Brief */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Recent Alerts</h3>
            <button onClick={() => navigate('/app/notifications')} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              Center <Bell className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 3).map((notif) => (
              <div key={notif.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-900">{notif.title}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{notif.createdAt}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-1">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
