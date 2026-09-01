import React, { useState } from 'react';
import { Bell, Plus, Send, CheckCircle2 } from 'lucide-react';

export const InstitutionAnnouncements = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetRole, setTargetRole] = useState('ALL');
  const [announcements, setAnnouncements] = useState([
    {
      id: '1',
      title: 'Final Capstone Project Deliverable Deadline Extended',
      content: 'All student teams are advised to submit GitHub evidence links before Friday midnight for AI pre-check processing.',
      targetRole: 'STUDENTS',
      date: 'Aug 28, 2026',
    },
    {
      id: '2',
      title: 'Monthly Parent-Mentor Progress Sync Scheduled',
      content: 'Virtual sync links for parent reviews will be available in the parent portal starting this Saturday.',
      targetRole: 'PARENTS',
      date: 'Aug 27, 2026',
    },
  ]);

  const handlePost = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const item = {
      id: String(Date.now()),
      title,
      content,
      targetRole,
      date: 'Just now',
    };
    setAnnouncements((prev) => [item, ...prev]);
    setTitle('');
    setContent('');
    alert('Announcement broadcasted to ' + targetRole + ' portal!');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Institution Announcements & Circulars</h1>
        <p className="text-xs text-slate-500">Publish broadcast notifications to students, parents, faculty, or all campus users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Post Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="h-4 w-4 text-purple-700" />
            <span>Publish New Circular</span>
          </h2>

          <form onSubmit={handlePost} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700">Circular Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Schedule for Mid-Term Milestone Reviews"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">Target Audience</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
              >
                <option value="ALL">All Portal Users (Campus-Wide)</option>
                <option value="STUDENTS">Students Only</option>
                <option value="PARENTS">Parents Only</option>
                <option value="FACULTY">Faculty & Mentors Only</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700">Announcement Content</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write message details..."
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                required
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-purple-900 py-2.5 text-xs font-semibold text-white shadow hover:bg-purple-800"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Broadcast Announcement</span>
            </button>
          </form>
        </div>

        {/* Announcements Stream */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Broadcast Feed</h2>
          {announcements.map((a) => (
            <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-900">
                  Target: {a.targetRole}
                </span>
                <span className="text-[11px] text-slate-400">{a.date}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{a.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
