import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FolderGit2, Plus, Users, CheckSquare, Layers, Sparkles, X } from 'lucide-react';

export const MentorProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problemStatement: '',
    objectives: '',
    techStack: 'React.js, Node.js, Express, Python FastAPI, MySQL, Tailwind CSS',
    status: 'ACTIVE',
  });

  const loadProjects = () => {
    api.get('/projects')
      .then((res) => {
        if (res.data?.success) setProjects(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      showToast('Please enter project title and description.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const newProj = {
        id: 'proj-' + Date.now(),
        title: formData.title,
        description: formData.description,
        problemStatement: formData.problemStatement,
        objectives: formData.objectives,
        techStack: formData.techStack,
        status: formData.status,
        creator: { user: { firstName: 'Alex', lastName: 'Mercer' } },
        tasks: [
          { id: 't1', title: 'Milestone 1: Architecture & Schema', status: 'COMPLETED' },
          { id: 't2', title: 'Milestone 2: API & Microservice Integration', status: 'IN_PROGRESS' },
        ],
      };

      setProjects((prev) => [newProj, ...prev]);
      showToast(`Capstone project "${formData.title}" created successfully!`, 'success');
      setFormData({
        title: '',
        description: '',
        problemStatement: '',
        objectives: '',
        techStack: 'React.js, Node.js, Express, Python FastAPI, MySQL, Tailwind CSS',
        status: 'ACTIVE',
      });
      setIsModalOpen(false);
    } catch (err) {
      showToast('Error creating project: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Capstone Project Creator & Studio</h1>
          <p className="text-xs text-slate-500">Design enterprise problem statements, define milestone objectives, and assign deliverables to student teams</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 rounded-xl bg-brand-900 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>+ Create New Capstone Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Capstone ID: {proj.id.substring(0, 8)}
              </span>
              <StatusBadge status={proj.status} />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{proj.description}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 text-xs space-y-1.5 border border-slate-100">
              <p><strong className="text-slate-900">Problem Statement:</strong> {proj.problemStatement}</p>
              <p><strong className="text-slate-900">Deliverables:</strong> {proj.objectives}</p>
              <p><strong className="text-slate-900">Tech Stack:</strong> <span className="font-mono text-purple-900">{proj.techStack}</span></p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <div className="flex items-center space-x-1.5">
                <Users className="h-4 w-4 text-brand-900" />
                <span>Assigned Student: {proj.creator?.user?.firstName || 'Alex'} {proj.creator?.user?.lastName || 'Mercer'}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckSquare className="h-4 w-4 text-emerald-600" />
                <span>{proj.tasks?.length || 2} Milestones</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 my-8 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-900">
                  <FolderGit2 className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Create & Assign Capstone Project</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Project Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Distributed Cloud Monitoring Engine with AI Pre-Checks"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Short Summary *</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief synopsis of project scope..."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Problem Statement *</label>
                <textarea
                  rows={2}
                  value={formData.problemStatement}
                  onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                  placeholder="State the core industry challenge being solved..."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Milestone Objectives & Deliverables *</label>
                <textarea
                  rows={2}
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  placeholder="Milestone 1: Database Schema. Milestone 2: Microservice API..."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Tech Stack</label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-1.5 rounded-xl bg-brand-900 px-5 py-2 text-xs font-bold text-white shadow hover:bg-brand-800"
                >
                  <Plus className="h-4 w-4" />
                  <span>{submitting ? 'Creating...' : 'Publish Capstone Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
