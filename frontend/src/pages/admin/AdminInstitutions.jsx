import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Building2, Check, X, Search, ShieldCheck } from 'lucide-react';

export const AdminInstitutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    api.get('/institutions')
      .then((res) => {
        if (res.data?.success) setInstitutions(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (instId, status) => {
    try {
      const res = await api.patch(`/institutions/${instId}/verify`, { status });
      if (res.data?.success) {
        alert(`Institution status updated to: ${status}`);
        loadData();
      }
    } catch (err) {
      alert('Verification error: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading institutions...</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Institution Verification & Management</h1>
        <p className="text-xs text-slate-500">Approve onboarding colleges, audit accreditation certificates, and activate tenant partitions</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-4">Campus Name</th>
              <th className="p-4">Campus Code & Type</th>
              <th className="p-4">Official Email</th>
              <th className="p-4">Phone Contact</th>
              <th className="p-4">Verification Status</th>
              <th className="p-4 text-right">Super Admin Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {institutions.map((inst) => (
              <tr key={inst.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900">{inst.name}</td>
                <td className="p-4 text-slate-600">{inst.code} ({inst.type})</td>
                <td className="p-4 text-slate-600">{inst.email}</td>
                <td className="p-4 text-slate-500">{inst.phone}</td>
                <td className="p-4">
                  <StatusBadge status={inst.status} />
                </td>
                <td className="p-4 text-right">
                  {inst.status === 'PENDING_VERIFICATION' ? (
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleVerify(inst.id, 'APPROVED')}
                        className="flex items-center space-x-1 rounded bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-800"
                      >
                        <Check className="h-3 w-3" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleVerify(inst.id, 'REJECTED')}
                        className="flex items-center space-x-1 rounded bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-rose-700"
                      >
                        <X className="h-3 w-3" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-700">Verified & Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
