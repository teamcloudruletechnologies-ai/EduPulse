import React from 'react';
import { ShieldAlert, Lock, CheckCircle2, Clock } from 'lucide-react';

export const AdminAuditLogs = () => {
  const logs = [
    { id: '1', action: 'USER_LOGIN', user: 'admin@edtech.com', ip: '127.0.0.1', timestamp: 'Aug 28, 2026 13:17:28', status: 'SUCCESS' },
    { id: '2', action: 'STUDENT_LOGIN', user: 'student@edtech.com', ip: '127.0.0.1', timestamp: 'Aug 28, 2026 13:17:36', status: 'SUCCESS' },
    { id: '3', action: 'SCHEMA_MIGRATION', user: 'SYSTEM', ip: 'localhost', timestamp: 'Aug 28, 2026 13:14:40', status: 'SUCCESS' },
    { id: '4', action: 'DATABASE_SEED', user: 'SYSTEM', ip: 'localhost', timestamp: 'Aug 28, 2026 13:15:26', status: 'SUCCESS' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Security Audit Logs & Compliance Trail</h1>
        <p className="text-xs text-slate-500">Immutable audit records tracking user authentications, role mutations, and system API events</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-4">Action Type</th>
              <th className="p-4">Triggered By</th>
              <th className="p-4">Origin IP</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4 text-right">Event Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-mono font-bold text-slate-900">{l.action}</td>
                <td className="p-4 text-slate-700">{l.user}</td>
                <td className="p-4 font-mono text-slate-500">{l.ip}</td>
                <td className="p-4 text-slate-500">{l.timestamp}</td>
                <td className="p-4 text-right">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
