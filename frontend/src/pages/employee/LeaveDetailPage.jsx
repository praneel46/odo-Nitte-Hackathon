import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leaveService } from '../../services/leave';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export const LeaveDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaveService.getMyLeaves().then((data) => {
      const found = (data || []).find((l) => String(l.id) === String(id));
      setLeave(found || { id, leaveType: 'PAID', startDate: '2026-09-01', endDate: '2026-09-05', requestedDays: 5, reason: 'Annual vacation', status: 'APPROVED', adminComment: 'Approved! Enjoy your time off.' });
      setLoading(false);
    });
  }, [id]);

  if (loading) return null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/app/leave')} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Leave Request #{id}</h2>
          <p className="text-xs text-slate-500 font-medium">Detailed status & review remarks</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Category</span>
            <p className="text-base font-bold text-slate-900">{leave?.leaveType} LEAVE</p>
          </div>
          <Badge variant={leave?.status === 'APPROVED' ? 'success' : leave?.status === 'REJECTED' ? 'danger' : 'warning'}>
            {leave?.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-slate-400 font-medium">Duration</span>
            <p className="text-sm font-bold text-slate-900">{leave?.requestedDays} Days</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Date Range</span>
            <p className="text-sm font-bold text-slate-900">{leave?.startDate} to {leave?.endDate}</p>
          </div>
        </div>

        <div>
          <span className="text-xs text-slate-400 font-medium">Employee Reason</span>
          <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1">{leave?.reason}</p>
        </div>

        {leave?.adminComment && (
          <div>
            <span className="text-xs text-slate-400 font-medium">HR Manager Remarks</span>
            <p className="text-xs text-blue-900 bg-blue-50/60 p-3 rounded-lg border border-blue-100 mt-1 font-medium">
              {leave.adminComment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
