import React from 'react';
import { Bell, CheckCircle2, Award, BookOpen, Clock, AlertTriangle } from 'lucide-react';

export const StudentNotifications = () => {
  const notifications = [
    {
      id: '1',
      title: 'Milestone 1 Pre-Check Complete',
      message: 'FastAPI AI Pre-Check evaluated your submission with 88% completeness. Grade: A.',
      time: '10 minutes ago',
      type: 'AI_CHECK',
      read: false,
    },
    {
      id: '2',
      title: 'Mentor Session Confirmed',
      message: 'Dr. Robert Langdon accepted your 1-on-1 mentorship request for tomorrow at 4:00 PM.',
      time: '2 hours ago',
      type: 'MENTOR',
      read: false,
    },
    {
      id: '3',
      title: 'New Quiz Unlocked: SQL & ORM Architecture',
      message: 'Module 1 Quiz is now open for all students in Batch 2026-Alpha.',
      time: '1 day ago',
      type: 'COURSE',
      read: true,
    },
    {
      id: '4',
      title: 'Badge Earned: Quiz Whiz',
      message: 'Congratulations! You scored 85%+ on architectural knowledge check.',
      time: '2 days ago',
      type: 'ACHIEVEMENT',
      read: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Notifications & Alert Center</h1>
        <p className="text-xs text-slate-500">Real-time alerts on mentor feedback, deadline reminders, and academic milestones</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start justify-between rounded-xl border p-4 shadow-sm transition-all ${
              !n.read ? 'border-brand-300 bg-brand-50/40' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 text-white mt-0.5 shadow-sm">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
              </div>
            </div>

            {!n.read && (
              <span className="h-2.5 w-2.5 rounded-full bg-brand-600 animate-pulse mt-1"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
