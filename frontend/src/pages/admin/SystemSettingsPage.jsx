import React from 'react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { Settings, ShieldCheck, Database, Server } from 'lucide-react';

export const SystemSettingsPage = () => {
  const { showToast } = useToast();

  const handleSave = () => {
    showToast('System configuration saved.', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">System & Governance Settings</h2>
          <p className="text-xs text-slate-500 font-medium">Global Dayflow platform settings and database configuration</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" /> Embedded Storage & JWT Policy
          </h3>
          <p className="text-xs text-slate-500">Database Driver: SQLite embedded database mode</p>
          <p className="text-xs text-slate-500">JWT Secret Expiration: 86400000 ms (24 hours)</p>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Cors & Security Filter Rules
          </h3>
          <p className="text-xs text-slate-500">Spring Security stateful filter chains active for all protected REST paths (`/api/**`).</p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button variant="primary" onClick={handleSave}>Save System Config</Button>
        </div>
      </div>
    </div>
  );
};
