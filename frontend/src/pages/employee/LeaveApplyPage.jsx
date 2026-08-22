import React, { useState, useEffect } from 'react';
import { leaveService } from '../../services/leave';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LeaveApplyPage = () => {
  const [formData, setFormData] = useState({
    leaveType: 'PAID',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      leaveService.getLeavePreview(formData.leaveType, formData.startDate, formData.endDate).then((res) => {
        setPreview(res);
      });
    } else {
      setPreview(null);
    }
  }, [formData.leaveType, formData.startDate, formData.endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (preview && !preview.valid && formData.leaveType !== 'UNPAID') {
      showToast('Cannot submit: Insufficient leave balance.', 'error');
      return;
    }
    setLoading(true);
    try {
      await leaveService.applyLeave(formData);
      showToast('Leave request submitted successfully!', 'success');
      navigate('/app/leave');
    } catch (err) {
      showToast(err.message || 'Failed to submit leave request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/app/leave')} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Apply for Leave</h2>
          <p className="text-xs text-slate-500 font-medium">Submit your time-off request with real-time Smart Leave insights</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Leave Type"
            value={formData.leaveType}
            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
            options={[
              { label: 'Paid Leave', value: 'PAID' },
              { label: 'Sick Leave', value: 'SICK' },
              { label: 'Unpaid Leave', value: 'UNPAID' },
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          {/* Smart Leave Pre-Submission Insights Card */}
          {preview && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" /> Smart Leave Insights
                </span>
                <Badge variant={preview.valid ? 'success' : 'danger'}>
                  {preview.valid ? 'VALID REQUEST' : 'INSUFFICIENT BALANCE'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center py-2 bg-white rounded-lg border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Working Days</p>
                  <p className="text-base font-extrabold text-slate-900">{preview.requestedDays} Days</p>
                  <span className="text-[9px] text-slate-400">(Weekends excluded)</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Current Quota</p>
                  <p className="text-base font-extrabold text-slate-900">{preview.currentBalance} Days</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Remaining After</p>
                  <p className={`text-base font-extrabold ${preview.remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {preview.remainingBalance} Days
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-slate-600 font-medium flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" /> Team Availability:
                </span>
                <span className="font-bold text-slate-900">
                  {preview.teamAvailabilityPercentage}% available ({preview.overlappingLeavesCount} overlapping leaves)
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Reason for Request <span className="text-red-500">*</span></label>
            <textarea
              required
              rows={3}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Provide context for your leave..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="w-1/2" onClick={() => navigate('/app/leave')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="w-1/2" isLoading={loading}>
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
