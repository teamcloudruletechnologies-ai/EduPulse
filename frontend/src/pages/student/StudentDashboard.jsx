import React, { useEffect, useState } from 'react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { api } from '../../services/api';
import {
  BookOpen,
  FolderGit2,
  CheckSquare,
  Brain,
  Zap,
  Sparkles,
  Code2,
  Terminal,
  Play,
  ArrowRight,
  Video,
  Calendar,
  Clock,
  ExternalLink,
  Globe,
  Users,
  Radio,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scheduledSessions, setScheduledSessions] = useState([]);

  const loadSessions = () => {
    const saved = localStorage.getItem('edtech_shared_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remove static mock session
          const realSessions = parsed.filter((s) => s.id !== 'sess-pub-1');
          setScheduledSessions(realSessions);
          return;
        }
      } catch (e) {}
    }
    setScheduledSessions([]);
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

  useEffect(() => {
    api.get('/students/dashboard')
      .then((res) => {
        if (res.data?.success) {
          setData(res.data.data);
        }
      })
      .catch((err) => console.error('Error loading student dashboard:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleJoinMeeting = (sess) => {
    const roomId = sess.roomId || sess.id || 'EdTechCohortMeeting';
    const url = `/meeting/${roomId}?topic=${encodeURIComponent(sess.topic)}&host=${encodeURIComponent(
      sess.mentorName || 'Dr. Robert Langdon'
    )}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading student dashboard & AI insights...</div>;
  }

  const student = data?.student;
  const aiAnalytics = data?.aiAnalytics;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-900 to-indigo-900 p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-brand-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Student Learning & Code Studio
            </span>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
              Welcome back, {student?.user?.firstName || 'Alex'}!
            </h1>
            <p className="mt-1 text-xs text-brand-100">
              {student?.institution?.name || 'Apex Institute of Technology'} • Roll No: {student?.rollNumber || 'CS2026-042'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/student/submissions"
              className="flex items-center space-x-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-600 transition-colors"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Launch Online Compiler</span>
            </Link>
            <Link
              to="/student/projects/create"
              className="flex items-center space-x-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-purple-500 transition-colors"
            >
              <FolderGit2 className="h-4 w-4" />
              <span>+ Propose Project</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SCHEDULED MENTOR MEETINGS SECTION */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Live Cohort Workshops & Mentor Syncs
              </h2>
              <p className="text-[11px] text-slate-500">
                Scheduled by your mentor — opens in dedicated high-definition Live Meeting studio
              </p>
            </div>
          </div>
          <Link
            to="/student/meetings"
            className="rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-200 transition-colors"
          >
            {scheduledSessions.length} Sessions View All →
          </Link>
        </div>

        {scheduledSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scheduledSessions.map((sess) => (
              <div
                key={sess.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800 flex items-center">
                      <Globe className="h-3 w-3 mr-1" /> Live Sync
                    </span>
                    <span className="text-xs font-bold text-slate-700 flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1 text-emerald-600" /> {sess.scheduledAt}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{sess.topic}</h3>
                  <p className="text-xs text-slate-500">
                    Host: <strong className="text-slate-700">{sess.mentorName || 'Dr. Robert Langdon'}</strong> • Audience: {sess.audience || 'Assigned Mentees'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-blue-600 font-semibold flex items-center">
                    <span className="h-2 w-2 rounded-full bg-blue-600 mr-1.5 animate-pulse"></span> EduPulse Live Room
                  </span>
                  <button
                    onClick={() => handleJoinMeeting(sess)}
                    className="flex items-center space-x-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Join Meeting ➔</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            No mentor meetings scheduled at this time.
          </div>
        )}
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Learning Progress"
          value={`${aiAnalytics?.overall_progressPct || 75}%`}
          subtext="Course completion rate"
          icon={BookOpen}
          color="blue"
          linkTo="/student/learning"
        />
        <StatCard
          title="Active Projects"
          value={student?.projects?.length || 1}
          subtext="Capstone deliverables"
          icon={FolderGit2}
          color="purple"
          linkTo="/student/projects"
        />
        <StatCard
          title="Tasks Completed"
          value={`${aiAnalytics?.task_completion_rate || 80}%`}
          subtext="Milestones on track"
          icon={CheckSquare}
          color="green"
          linkTo="/student/tasks"
        />
        <StatCard
          title="Code Submissions"
          value={student?.submissions?.length || 2}
          subtext="Evaluated by AI"
          icon={Code2}
          color="amber"
          linkTo="/student/submissions"
        />
      </div>

      {/* Python FastAPI AI Analysis Card */}
      {aiAnalytics && (
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white shadow-xl">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
            <Brain className="h-4 w-4 text-indigo-400" />
            <span>Python FastAPI Microservice: AI Student Analytics</span>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-indigo-800/50 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-semibold text-indigo-200 uppercase">Learning Velocity</p>
              <p className="mt-1 text-2xl font-extrabold text-white">{aiAnalytics.learning_velocity_score || 88} / 100</p>
              <p className="mt-1 text-[11px] text-emerald-400">High engagement consistency</p>
            </div>
            <div className="rounded-xl border border-indigo-800/50 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-semibold text-indigo-200 uppercase">Key Strengths Identified</p>
              <ul className="mt-2 space-y-1 text-xs text-indigo-100">
                {(aiAnalytics.strengths || ['Database Modeling', 'API Design', 'System Architecture']).map((s, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <Zap className="h-3 w-3 text-amber-400" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-indigo-800/50 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-semibold text-indigo-200 uppercase">AI Recommendation</p>
              <p className="mt-2 text-xs text-indigo-100 leading-relaxed">
                {aiAnalytics.recommendations?.[0] || 'Maintain momentum and submit active milestone deliverables for mentor review.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Projects & Programiz Compiler Quick Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Active Capstone Project</h3>
            <Link to="/student/projects" className="text-xs font-semibold text-brand-900 hover:underline">
              View All
            </Link>
          </div>
          {student?.projects && student.projects.length > 0 ? (
            student.projects.map((proj) => (
              <div key={proj.id} className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                  <StatusBadge status={proj.status} />
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Tech: {proj.techStack}</span>
                  <span>Mentor: {proj.mentor?.user?.firstName ? `Dr. ${proj.mentor.user.firstName} ${proj.mentor.user.lastName}` : 'Dr. Robert Langdon'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="mt-4 text-center py-6 text-xs text-slate-500">
              No active project found. <Link to="/student/projects/create" className="text-brand-900 font-semibold underline">Create one now</Link>.
            </div>
          )}
        </div>

        {/* Programiz Compiler Quick Studio Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Code2 className="h-4 w-4 text-emerald-600" />
                <span>Programiz Online Code Sandbox</span>
              </h3>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                ● V8 & Py3 Ready
              </span>
            </div>
            <div className="mt-3 space-y-2 text-xs text-slate-600">
              <p>
                Write and test algorithms, API handlers, or database queries in Python 3, JavaScript, SQL, C++, and Java.
              </p>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 font-mono text-[11px] text-slate-800">
                <code>print("Hello, Programiz Compiler Ready!")</code>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Step-by-step AST pipeline</span>
            <Link
              to="/student/submissions"
              className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Open Online Compiler</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
