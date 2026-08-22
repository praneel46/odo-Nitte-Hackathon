import React, { useState, useEffect } from 'react';
import { leaveService } from '../../services/leave';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Plus, Umbrella, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([leaveService.getMyLeaves(), leaveService.getMyBalances()]).then(([lvs, bal]) => {
      setLeaves(lvs || []);
      setBalances(bal || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Leave & Time-Off Management</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Track your available leave quotas and submit time-off applications</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate('/app/leave/apply')}>
          <Plus className="w-4 h-4" /> Apply New Leave
        </Button>
      </div>

      {/* Balances Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {balances.map((b, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">{b.leaveType} LEAVE BALANCE</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {b.remainingDays} <span className="text-xs text-slate-400 font-medium">/ {b.totalDays} Days Left</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Umbrella className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Requests History Table */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 font-bold text-sm text-slate-900">
            My Leave Application History
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Type</th>
                  <th className="p-4">Dates</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {leaves.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{req.leaveType}</td>
                    <td className="p-4">{req.startDate} to {req.endDate}</td>
                    <td className="p-4 font-semibold text-slate-900">{req.requestedDays} Days</td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">{req.reason}</td>
                    <td className="p-4">
                      <Badge variant={req.status === 'APPROVED' ? 'success' : req.status === 'REJECTED' ? 'danger' : 'warning'}>
                        {req.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/app/leave/${req.id}`)}>
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
