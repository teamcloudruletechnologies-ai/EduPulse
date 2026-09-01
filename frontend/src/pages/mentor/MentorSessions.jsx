import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  Video,
  Calendar,
  Clock,
  Plus,
  ExternalLink,
  Trash2,
  Globe,
  Users,
  Sparkles,
  Radio,
  PhoneOff,
} from 'lucide-react';

export const MentorSessions = () => {
  const { showToast } = useToast();
  const [sessions, setSessions] = useState([]);

  const [formData, setFormData] = useState({
    topic: '',
    datetime: '',
    duration: 45,
  });

  const loadSessions = async () => {
    try {
      const res = await api.get('/mentors/sessions');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setSessions(res.data.data);
        localStorage.setItem('edtech_shared_sessions', JSON.stringify(res.data.data));
        return;
      }
    } catch (e) {}

    const saved = localStorage.getItem('edtech_shared_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const realSessions = parsed.filter((s) => s.id !== 'sess-pub-1');
          setSessions(realSessions);
          return;
        }
      } catch (e) {}
    }
    setSessions([]);
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

  const handleSchedule = (e) => {
    e.preventDefault();
    if (!formData.topic || !formData.datetime) {
      showToast('Please enter meeting topic and schedule date/time.', 'error');
      return;
    }

    const cleanTopicSlug = formData.topic.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
    const roomId = `EdTech-${cleanTopicSlug}-${Date.now().toString(36)}`;
    const newSession = {
      id: 'sess-pub-' + Date.now(),
      roomId: roomId,
      audience: 'Assigned Mentees (Cohort 2026)',
      mentorName: 'Viji',
      topic: formData.topic,
      scheduledAt: new Date(formData.datetime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      duration: `${formData.duration} mins`,
      meetingType: 'MENTEE_COHORT_MEET',
      status: 'SCHEDULED',
    };

    const updated = [newSession, ...sessions.filter((s) => s.id !== 'sess-pub-1')];
    setSessions(updated);
    localStorage.setItem('edtech_shared_sessions', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('edtech_shared_sessions_updated'));

    try {
      api.post('/mentors/sessions', {
        topic: formData.topic,
        scheduledAt: formData.datetime,
        duration: formData.duration,
        mentorName: 'Viji',
      }).catch((e) => console.warn('Cloud sync error:', e.message));
    } catch (e) {}

    showToast('🌐 Meeting scheduled for your assigned mentees across all devices!', 'success');
    setFormData({
      topic: '',
      datetime: '',
      duration: 45,
    });
  };

  const handleCancel = (id, topic) => {
    if (window.confirm(`Cancel session "${topic}"?`)) {
      const updated = sessions.filter((s) => s.id !== id);
      setSessions(updated);
      localStorage.setItem('edtech_shared_sessions', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('edtech_shared_sessions_updated'));

      try {
        api.delete(`/mentors/sessions/${id}`).catch(() => {});
      } catch (e) {}

      showToast('Meeting cancelled.', 'info');
    }
  };

  const handleHostInDedicatedTab = (session) => {
    const roomId = session.roomId || session.id || 'EdTechOpenCohort';
    const url = `/meeting/${roomId}?isHost=true&topic=${encodeURIComponent(session.topic)}&host=${encodeURIComponent(
      session.mentorName || 'Viji'
    )}`;
    window.open(url, '_blank');
    showToast(`Launching "${session.topic}" in dedicated Live Meeting!`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Mentor Live Meeting & Cohort Scheduler</h1>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
              👥 Auto-Routed to Your Mentees
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Host live group workshops, milestone masterclasses, and Q&A sessions for your assigned mentees
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Globe className="h-4 w-4 text-blue-600" />
            <span>Schedule New Live Meeting</span>
          </h2>

          <form onSubmit={handleSchedule} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700">Meeting Topic & Agenda *</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g. Milestone 1 System Design & Code Review"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.datetime}
                onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">Duration</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:outline-none bg-white"
              >
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes (Recommended)</option>
                <option value={60}>60 Minutes (Masterclass)</option>
                <option value={90}>90 Minutes (Deep Dive Workshop)</option>
              </select>
            </div>

            <div className="rounded-xl bg-blue-50 border border-blue-100 p-2.5 text-[11px] text-blue-800 flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Target: Automatically routed to your assigned student cohort.</span>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-bold text-white shadow transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Broadcast Meeting to Mentees</span>
            </button>
          </form>
        </div>

        {/* Scheduled Sessions Grid */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Active Scheduled Meetings ({sessions.length})
            </h2>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              🌐 Live Video Room
            </span>
          </div>

          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-800 flex items-center">
                        <Globe className="h-3 w-3 mr-1" /> Mentee Sync
                      </span>
                      <span className="rounded-md bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-900">
                        {s.duration}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-700 flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" /> {s.scheduledAt}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{s.topic}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
                      <Users className="h-3.5 w-3.5 text-blue-600 inline" />
                      <span>Audience: <strong>Assigned Mentees (Cohort 2026)</strong></span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleHostInDedicatedTab(s)}
                      className="flex items-center space-x-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow cursor-pointer transition-colors"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Host Meeting ➔</span>
                    </button>

                    <button
                      onClick={() => handleCancel(s.id, s.topic)}
                      className="inline-flex items-center space-x-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400 space-y-2">
              <Globe className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-600">No meetings scheduled yet.</p>
              <p>Use the form on the left to schedule a new live meeting for your mentees.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
