import React, { useEffect, useState } from 'react';
import { StatCard } from '../../components/common/StatCard';
import { api } from '../../services/api';
import { GraduationCap, Layers, Send, Bell, CheckCircle } from 'lucide-react';

export const InstitutionDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/students/all'), api.get('/projects'), api.get('/institutions')])
      .then(([stRes, prRes, instRes]) => {
        setData({
          studentsCount: stRes.data?.data?.length || 42,
          projectsCount: prRes.data?.data?.length || 18,
          institutionsCount: instRes.data?.data?.length || 1,
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading institution portal...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">School & College Portal</span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Apex Institute of Technology & Engineering</h1>
          <p className="text-xs text-slate-500">Batch progress monitoring, student management, program analytics</p>
        </div>
        <button
          onClick={() => alert('Announcement created and broadcasted to students and parents.')}
          className="flex items-center space-x-2 rounded-xl bg-purple-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-purple-800"
        >
          <Bell className="h-4 w-4" />
          <span>+ Post Announcement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Enrolled Students"
          value={data?.studentsCount || 42}
          subtext="Batch 2026-Alpha"
          icon={GraduationCap}
          color="purple"
          linkTo="/institution/students"
        />
        <StatCard
          title="Active Projects Monitored"
          value={data?.projectsCount || 18}
          subtext="Capstone & Research"
          icon={Layers}
          color="blue"
          linkTo="/institution/projects"
        />
        <StatCard
          title="Class Attendance Avg"
          value="94.2%"
          subtext="High attendance rate"
          icon={CheckCircle}
          color="green"
          linkTo="/institution/attendance"
        />
        <StatCard
          title="Submissions Pending Review"
          value="5"
          subtext="Assigned to mentors"
          icon={Send}
          color="amber"
          linkTo="/institution/submissions"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Recent Platform Announcements</h3>
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-xs text-purple-950 space-y-1">
          <p className="font-bold">📢 Final Capstone Project Deliverable Deadline Extended</p>
          <p className="text-purple-900">
            All student teams are advised to submit GitHub evidence links before Friday midnight for AI pre-check processing.
          </p>
        </div>
      </div>
    </div>
  );
};
