import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Users, Shield, Mail, CheckCircle2 } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([
    { id: '1', name: 'System SuperAdmin', email: 'admin@edtech.com', role: 'SUPER_ADMIN', status: 'ACTIVE' },
    { id: '2', name: 'Viji', email: 'viji@edtech.com', role: 'MENTOR', status: 'ACTIVE' },
    { id: '3', name: 'Sailesh', email: 'sailesh@edtech.com', role: 'STUDENT', status: 'ACTIVE' },
    { id: '4', name: 'Sujitha', email: 'sujitha@edtech.com', role: 'STUDENT', status: 'ACTIVE' },
    { id: '5', name: 'Isaac', email: 'isaac@edtech.com', role: 'STUDENT', status: 'ACTIVE' },
    { id: '6', name: 'Harrish', email: 'harrish@edtech.com', role: 'STUDENT', status: 'ACTIVE' },
    { id: '7', name: 'Praveen', email: 'praveen@edtech.com', role: 'STUDENT', status: 'ACTIVE' },
  ]);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">User Identity & Access Management</h1>
        <p className="text-xs text-slate-500">Configure global RBAC roles, permission assignments, and audit active sessions</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-4">User Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Account Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900">{u.name}</td>
                <td className="p-4 text-slate-600">{u.email}</td>
                <td className="p-4">
                  <span className="rounded bg-slate-100 font-mono px-2 py-0.5 text-[10px] font-bold text-slate-800">
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => alert(`Editing permissions for user: ${u.email}`)}
                    className="text-xs font-semibold text-brand-900 hover:underline"
                  >
                    Edit Permissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
