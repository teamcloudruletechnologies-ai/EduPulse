import React, { useEffect, useState } from 'react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { api } from '../../services/api';
import { Building2, Users, FolderGit2, BarChart3, Check, X, ShieldCheck, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [institutions, setInstitutions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([api.get('/institutions'), api.get('/analytics/overview')])
      .then(([instRes, anaRes]) => {
        if (instRes.data?.success) setInstitutions(instRes.data.data);
        if (anaRes.data?.success) setAnalytics(anaRes.data.data);
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
        setInstitutions((prev) =>
          prev.map((inst) => (inst.id === instId ? { ...inst, status } : inst))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading Super Admin control center...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Central Platform Control</span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Super Admin Executive Dashboard</h1>
          <p className="text-xs text-slate-500">Verify institutions, monitor platform audit logs, and configure system rules</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to="/admin/recorded-classes"
            className="flex items-center space-x-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-500"
          >
            <Video className="h-4 w-4" />
            <span>Upload Recorded Classes</span>
          </Link>
          <Link
            to="/admin/analytics"
            className="flex items-center space-x-2 rounded-xl bg-emerald-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-800"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Platform Analytics</span>
          </Link>
        </div>
      </div>

      {/* Global Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Recorded Lectures"
          value="4 Classes"
          subtext="Live for students"
          icon={Video}
          color="blue"
          linkTo="/admin/recorded-classes"
        />
        <StatCard
          title="Registered Institutions"
          value={institutions.length}
          subtext="Active campuses"
          icon={Building2}
          color="green"
          linkTo="/admin/institutions"
        />
        <StatCard
          title="Total Platform Users"
          value={analytics?.summary?.totalStudents || 6}
          subtext="Students & Mentors"
          icon={Users}
          color="blue"
          linkTo="/admin/users"
        />
        <StatCard
          title="Projects Monitored"
          value={analytics?.summary?.totalProjects || 34}
          subtext="Across all programs"
          icon={FolderGit2}
          color="purple"
          linkTo="/admin/users"
        />
      </div>


      {/* Institution Verification Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Institution Onboarding Verification Queue</h3>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            Verification Queue
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Institution Name</th>
                <th className="p-3">Code & Type</th>
                <th className="p-3">Email & Contact</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Super Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {institutions.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900">{inst.name}</td>
                  <td className="p-3">{inst.code} ({inst.type})</td>
                  <td className="p-3">{inst.email}</td>
                  <td className="p-3">
                    <StatusBadge status={inst.status} />
                  </td>
                  <td className="p-3 text-right">
                    {inst.status === 'PENDING_VERIFICATION' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleVerify(inst.id, 'APPROVED')}
                          className="flex items-center space-x-1 rounded-lg bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-800"
                        >
                          <Check className="h-3 w-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleVerify(inst.id, 'REJECTED')}
                          className="flex items-center space-x-1 rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-rose-700"
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
    </div>
  );
};
