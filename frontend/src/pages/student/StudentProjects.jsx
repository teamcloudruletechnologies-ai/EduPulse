import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FolderGit2, Plus, Users, Calendar, CheckSquare, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentProjects = () => {
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

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading student projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project Management Studio</h1>
          <p className="text-xs text-slate-500">Create capstone project proposals, assign tasks, and track milestone statuses</p>
        </div>
        <Link
          to="/student/projects/create"
          className="flex items-center space-x-2 rounded-xl bg-brand-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Project Proposal</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ID: {proj.id.substring(0, 8)}</span>
              <StatusBadge status={proj.status} />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{proj.description}</p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 text-xs space-y-1">
              <p><strong className="text-slate-900">Problem Statement:</strong> {proj.problemStatement}</p>
              <p><strong className="text-slate-900">Objectives:</strong> {proj.objectives}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-1.5">
                <Users className="h-4 w-4 text-brand-900" />
                <span>Mentor: {proj.mentor?.user?.firstName ? `Dr. ${proj.mentor.user.firstName} ${proj.mentor.user.lastName}` : 'Assigned'}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckSquare className="h-4 w-4 text-emerald-600" />
                <span>{proj.tasks?.length || 0} Tasks</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
