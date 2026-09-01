import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import {
  Video,
  Calendar,
  Clock,
  ExternalLink,
  MessageSquare,
  Users,
  Globe,
  Sparkles,
  Info,
  Radio,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const DEFAULT_COHORT_SESSION = {
  id: 'cohort-live-2026',
  roomId: 'EduPulseGlobalCohort',
  topic: 'Full Stack Architecture & Capstone Mentorship Sync',
  mentorName: 'Dr. Robert Langdon (Lead Mentor)',
  mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  scheduledAt: 'Live Now (Active Session)',
  duration: 60,
  participants: 24,
  status: 'LIVE_NOW',
  meetingUrl: '/meeting/EduPulseGlobalCohort?topic=Full%20Stack%20Architecture%20%26%20Capstone%20Mentorship%20Sync&host=Dr.%20Robert%20Langdon',
  notes: 'Interactive mentor cohort workshop covering microservices architecture, cloud deployment, and code reviews.',
};

export const StudentMeetings = () => {
  const { showToast } = useToast();
  const [sessions, setSessions] = useState([DEFAULT_COHORT_SESSION]);

  const loadSessions = async () => {
    try {
      const res = await api.get('/mentors/sessions');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setSessions([DEFAULT_COHORT_SESSION, ...res.data.data]);
        localStorage.setItem('edtech_shared_sessions', JSON.stringify(res.data.data));
        return;
      }
    } catch (e) {
      // Cloud API fallback
    }

    const saved = localStorage.getItem('edtech_shared_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions([DEFAULT_COHORT_SESSION, ...parsed]);
          return;
        }
      } catch (e) {}
    }
    setSessions([DEFAULT_COHORT_SESSION]);
  };

  useEffect(() => {
    loadSessions();

    const handleStorageChange = (e) => {
      if (e.key === 'edtech_shared_sessions') {
        loadSessions();
      }
    };

    const handleCustomEvent = () => {
      loadSessions();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('edtech_shared_sessions_updated', handleCustomEvent);
    window.addEventListener('focus', loadSessions);

    const interval = setInterval(loadSessions, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('edtech_shared_sessions_updated', handleCustomEvent);
      window.removeEventListener('focus', loadSessions);
      clearInterval(interval);
    };
  }, []);

  const handleJoinInDedicatedTab = (session) => {
    const roomId = session.roomId || session.id || 'EdTechOpenCohort';
    const url = `/meeting/${roomId}?topic=${encodeURIComponent(session.topic)}&host=${encodeURIComponent(
      session.mentorName || 'Dr. Robert Langdon'
    )}`;
    window.open(url, '_blank');
    showToast(`Joining "${session.topic}"!`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Live Mentor Syncs & Cohort Meetings</h1>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
              🌐 Live Video
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Join live workshops, code architecture masterclasses, and Q&A sessions scheduled by your assigned mentor
          </p>
        </div>

        <Link
          to="/student/messages"
          className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs shrink-0"
        >
          <MessageSquare className="h-4 w-4 text-blue-600" />
          <span>Ask Mentor in Chat</span>
        </Link>
      </div>

      {/* Scheduled Sessions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Active Mentor Meetings ({sessions.length})
          </h2>
          <span className="text-[11px] font-bold text-blue-600 flex items-center">
            <span className="h-2 w-2 rounded-full bg-blue-600 mr-1.5 animate-pulse"></span> Synchronized with Mentor
          </span>
        </div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 flex items-center">
                      <Globe className="h-3 w-3 mr-1" /> Live Sync
                    </span>
                    <span className="text-xs font-bold text-slate-700 flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1 text-blue-600" /> {sess.scheduledAt}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{sess.topic}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Host: <strong>{sess.mentorName || 'Dr. Robert Langdon'}</strong> (Mentor)
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1">
                      <Users className="h-3.5 w-3.5 text-blue-600 inline" />
                      <span>{sess.audience || 'Assigned Mentees (Cohort 2026)'}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-600 flex items-center">
                    <span className="h-2 w-2 rounded-full bg-blue-600 mr-1.5 animate-pulse"></span> EduPulse Live Room
                  </span>

                  <button
                    onClick={() => handleJoinInDedicatedTab(sess)}
                    className="flex items-center space-x-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Join Meeting ➔</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400 space-y-2">
            <Globe className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-600">No meetings scheduled by your mentor at this moment.</p>
            <p>Upcoming cohort sessions will appear here as soon as your mentor schedules them.</p>
          </div>
        )}
      </div>
    </div>
  );
};
