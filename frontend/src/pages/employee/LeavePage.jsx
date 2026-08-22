import React, { useState, useEffect } from 'react';
import { leaveService } from '../../services/leave';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Plus, Umbrella, CheckCircle2, XCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LeavePage = () => {
  const { isHr } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('MY_LEAVES');
  const [myLeaves, setMyLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [myLvs, bal, allLvs] = await Promise.all([
        leaveService.getMyLeaves(),
        leaveService.getMyBalances(),
        isHr ? leaveService.getAllLeaves() : Promise.resolve([]),
      ]);
      setMyLeaves(myLvs || []);
      setBalances(bal || []);
      setAllLeaves(allLvs || []);
    } catch (err) {
      console.warn('Leave data fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isHr]);

  const handleApprove = async (id) => {
    const comment = window.prompt('Optional approval comment:', 'Approved.');
    setActionLoading(true);
    try {
      await leaveService.approveLeave(id, comment || 'Approved');
      showToast('Leave request approved!', 'success');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to approve leave', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    const comment = window.prompt('Reason for rejection (Required):');
    if (!comment || !comment.trim()) {
      showToast('Rejection comment is required.', 'error');
      return;
    }
    setActionLoading(true);
    try {
      await leaveService.rejectLeave(id, comment.trim());
      showToast('Leave request rejected.', 'info');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to reject leave', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const displayLeaves = activeTab === 'HR_APPROVALS' ? allLeaves : myLeaves;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Leave & Time-Off Management</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Track your available leave quotas and process time-off applications</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate('/app/leave/apply')}>
          <Plus className="w-4 h-4" /> Apply New Leave
        </Button>
      </div>

      {/* Role Navigation Tabs */}
      {isHr && (
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('MY_LEAVES')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'MY_LEAVES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            My Leave Quotas & History
          </button>
          <button
            onClick={() => setActiveTab('HR_APPROVALS')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'HR_APPROVALS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" /> Company HR Approvals ({allLeaves.filter((l) => l.status === 'PENDING').length} Pending)
          </button>
        </div>
      )}

      {/* Balances Card Grid (Visible in MY_LEAVES) */}
      {activeTab === 'MY_LEAVES' && (
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
      )}

      {/* Requests History / Approvals Table */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 font-bold text-sm text-slate-900 flex justify-between items-center">
            <span>{activeTab === 'HR_APPROVALS' ? 'Company-wide Leave Approval Queue' : 'My Leave Application History'}</span>
            <span className="text-xs font-semibold text-slate-500">{displayLeaves.length} Total Requests</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {activeTab === 'HR_APPROVALS' && <th className="p-4">Employee</th>}
                  <th className="p-4">Type</th>
                  <th className="p-4">Dates</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {displayLeaves.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    {activeTab === 'HR_APPROVALS' && (
                      <td className="p-4 font-bold text-slate-900">{req.employeeName || req.employeeId}</td>
                    )}
                    <td className="p-4 font-bold text-slate-900">{req.leaveType}</td>
                    <td className="p-4">{req.startDate} to {req.endDate}</td>
                    <td className="p-4 font-semibold text-slate-900">{req.requestedDays} Days</td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">{req.reason}</td>
                    <td className="p-4">
                      <Badge variant={req.status === 'APPROVED' ? 'success' : req.status === 'REJECTED' ? 'danger' : 'warning'}>
                        {req.status}
                      </Badge>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/app/leave/${req.id}`)}>
                        Details
                      </Button>
                      {activeTab === 'HR_APPROVALS' && req.status === 'PENDING' && (
                        <>
                          <Button variant="success" size="sm" onClick={() => handleApprove(req.id)} isLoading={actionLoading}>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleReject(req.id)} isLoading={actionLoading}>
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </Button>
                        </>
                      )}
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
