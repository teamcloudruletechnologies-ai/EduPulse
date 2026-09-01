import React from 'react';
import { Layers, Building2, Plus, Users, BookOpen } from 'lucide-react';

export const InstitutionPrograms = () => {
  const programs = [
    {
      code: 'CS-AI-2026',
      name: 'B.Tech Computer Science & Artificial Intelligence',
      description: 'Comprehensive 4-year degree specializing in full-stack cloud and AI systems.',
      batches: ['Batch 2026-Alpha (42 Students)', 'Batch 2026-Beta (38 Students)'],
      coursesCount: 8,
    },
    {
      code: 'DS-2026',
      name: 'B.Tech Data Science & Analytics',
      description: 'Applied machine learning, statistical modeling, and big data architecture.',
      batches: ['Batch 2026-DS (35 Students)'],
      coursesCount: 6,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Academic Programs & Batches</h1>
          <p className="text-xs text-slate-500">Configure degree curricula, assign student cohorts, and manage batch schedules</p>
        </div>
        <button
          onClick={() => alert('New program creation dialog')}
          className="flex items-center space-x-1.5 rounded-xl bg-purple-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-purple-800"
        >
          <Plus className="h-4 w-4" />
          <span>+ Create New Program</span>
        </button>
      </div>

      <div className="space-y-4">
        {programs.map((prog, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-xs font-bold text-purple-900">
                {prog.code}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{prog.coursesCount} Core Courses</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{prog.name}</h3>
              <p className="text-xs text-slate-600 mt-1">{prog.description}</p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Active Enrolled Batches</span>
              <div className="flex flex-wrap gap-2">
                {prog.batches.map((b, idx) => (
                  <span key={idx} className="rounded-md bg-white border border-slate-200 px-3 py-1 text-slate-800 font-semibold shadow-xs">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
