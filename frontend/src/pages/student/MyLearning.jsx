import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Play,
  Clock,
  Calendar,
  User,
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  Film,
  X,
  Code2,
  ExternalLink,
  BookOpen,
  Check,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Lock,
  Unlock,
  ShieldAlert,
  FastForward,
  Rewind,
  AlertCircle,
} from 'lucide-react';


const DEFAULT_RECORDED_CLASSES = [
  {
    id: 'rec-1',
    title: 'Lecture 1: High-Concurrency WebSockets & Real-Time Signaling',
    subject: 'Full-Stack Architecture',
    faculty: 'Viji (Lead Mentor)',
    duration: '48 mins',
    date: '2026-09-01',
    videoUrl: 'https://www.youtube.com/embed/1BfCnjr_Vjg',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    description: 'Comprehensive breakdown of WebSockets, duplex TCP socket streaming, peer-to-peer WebRTC signaling handshakes, and broadcast channels.',
    tags: ['WebSockets', 'WebRTC', 'Node.js', 'Real-Time'],
    timestamps: [
      { time: '02:15', label: 'Introduction to Full Duplex Sockets' },
      { time: '14:30', label: 'WebRTC Signaling Loop & STUN Servers' },
      { time: '28:45', label: 'Building the BroadcastChannel in React' },
      { time: '41:10', label: 'Live Q&A & Error Handling' },
    ],
    uploadedBy: 'Admin Faculty',
  },
  {
    id: 'rec-2',
    title: 'Lecture 2: Python Memory Management, AST Parsing & Custom Sandbox',
    subject: 'Python Core & Compilers',
    faculty: 'Viji (Lead Mentor)',
    duration: '52 mins',
    date: '2026-08-30',
    videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    description: 'Deep dive into Python abstract syntax tree parsing (ast module), code decomposition, sandbox safety guards, and dynamic execution traces.',
    tags: ['Python', 'AST', 'Compilers', 'Memory'],
    timestamps: [
      { time: '01:00', label: 'Python Bytecode & Compiler Pipeline' },
      { time: '16:20', label: 'AST Node Visiting & Syntax Decomposition' },
      { time: '34:50', label: 'Safe Sandbox Execution with Restricted Builtins' },
      { time: '47:00', label: 'Live Debugging AST Parser' },
    ],
    uploadedBy: 'Admin Faculty',
  },
  {
    id: 'rec-3',
    title: 'Lecture 3: Relational Query Optimization, B-Tree Indexes & TiDB Cloud',
    subject: 'Database Engineering',
    faculty: 'Admin Faculty',
    duration: '42 mins',
    date: '2026-08-28',
    videoUrl: 'https://www.youtube.com/embed/HXV3zeRR3h4',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    description: 'Mastering SQL joins, B-Tree index structures, clustered vs non-clustered indexes, connection pooling, and distributed TiDB query plans.',
    tags: ['MySQL', 'TiDB', 'Indexing', 'Query Optimization'],
    timestamps: [
      { time: '03:40', label: 'B-Tree Index Data Structure Deep Dive' },
      { time: '18:15', label: 'Analyzing EXPLAIN Query Execution Plans' },
      { time: '31:00', label: 'Connecting to Cloud MySQL / TiDB Cluster' },
    ],
    uploadedBy: 'Admin Faculty',
  },
  {
    id: 'rec-4',
    title: 'Lecture 4: Microservices Architecture & Containerization with Docker',
    subject: 'Cloud & Infrastructure',
    faculty: 'Viji (Lead Mentor)',
    duration: '56 mins',
    date: '2026-08-25',
    videoUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo',
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80',
    description: 'Learn how to split monolithic architectures into resilient microservices, write optimized multi-stage Dockerfiles, and deploy to cloud clusters.',
    tags: ['Docker', 'Microservices', 'DevOps', 'Cloud'],
    timestamps: [
      { time: '05:10', label: 'Monolith vs Microservices Trade-offs' },
      { time: '22:00', label: 'Writing Production-Grade Multi-Stage Dockerfiles' },
      { time: '40:30', label: 'Service Discovery & Health Probes' },
    ],
    uploadedBy: 'Admin Faculty',
  },
];

