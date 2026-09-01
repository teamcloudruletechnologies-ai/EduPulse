import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentTasks = () => {
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

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading tasks...</div>;

  const allTasks = projects.flatMap((p) =>
    (p.tasks || []).map((t) => ({ ...t, projectTitle: p.title }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Task Management Kanban</h1>
          <p className="text-xs text-slate-500">Track assigned milestone tasks, deadlines, and submission reviews</p>
        </div>
        <Link
          to="/student/submissions"
          className="flex items-center space-x-2 rounded-xl bg-brand-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-800"
        >
          <Send className="h-4 w-4" />
          <span>Upload Work Evidence</span>
        </Link>
      </div>

      <div className="space-y-3">
        {allTasks.length > 0 ? (
          allTasks.map((t) => (
            <div key={t.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 sm:space-y-0">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-900">{t.projectTitle}</span>
                <h3 className="text-sm font-bold text-slate-900">{t.title}</h3>
                <p className="text-xs text-slate-600">{t.description}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right text-xs">
                  <span className="block font-semibold text-slate-700">Priority: {t.priority}</span>
                  <span className="text-[11px] text-slate-500">Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'Flexible'}</span>
                </div>
                <StatusBadge status={t.status} />
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
            No tasks assigned yet. Propose or join a project to begin.
          </div>
        )}
      </div>
    </div>
  );
};
