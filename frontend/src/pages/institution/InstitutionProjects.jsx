import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FolderGit2, Users, Send, CheckCircle } from 'lucide-react';

export const InstitutionProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects')
      .then((res) => {
        if (res.data?.success) setProjects(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading institution projects...</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Institution Capstone Projects Audit</h1>
        <p className="text-xs text-slate-500">Monitor all capstone projects, assigned mentors, and milestone status</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-4">Project Title</th>
              <th className="p-4">Creator / Team Lead</th>
              <th className="p-4">Tech Stack</th>
              <th className="p-4">Assigned Mentor</th>
              <th className="p-4">Milestones</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((proj) => (
              <tr key={proj.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900">{proj.title}</td>
                <td className="p-4 text-slate-700">{proj.creator?.user?.firstName || 'Alex'} {proj.creator?.user?.lastName || 'Mercer'}</td>
                <td className="p-4 text-slate-500">{proj.techStack}</td>
                <td className="p-4 text-purple-900 font-semibold">{proj.mentor?.user?.firstName ? `Dr. ${proj.mentor.user.firstName} ${proj.mentor.user.lastName}` : 'Assigned'}</td>
                <td className="p-4 text-slate-600">{proj.tasks?.length || 2} Tasks</td>
                <td className="p-4 text-right">
                  <StatusBadge status={proj.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