export const MyLearning = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('edtech_recorded_classes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_RECORDED_CLASSES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [activePlayerClass, setActivePlayerClass] = useState(null);

  // Track completed/watched classes in localStorage
  const [watchedClasses, setWatchedClasses] = useState(() => {
    const saved = localStorage.getItem('edtech_student_watched_classes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return ['rec-1'];
  });

  // 10-Second Skip Limit System (Max 5 skips allowed per lecture)
  const MAX_SKIPS_ALLOWED = 5;
  const [skipCounts, setSkipCounts] = useState(() => {
    const saved = localStorage.getItem('edtech_lecture_skip_counts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoTimestampSec, setVideoTimestampSec] = useState(0);

  const fetchClasses = async () => {
    try {
      const res = await api.get('/recorded-classes');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setClasses(res.data.data);
        localStorage.setItem('edtech_recorded_classes', JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.warn('Using local recorded classes cache:', err.message);
    }
  };

  useEffect(() => {
    fetchClasses();

    // Listen for admin changes from other tabs or devices
    const handleStorageChange = (e) => {
      if (e.key === 'edtech_recorded_classes') {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setClasses(parsed);
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle +10s Skip Forward with strict 5-time quota limit
  const handleSkipForward = (classId) => {
    const currentUsed = skipCounts[classId] || 0;
    if (currentUsed >= MAX_SKIPS_ALLOWED) {
      showToast(
        `⛔ Skip Limit Reached! You have used all 5 skips (10s × 5) for this lecture. Skipping is locked to ensure attentive learning.`,
        'error'
      );
      return;
    }

    const nextCount = currentUsed + 1;
    const remaining = MAX_SKIPS_ALLOWED - nextCount;
    const updatedCounts = { ...skipCounts, [classId]: nextCount };
    setSkipCounts(updatedCounts);
    localStorage.setItem('edtech_lecture_skip_counts', JSON.stringify(updatedCounts));

    // Seek HTML5 video or update timestamp
    const videoEl = document.getElementById('class-video-element');
    if (videoEl) {
      videoEl.currentTime = Math.min(videoEl.duration || 9999, videoEl.currentTime + 10);
    } else {
      setVideoTimestampSec((prev) => prev + 10);
    }

    if (remaining === 0) {
      showToast(
        `🔒 Last skip used! (5/5). 10-second forward skipping is now locked for this lecture.`,
        'warning'
      );
    } else {
      showToast(
        `⏩ Skipped +10s (${remaining} of ${MAX_SKIPS_ALLOWED} skips remaining)`,
        'info'
      );
    }
  };

  // Handle -10s Rewind (Always allowed for reviewing concepts)
  const handleRewind = (classId) => {
    const videoEl = document.getElementById('class-video-element');
    if (videoEl) {
      videoEl.currentTime = Math.max(0, videoEl.currentTime - 10);
    } else {
      setVideoTimestampSec((prev) => Math.max(0, prev - 10));
    }
    showToast('⏪ Rewound -10s for review', 'info');
  };

  const toggleWatched = (classId, e) => {
    if (e) e.stopPropagation();
    setWatchedClasses((prev) => {
      const updated = prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId];
      localStorage.setItem('edtech_student_watched_classes', JSON.stringify(updated));
      showToast(
        updated.includes(classId)
          ? '🎉 Lecture marked as Watched & Completed!'
          : 'Lecture marked as Incomplete',
        'success'
      );
      return updated;
    });
  };


  const subjects = ['ALL', ...Array.from(new Set(classes.map((c) => c.subject)))];

  const filteredClasses = classes.filter((c) => {
    const matchesSubject = selectedSubject === 'ALL' || c.subject === selectedSubject;
    const matchesSearch =
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.faculty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const completedPct = classes.length > 0
    ? Math.round((watchedClasses.length / classes.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded-md bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                Admin-Published Video Archive
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Live Stream HD</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight flex items-center space-x-2">
              <Film className="h-6 w-6 text-blue-600" />
              <span>Recorded Classes & Video Lecture Hub</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              Watch high-definition classroom lectures uploaded by Admin and your Lead Mentor (Viji). Review key timestamps, track watched progress, and open live code sandboxes.
            </p>
          </div>

          {/* Progress Indicator Card */}
          <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 shrink-0">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Classroom Progress
              </span>
              <p className="text-lg font-black text-slate-900 mt-0.5">
                {watchedClasses.length} / {classes.length} <span className="text-xs text-slate-500 font-normal">Watched</span>
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-black text-xs ring-4 ring-blue-50">
              {completedPct}%
            </div>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search lectures by topic, title, faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedSubject === subj
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recorded Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => {
          const isWatched = watchedClasses.includes(cls.id);
          return (
            <div
              key={cls.id}
              onClick={() => setActivePlayerClass(cls)}
              className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer"
            >
              {/* Video Thumbnail */}
              <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                <img
                  src={cls.thumbnail}
                  alt={cls.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span className="rounded-md bg-blue-600/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-extrabold text-white tracking-wide uppercase">
                    {cls.subject}
                  </span>
                  {isWatched && (
                    <span className="flex items-center space-x-1 rounded-md bg-emerald-600/90 backdrop-blur-xs px-2 py-1 text-[10px] font-bold text-white">
                      <Check className="h-3 w-3" />
                      <span>Watched</span>
                    </span>
                  )}
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 flex items-center space-x-1 rounded-md bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-bold text-white">
                  <Clock className="h-3.5 w-3.5 text-blue-400" />
                  <span>{cls.duration}</span>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-115 group-hover:bg-blue-500 transition-all">
                  <Play className="h-5 w-5 fill-white ml-0.5" />
                </div>
              </div>

              {/* Class Info Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1 font-semibold text-slate-600">
                      <User className="h-3.5 w-3.5 text-blue-600" />
                      <span>{cls.faculty}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span>{cls.date}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {cls.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {cls.description}
                  </p>
                </div>

                {/* Tags & Action Buttons */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1">
                    {(cls.tags || []).map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePlayerClass(cls);
                      }}
                      className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-500 transition-colors cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5 fill-white" />
                      <span>Watch Lecture</span>
                    </button>

                    <button
                      onClick={(e) => toggleWatched(cls.id, e)}
                      className={`flex items-center space-x-1 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        isWatched
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      title={isWatched ? 'Click to mark as uncompleted' : 'Click to mark as watched'}
                    >
                      <CheckCircle2 className={`h-3.5 w-3.5 ${isWatched ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{isWatched ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClasses.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <Film className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Recorded Classes Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No lecture recordings match your search filter. Check back soon as Admin uploads new sessions.
          </p>
        </div>
      )}

      {/* THEATER MODE VIDEO PLAYER MODAL */}
      {activePlayerClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-scale-up max-h-[92vh] flex flex-col">
            {/* Top Bar Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Film className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                      {activePlayerClass.subject} • {activePlayerClass.duration}
                    </span>
                    {/* Live 10s Skip Quota Badge */}
                    <span
                      className={`flex items-center space-x-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold border ${
                        (skipCounts[activePlayerClass.id] || 0) >= MAX_SKIPS_ALLOWED
                          ? 'bg-rose-950/80 border-rose-700 text-rose-400'
                          : 'bg-amber-950/80 border-amber-700 text-amber-300'
                      }`}
                    >
                      {(skipCounts[activePlayerClass.id] || 0) >= MAX_SKIPS_ALLOWED ? (
                        <>
                          <Lock className="h-3 w-3 text-rose-400" />
                          <span>10s Skips: 0/{MAX_SKIPS_ALLOWED} (Locked)</span>
                        </>
                      ) : (
                        <>
                          <FastForward className="h-3 w-3 text-amber-400" />
                          <span>10s Skips: {MAX_SKIPS_ALLOWED - (skipCounts[activePlayerClass.id] || 0)}/{MAX_SKIPS_ALLOWED} Left</span>
                        </>
                      )}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white truncate max-w-xl">
                    {activePlayerClass.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActivePlayerClass(null)}
                  className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              {activePlayerClass.videoUrl?.includes('youtube.com') || activePlayerClass.videoUrl?.includes('youtu.be') ? (
                <iframe
                  id="class-video-iframe"
                  src={`${activePlayerClass.videoUrl}?autoplay=1&rel=0&start=${videoTimestampSec}`}
                  title={activePlayerClass.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : (
                <video
                  id="class-video-element"
                  src={activePlayerClass.videoUrl}
                  controls
                  autoPlay
                  className="h-full w-full"
                >
                  Your browser does not support HTML5 video streaming.
                </video>
              )}
            </div>

            {/* Custom Interactive Skip & Speed Control Toolbar */}
            <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Left: 10s Rewind and 10s Skip Buttons */}
              <div className="flex items-center space-x-2">
                {/* 10s Rewind (Always allowed) */}
                <button
                  onClick={() => handleRewind(activePlayerClass.id)}
                  className="flex items-center space-x-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 font-bold transition-all cursor-pointer active:scale-95"
                  title="Rewind 10 Seconds (Unlimited for review)"
                >
                  <Rewind className="h-3.5 w-3.5 text-blue-400" />
                  <span>-10s Rewind</span>
                </button>

                {/* 10s Forward Skip (Locked after 5 uses) */}
                <button
                  onClick={() => handleSkipForward(activePlayerClass.id)}
                  disabled={(skipCounts[activePlayerClass.id] || 0) >= MAX_SKIPS_ALLOWED}
                  className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-1.5 font-bold transition-all ${
                    (skipCounts[activePlayerClass.id] || 0) >= MAX_SKIPS_ALLOWED
                      ? 'bg-rose-950/60 border border-rose-800/80 text-rose-400 cursor-not-allowed opacity-80'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md cursor-pointer active:scale-95'
                  }`}
                  title={
                    (skipCounts[activePlayerClass.id] || 0) >= MAX_SKIPS_ALLOWED
                      ? 'Skip limit reached (5/5). Skipping is locked.'
                      : 'Skip forward 10s'
                  }
                >
                  {(skipCounts[activePlayerClass.id] || 0) >= MAX_SKIPS_ALLOWED ? (
                    <>
                      <Lock className="h-3.5 w-3.5 text-rose-400" />
                      <span>+10s Locked (0/5)</span>
                    </>
                  ) : (
                    <>
                      <FastForward className="h-3.5 w-3.5 text-white" />
                      <span>+10s Skip ({MAX_SKIPS_ALLOWED - (skipCounts[activePlayerClass.id] || 0)} left)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Center: Anti-Cheat Quota Info */}
              <div className="hidden md:flex items-center space-x-2 text-[11px]">
                {(skipCounts[activePlayerClass.id] || 0) >= MAX_SKIPS_ALLOWED ? (
                  <span className="flex items-center space-x-1 text-rose-400 font-bold bg-rose-950/40 border border-rose-800 px-2.5 py-1 rounded-lg">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Anti-Skip Policy: Maximum 5 skips reached. Watch lecture continuously.</span>
                  </span>
                ) : (
                  <span className="text-slate-400">
                    💡 Anti-Skip Policy: Max 5 forward skips (10s × 5) per lecture session.
                  </span>
                )}
              </div>

              {/* Right: Quick Reset (Demo) & Speed */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const updated = { ...skipCounts, [activePlayerClass.id]: 0 };
                    setSkipCounts(updated);
                    localStorage.setItem('edtech_lecture_skip_counts', JSON.stringify(updated));
                    showToast('🔄 10s Skip quota reset to 5/5 for this lecture!', 'success');
                  }}
                  className="text-[10px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
                  title="Reset skip count for demonstration"
                >
                  Reset Quota
                </button>
              </div>
            </div>

            {/* Bottom Interactive Panel */}
            <div className="p-5 bg-slate-950 overflow-y-auto max-h-60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Lecture Description & Faculty
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Delivered by <strong className="text-white">{activePlayerClass.faculty}</strong> on {activePlayerClass.date}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {activePlayerClass.description}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      toggleWatched(activePlayerClass.id);
                    }}
                    className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      watchedClasses.includes(activePlayerClass.id)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{watchedClasses.includes(activePlayerClass.id) ? 'Completed' : 'Mark as Watched'}</span>
                  </button>

                  <button
                    onClick={() => navigate('/student/submissions?tab=editor')}
                    className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    <span>Open Code Sandbox</span>
                  </button>
                </div>
              </div>


              {/* Interactive Timestamps */}
              {activePlayerClass.timestamps && activePlayerClass.timestamps.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    Key Topics & Timeline Segments
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activePlayerClass.timestamps.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2.5 rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-300"
                      >
                        <span className="rounded bg-blue-900/60 text-blue-400 font-mono font-bold px-2 py-0.5 text-[11px]">
                          {t.time}
                        </span>
                        <span className="truncate">{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
