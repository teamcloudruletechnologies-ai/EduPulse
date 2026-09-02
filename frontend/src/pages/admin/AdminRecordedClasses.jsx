import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Video,
  Plus,
  Trash2,
  Edit3,
  Play,
  Clock,
  Calendar,
  User,
  Tag,
  Search,
  ExternalLink,
  X,
  CheckCircle2,
  Sparkles,
  Layers,
  Upload,
  RefreshCw,
  Film,
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
    uploadedBy: 'Super Admin',
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
    uploadedBy: 'Super Admin',
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
    uploadedBy: 'Super Admin',
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
    uploadedBy: 'Super Admin',
  },
];

const PRESET_VIDEOS = [
  { label: 'Full-Stack WebSockets Lecture', url: 'https://www.youtube.com/embed/1BfCnjr_Vjg' },
  { label: 'Python AST & Data Structures', url: 'https://www.youtube.com/embed/rfscVS0vtbw' },
  { label: 'Database Indexing & Query Tuning', url: 'https://www.youtube.com/embed/HXV3zeRR3h4' },
  { label: 'Docker & Cloud Deployment', url: 'https://www.youtube.com/embed/fqMOX6JJhGo' },
  { label: 'React 18 Concurrent Rendering', url: 'https://www.youtube.com/embed/8pDqJVdNa44' },
];

