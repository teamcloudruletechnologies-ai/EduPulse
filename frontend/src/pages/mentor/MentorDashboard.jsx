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

      {/* Quick Action Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <span className="text-xs font-bold text-slate-900">Alex Mercer • Milestone 1 Deliverable</span>
                <StatusBadge status="PENDING_REVIEW" />
              </div>
              <p className="text-[11px] text-slate-600">
                MySQL Relational Schema & Node.js Express REST API integration. AI Pre-check score: 88%.
              </p>
              <div className="flex justify-end pt-1">
                <Link
                  to="/mentor/submissions"
                  className="rounded-lg bg-brand-900 px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-brand-800"
                >
                  Grade & Review
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Sessions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Upcoming 1-on-1 Mentorship Sessions</h3>
            <Link to="/mentor/sessions" className="text-xs font-bold text-brand-900 hover:underline">
              Schedule New
            </Link>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-950">Student: Alex Mercer (Batch 2026-Alpha)</span>
                <span className="rounded bg-purple-200 text-purple-900 font-bold px-2 py-0.5 text-[10px]">Tomorrow 4:00 PM</span>
              </div>
              <p className="text-[11px] text-purple-800">Topic: Architecture Review & Query Optimization</p>
              <div className="flex justify-end pt-1">
                <a
                  href="https://meet.jit.si/EdTechMentorSession-Demo"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-purple-900 px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-purple-800"
                >
                  Join Video Room
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
