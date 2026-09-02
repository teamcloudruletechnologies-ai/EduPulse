import React, { useEffect, useState } from 'react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { api } from '../../services/api';
import { FolderGit2, BookOpen, Send, Video, Users, CheckCircle2, ArrowRight, Star, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MentorDashboard = () => {
  const [data, setData] = useState({
    activeProjects: 4,
    enrolledCourses: 2,
    pendingSubmissions: 3,
    scheduledMeetings: 2,
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-900 to-purple-950 p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-purple-200 backdrop-blur-md">
              👨‍🏫 Senior Industry Mentor Workspace
            </span>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
              Welcome back, Viji!
            </h1>
            <p className="mt-1 text-xs text-purple-100">
              Senior Solution Architect • Full-Stack Cloud & AI Systems Specialist
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/mentor/projects"
              className="flex items-center space-x-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-brand-900 shadow hover:bg-brand-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>+ Create Capstone Project</span>
            </Link>
            <Link
              to="/mentor/sessions"
              className="flex items-center space-x-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-purple-500 transition-colors"
            >
              <Video className="h-4 w-4" />
              <span>Schedule 1-on-1 Meeting</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Supervised Projects"
          value={data.activeProjects}
          subtext="Active student capstones"
          icon={FolderGit2}
          color="purple"
          linkTo="/mentor/projects"
        />
        <StatCard
          title="Published Courses"
          value={data.enrolledCourses}
          subtext="Curricula & Modules"
          icon={BookOpen}
          color="blue"
          linkTo="/mentor/courses"
        />
        <StatCard
          title="Pending Submissions"
          value={data.pendingSubmissions}
          subtext="AI Pre-Checked & Ready"
          icon={Send}
          color="amber"
          linkTo="/mentor/submissions"
        />
        <StatCard
          title="Upcoming Meetings"
          value={data.scheduledMeetings}
          subtext="1-on-1 Review Sessions"
          icon={Video}
          color="green"
          linkTo="/mentor/sessions"
        />
      </div>

      {/* Student In-Video Doubts & Deliverables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student In-Video Doubts Queue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student In-Video Doubts & Q&A</h3>
              <p className="text-[11px] text-slate-500">Questions submitted by students inside recorded lectures</p>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
              Live Q&A
            </span>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Sailesh (CS2026-042) • Lecture 1 (14:30)</span>
                <span className="rounded bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-[10px]">Answered</span>
              </div>
              <p className="text-[11px] text-slate-700">
                "Why do we need a STUN server in WebRTC if both clients are already connected to WebSocket?"
              </p>
              <div className="rounded-lg bg-white p-2 text-[10px] text-emerald-900 border border-emerald-100">
                <strong>Viji (Lead Mentor):</strong> "WebSocket exchanges SDP/ICE. STUN discovers public NAT/firewall IP for direct P2P media."
              </div>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Isaac (CS2026-029) • Lecture 2 (34:50)</span>
                <span className="rounded bg-amber-100 text-amber-800 font-bold px-2 py-0.5 text-[10px]">Pending Reply</span>
              </div>
              <p className="text-[11px] text-slate-700">
                "Can a student bypass the Python exec() sandbox by importing os or sys modules?"
              </p>
              <div className="flex justify-end pt-1">
                <Link
                  to="/mentor/submissions"
                  className="rounded-lg bg-blue-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-blue-500"
                >
                  Post Mentor Answer
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Submissions Queue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Student Deliverables for Review</h3>
            <Link to="/mentor/submissions" className="text-xs font-bold text-brand-900 hover:underline">
              View All Submissions
            </Link>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Sailesh • Python Solution</span>
                <StatusBadge status="PENDING_REVIEW" />
              </div>
              <p className="text-[11px] text-slate-600">
                Python Loop Sum Calculation & Multi-Input Test Cases in Sandbox.
              </p>
              <div className="flex justify-end pt-1">
                <Link
                  to="/mentor/submissions"
                  className="rounded-lg bg-brand-900 px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-brand-800"
                >
                  Review & Grade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