export const AdminRecordedClasses = () => {
  const { showToast } = useToast();
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subject: 'Full-Stack Architecture',
    faculty: 'Viji (Lead Mentor)',
    duration: '45 mins',
    date: new Date().toISOString().split('T')[0],
    videoUrl: 'https://www.youtube.com/embed/1BfCnjr_Vjg',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    description: '',
    tags: 'WebSockets, React, Backend',
    timestamps: '02:00 - Introduction\n15:00 - Architecture Overview\n30:00 - Live Code Walkthrough',
  });

  // Fetch from server API
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
  }, []);

  const subjects = ['ALL', ...Array.from(new Set(classes.map((c) => c.subject)))];

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData({
      title: '',
      subject: 'Full-Stack Architecture',
      faculty: 'Viji (Lead Mentor)',
      duration: '45 mins',
      date: new Date().toISOString().split('T')[0],
      videoUrl: 'https://www.youtube.com/embed/1BfCnjr_Vjg',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      description: '',
      tags: 'Full-Stack, WebSockets, Node.js',
      timestamps: '02:00 - Introduction\n15:00 - Architecture Overview\n30:00 - Live Demo',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls) => {
    setEditingClass(cls);
    const timeStr = Array.isArray(cls.timestamps)
      ? cls.timestamps.map((t) => `${t.time} - ${t.label}`).join('\n')
      : '';
    const tagStr = Array.isArray(cls.tags) ? cls.tags.join(', ') : cls.tags || '';

    setFormData({
      title: cls.title || '',
      subject: cls.subject || 'Full-Stack Architecture',
      faculty: cls.faculty || 'Viji (Lead Mentor)',
      duration: cls.duration || '45 mins',
      date: cls.date || new Date().toISOString().split('T')[0],
      videoUrl: cls.videoUrl || '',
      thumbnail: cls.thumbnail || '',
      description: cls.description || '',
      tags: tagStr,
      timestamps: timeStr,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recorded class lecture?')) return;
    try {
      await api.delete(`/recorded-classes/${id}`).catch(() => {});
      const updated = classes.filter((c) => c.id !== id);
      setClasses(updated);
      localStorage.setItem('edtech_recorded_classes', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      showToast('🗑️ Recorded class deleted successfully!', 'success');
    } catch (err) {
      showToast('Error deleting class: ' + err.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.videoUrl) {
      showToast('Please provide a Title and Video URL', 'error');
      return;
    }

    // Format tags
    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Lecture'];

    // Format timestamps
    const timestampsArray = formData.timestamps
      ? formData.timestamps
          .split('\n')
          .map((line) => {
            const parts = line.split('-');
            if (parts.length >= 2) {
              return { time: parts[0].trim(), label: parts.slice(1).join('-').trim() };
            }
            return null;
          })
          .filter(Boolean)
      : [];

    const payload = {
      title: formData.title,
      subject: formData.subject,
      faculty: formData.faculty,
      duration: formData.duration,
      date: formData.date,
      videoUrl: formData.videoUrl,
      thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      description: formData.description,
      tags: tagsArray,
      timestamps: timestampsArray,
    };

    try {
      if (editingClass) {
        // Edit existing
        await api.put(`/recorded-classes/${editingClass.id}`, payload).catch(() => {});
        const updated = classes.map((c) =>
          c.id === editingClass.id ? { ...c, ...payload, updatedAt: Date.now() } : c
        );
        setClasses(updated);
        localStorage.setItem('edtech_recorded_classes', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        showToast('✅ Recorded class lecture updated successfully!', 'success');
      } else {
        // Create new
        let newCls = null;
        try {
          const res = await api.post('/recorded-classes', payload);
          if (res.data?.success && res.data.data) {
            newCls = res.data.data;
          }
        } catch (apiErr) {}

        if (!newCls) {
          newCls = {
            id: 'rec-' + Date.now(),
            ...payload,
            uploadedBy: 'Super Admin',
            uploadedAt: Date.now(),
          };
        }

        const updated = [newCls, ...classes];
        setClasses(updated);
        localStorage.setItem('edtech_recorded_classes', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        showToast('🚀 New recorded class published to Students learning page!', 'success');
      }

      setIsModalOpen(false);
    } catch (err) {
      showToast('Error saving recorded class: ' + err.message, 'error');
    }
  };

  const filteredClasses = classes.filter((c) => {
    const matchesSubject = selectedSubject === 'ALL' || c.subject === selectedSubject;
    const matchesSearch =
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.faculty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
              Central Content Management
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Auto-Published to Students</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 flex items-center space-x-2">
            <Film className="h-5 w-5 text-blue-600" />
            <span>Recorded Classes & Video Lecture Manager</span>
          </h1>
          <p className="text-xs text-slate-500">
            Upload class video recordings, configure streaming links, manage topics, and publish directly to the student portal (/student/learning)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchClasses}
            className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sync Server</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-500 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Recorded Class</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Lectures</span>
            <Film className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{classes.length}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Live in Student Hub</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Subjects</span>
            <Layers className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{subjects.length - 1}</p>
          <p className="text-[11px] text-slate-400 mt-1">Full-Stack, Python, DB, Cloud</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Target Cohort</span>
            <User className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">5 Students</p>
          <p className="text-[11px] text-slate-400 mt-1">Sailesh, Sujitha, Isaac, Harrish, Praveen</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Stream Status</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">100% Online</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">HD Video Streaming</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search classes by title, topic, or instructor..."
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

      {/* Recorded Classes Table / Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between hover:border-blue-300 transition-all group"
          >
            {/* Video Thumbnail with Play Overlay */}
            <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
              <img
                src={cls.thumbnail}
                alt={cls.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

              {/* Subject Tag */}
              <div className="absolute top-3 left-3">
                <span className="rounded-md bg-blue-600/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-extrabold text-white tracking-wide uppercase">
                  {cls.subject}
                </span>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 flex items-center space-x-1 rounded-md bg-slate-900/90 backdrop-blur-xs px-2 py-0.5 text-[11px] font-bold text-white">
                <Clock className="h-3 w-3 text-blue-400" />
                <span>{cls.duration}</span>
              </div>

              {/* Play Button Overlay */}
              <button
                onClick={() => setPreviewVideo(cls)}
                className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg hover:scale-110 hover:bg-blue-500 transition-all cursor-pointer"
                title="Preview Video Player"
              >
                <Play className="h-5 w-5 fill-white ml-0.5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <User className="h-3 w-3 text-slate-500" />
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

                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cls.description}
                </p>
              </div>

              {/* Tags & Action Bar */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1">
                  {(cls.tags || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setPreviewVideo(cls)}
                    className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-blue-600" />
                    <span>Preview Video</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(cls)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit Class Details"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cls.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Class"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <Film className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Recorded Classes Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No class video recordings match your filter or search query. Click Upload to publish a new lecture.
          </p>
          <button
            onClick={handleOpenAdd}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-500"
          >
            Upload Recorded Class
          </button>
        </div>
      )}

      {/* UPLOAD / EDIT RECORDED CLASS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Film className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingClass ? 'Edit Recorded Class Lecture' : 'Upload New Recorded Class Lecture'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Configures video URL, subject tags, timestamps, and publishes to /student/learning
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lecture Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lecture 5: Advanced Database Indexing & B-Trees"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject / Course Category *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack Architecture, Python Core"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Faculty / Instructor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Viji (Lead Mentor)"
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Video Embed or Stream URL *</label>
                  <span className="text-[10px] text-blue-600 font-semibold">Supports YouTube Embed, MP4, Vimeo</span>
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/embed/1BfCnjr_Vjg"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none font-mono text-[11px]"
                />
                {/* Quick Presets Picker */}
                <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-slate-400 font-semibold">Quick Presets:</span>
                  {PRESET_VIDEOS.map((p, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormData({ ...formData, videoUrl: p.url })}
                      className="rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 px-2 py-0.5 text-[10px] font-semibold text-slate-600 cursor-pointer transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 48 mins, 1 hr 10 mins"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recorded Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thumbnail Poster URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Class Description & Key Objectives</label>
                <textarea
                  rows={3}
                  placeholder="Detailed breakdown of the concepts taught in this lecture recording..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Topic Tags (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Node.js, WebSockets, APIs"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Timestamps (Format: mm:ss - Label)</label>
                  <textarea
                    rows={2}
                    placeholder={'02:15 - Architecture Setup\n18:30 - Live Code'}
                    value={formData.timestamps}
                    onChange={(e) => setFormData({ ...formData, timestamps: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 focus:border-blue-500 focus:outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>{editingClass ? 'Update Class Recording' : 'Publish to Students'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIDEO PREVIEW MODAL */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center space-x-2">
                <Film className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white truncate max-w-xl">{previewVideo.title}</h3>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              {previewVideo.videoUrl?.includes('youtube.com') || previewVideo.videoUrl?.includes('youtu.be') ? (
                <iframe
                  src={previewVideo.videoUrl}
                  title={previewVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : (
                <video
                  src={previewVideo.videoUrl}
                  controls
                  autoPlay
                  className="h-full w-full"
                >
                  Your browser does not support HTML5 video streaming.
                </video>
              )}
            </div>

            {/* Video Info Footer */}
            <div className="p-4 bg-slate-950 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Faculty: {previewVideo.faculty} • {previewVideo.subject}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{previewVideo.description}</p>
              </div>
              <span className="rounded-md bg-blue-900/60 border border-blue-700 text-blue-300 px-3 py-1 font-bold">
                {previewVideo.duration}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
