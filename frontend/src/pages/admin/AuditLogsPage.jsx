import React, { useState, useEffect } from 'react';
import { auditLogsService } from '../../services/auditLogs';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { ShieldAlert } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditLogsService.getLogs().then((data) => {
      setLogs(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">System Security Audit Logs</h2>
          <p className="text-xs text-slate-500 font-medium">Read-only immutable governance event trail for compliance</p>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Log ID</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">User Account</th>
                  <th className="p-4">Target Entity</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">#{log.id}</td>
                    <td className="p-4">
                      <Badge variant="purple">{log.action}</Badge>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{log.userEmail}</td>
                    <td className="p-4 font-semibold text-slate-900">
                      {log.entityName ? `${log.entityName} #${log.entityId || ''}` : 'N/A'}
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">{log.details || '-'}</td>
                    <td className="p-4 font-mono text-slate-500">{log.ipAddress}</td>
                    <td className="p-4 text-slate-500">{log.timestamp}</td>
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
