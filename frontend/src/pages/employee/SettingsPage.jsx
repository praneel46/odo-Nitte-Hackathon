import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { Bell, Lock, Globe } from 'lucide-react';

export const SettingsPage = () => {
  const { showToast } = useToast();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Preferences updated.', 'success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">User Account Settings</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Manage notification preferences and security preferences</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" /> Notifications & Alerts
          </h3>
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">Email Notifications</p>
              <p className="text-[11px] text-slate-500">Receive leave updates & slip alerts via email</p>
            </div>
            <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="w-4 h-4 accent-blue-600" />
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" /> Security & Sessions
          </h3>
          <p className="text-xs text-slate-500">Your account is secured with JWT Token authentication and Spring Security filters.</p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button variant="primary" onClick={handleSave}>Save Preferences</Button>
        </div>
      </div>
    </div>
  );
};
