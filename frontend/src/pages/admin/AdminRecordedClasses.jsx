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
  HelpCircle,
  MessageSquare,
  Send,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Code2,
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

const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    lectureId: 'rec-1',
    subject: 'Full-Stack Architecture',
    question: 'How do we handle WebSocket reconnects when internet drops unexpectedly?',
    answer: 'Implement an exponential backoff reconnection strategy on the client. For example, retry after 1s, 2s, 4s, 8s up to 30s max, and use a heartbeat ping/pong every 15 seconds to detect dead TCP sockets.',
    codeSnippet: `const connectWebSocket = (retryDelay = 1000) => {\n  const ws = new WebSocket('wss://api.edupulse.com');\n  ws.onclose = () => {\n    setTimeout(() => connectWebSocket(Math.min(retryDelay * 2, 30000)), retryDelay);\n  };\n};`,
    upvotes: 14,
    author: 'Admin Faculty',
  },
  {
    id: 'faq-2',
    lectureId: 'rec-2',
    subject: 'Python Core & Compilers',
    question: 'What is the difference between ast.parse() and eval() in Python security?',
    answer: 'eval() executes the code string immediately in the runtime, which is dangerous if untrusted. ast.parse() only builds a syntax tree structure in memory without executing any instructions, allowing full security inspection before running.',
    codeSnippet: `import ast\n# Safe inspection without execution\ntree = ast.parse("x = 10 + 20")\nprint([node.__class__.__name__ for node in tree.body])`,
    upvotes: 19,
    author: 'Admin Faculty',
  },
  {
    id: 'faq-3',
    lectureId: 'rec-3',
    subject: 'Database Engineering',
    question: 'When should we use Composite Indexes vs Single Column Indexes in MySQL?',
    answer: 'Use Composite Indexes (ColumnA, ColumnB) when queries frequently filter on both columns in the WHERE clause, adhering to the Leftmost Prefix Rule.',
    codeSnippet: `CREATE INDEX idx_user_status ON submissions (userId, status);`,
    upvotes: 23,
    author: 'Admin Faculty',
  },
];

const DEFAULT_DOUBTS = [
  {
    id: 'dbt-1',
    lectureId: 'rec-1',
    lectureTitle: 'Lecture 1: High-Concurrency WebSockets & Real-Time Signaling',
    studentName: 'Sailesh',
    studentEmail: 'sailesh@edtech.com',
    studentRoll: 'CS2026-042',
    timestamp: '14:30',
    question: 'Why do we need a STUN server in WebRTC if both clients are already connected to the WebSocket signaling server?',
    status: 'ANSWERED',
    mentorReply: 'Great question Sailesh! The WebSocket signaling server only exchanges SDP offers and ICE candidates. However, real client IP addresses are often behind NAT/firewalls. The STUN server helps each client discover its public IP and port so direct P2P media streaming can happen without passing video through the central server.',
    repliedBy: 'Viji (Lead Mentor)',
    repliedAt: '1 hour ago',
  },
  {
    id: 'dbt-3',
    lectureId: 'rec-2',
    lectureTitle: 'Lecture 2: Python Memory Management, AST Parsing & Custom Sandbox',
    studentName: 'Isaac',
    studentEmail: 'isaac@edtech.com',
    studentRoll: 'CS2026-029',
    timestamp: '34:50',
    question: 'Can a student bypass the Python exec() sandbox by importing os or sys modules?',
    status: 'PENDING',
    mentorReply: null,
    repliedBy: null,
    repliedAt: null,
  },
];

export const AdminRecordedClasses = () => {
  const { showToast } = useToast();
  const [activeAdminTab, setActiveAdminTab] = useState('CLASSES'); // 'CLASSES' | 'FAQS' | 'DOUBTS'

  // Classes State
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

  // FAQs State
  const [faqs, setFaqs] = useState(() => {
    const saved = localStorage.getItem('edtech_shared_faqs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return DEFAULT_FAQS;
  });

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqFormData, setFaqFormData] = useState({
    lectureId: 'all',
    subject: 'Full-Stack Architecture',
    question: '',
    answer: '',
    codeSnippet: '',
  });

  // Doubts State
  const [doubts, setDoubts] = useState(() => {
    const saved = localStorage.getItem('edtech_shared_doubts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return DEFAULT_DOUBTS;
  });
  const [activeReplyDoubt, setActiveReplyDoubt] = useState(null);
  const [replyText, setReplyText] = useState('');

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

  const fetchClasses = async () => {
    try {
      const res = await api.get('/recorded-classes');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setClasses(res.data.data);
        localStorage.setItem('edtech_recorded_classes', JSON.stringify(res.data.data));
      }
    } catch (err) {}
  };

  const fetchFaqs = async () => {
    try {
      const res = await api.get('/lecture-faqs');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setFaqs(res.data.data);
        localStorage.setItem('edtech_shared_faqs', JSON.stringify(res.data.data));
      }
    } catch (err) {}
  };

  const fetchDoubts = async () => {
    try {
      const res = await api.get('/lecture-doubts');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setDoubts(res.data.data);
        localStorage.setItem('edtech_shared_doubts', JSON.stringify(res.data.data));
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchClasses();
    fetchFaqs();
    fetchDoubts();

    const handleStorageChange = (e) => {
      if (e.key === 'edtech_recorded_classes') {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setClasses(parsed);
        } catch (err) {}
      }
      if (e.key === 'edtech_shared_faqs') {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setFaqs(parsed);
        } catch (err) {}
      }
      if (e.key === 'edtech_shared_doubts') {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setDoubts(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const subjects = ['ALL', ...Array.from(new Set(classes.map((c) => c.subject)))];

  const handleOpenAddClass = () => {
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

  const handleOpenEditClass = (cls) => {
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

  const handleDeleteClass = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recorded class?')) return;
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

  const handleSubmitClass = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.videoUrl) {
      showToast('Please provide a Title and Video URL', 'error');
      return;
    }

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Lecture'];

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
        await api.put(`/recorded-classes/${editingClass.id}`, payload).catch(() => {});
        const updated = classes.map((c) =>
          c.id === editingClass.id ? { ...c, ...payload, updatedAt: Date.now() } : c
        );
        setClasses(updated);
        localStorage.setItem('edtech_recorded_classes', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        showToast('✅ Recorded class updated successfully!', 'success');
      } else {
        let newCls = null;
        try {
          const res = await api.post('/recorded-classes', payload);
          if (res.data?.success && res.data.data) newCls = res.data.data;
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

  // FAQ Handlers
  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqFormData({
      lectureId: 'all',
      subject: 'Full-Stack Architecture',
      question: '',
      answer: '',
      codeSnippet: '',
    });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (faq) => {
    setEditingFaq(faq);
    setFaqFormData({
      lectureId: faq.lectureId || 'all',
      subject: faq.subject || 'Full-Stack Architecture',
      question: faq.question || '',
      answer: faq.answer || '',
      codeSnippet: faq.codeSnippet || '',
    });
    setIsFaqModalOpen(true);
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Delete this Most Asked Question?')) return;
    try {
      await api.delete(`/lecture-faqs/${id}`).catch(() => {});
      const updated = faqs.filter((f) => f.id !== id);
      setFaqs(updated);
      localStorage.setItem('edtech_shared_faqs', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      showToast('🗑️ FAQ removed successfully!', 'success');
    } catch (err) {}
  };

  const handleSubmitFaq = async (e) => {
    e.preventDefault();
    if (!faqFormData.question || !faqFormData.answer) {
      showToast('Please provide both Question and Answer', 'error');
      return;
    }

    const payload = { ...faqFormData, author: 'Admin Faculty' };

    try {
      if (editingFaq) {
        await api.put(`/lecture-faqs/${editingFaq.id}`, payload).catch(() => {});
        const updated = faqs.map((f) => (f.id === editingFaq.id ? { ...f, ...payload } : f));
        setFaqs(updated);
        localStorage.setItem('edtech_shared_faqs', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        showToast('✅ FAQ updated successfully!', 'success');
      } else {
        const newFaq = {
          id: 'faq-' + Date.now(),
          ...payload,
          upvotes: 0,
          createdAt: Date.now(),
        };
        await api.post('/lecture-faqs', newFaq).catch(() => {});
        const updated = [newFaq, ...faqs];
        setFaqs(updated);
        localStorage.setItem('edtech_shared_faqs', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        showToast('🚀 New Most Asked Question published to Student Video Hub!', 'success');
      }
      setIsFaqModalOpen(false);
    } catch (err) {
      showToast('Error saving FAQ: ' + err.message, 'error');
    }
  };

  // Doubt Reply Handler
  const handleReplyDoubt = async (e) => {
    e.preventDefault();
    if (!activeReplyDoubt || !replyText.trim()) return;

    try {
      await api.post(`/lecture-doubts/${activeReplyDoubt.id}/reply`, {
        reply: replyText.trim(),
        repliedBy: 'Viji (Lead Mentor)',
      }).catch(() => {});

      const updated = doubts.map((d) =>
        d.id === activeReplyDoubt.id
          ? {
              ...d,
              mentorReply: replyText.trim(),
              repliedBy: 'Viji (Lead Mentor)',
              status: 'ANSWERED',
              repliedAt: 'Just now',
            }
          : d
      );
      setDoubts(updated);
      localStorage.setItem('edtech_shared_doubts', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      showToast('✅ Mentor answer posted! Student can see it in video discussion.', 'success');
      setActiveReplyDoubt(null);
      setReplyText('');
    } catch (err) {
      showToast('Error posting reply: ' + err.message, 'error');
    }
  };

  const filteredClasses = classes.filter((c) => {
    const matchesSubject = selectedSubject === 'ALL' || c.subject === selectedSubject;
    const matchesSearch =
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.faculty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
              Central Content & Discussion Control
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Auto-Published to Students</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 flex items-center space-x-2">
            <Film className="h-5 w-5 text-blue-600" />
            <span>Recorded Classes, Doubts & Dynamic FAQ Manager</span>
          </h1>
          <p className="text-xs text-slate-500">
            Upload class video recordings, manage dynamic Most Asked Questions (FAQs), and resolve student in-video doubts
          </p>
        </div>

        {/* Tab Switcher in Header */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 space-x-1">
          <button
            onClick={() => setActiveAdminTab('CLASSES')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeAdminTab === 'CLASSES'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>Recorded Classes ({classes.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('FAQS')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeAdminTab === 'FAQS'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Dynamic FAQs ({faqs.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('DOUBTS')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeAdminTab === 'DOUBTS'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Student Doubts ({doubts.filter((d) => d.status === 'PENDING').length} Pending)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: RECORDED CLASSES MANAGEMENT */}
      {activeAdminTab === 'CLASSES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search lectures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>
            <button
              onClick={handleOpenAddClass}
              className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-500 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Upload Recorded Class</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-44 w-full bg-slate-900">
                  <img src={cls.thumbnail} alt={cls.title} className="h-full w-full object-cover opacity-90" />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                      {cls.subject}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-md bg-slate-900/90 px-2 py-0.5 text-[11px] font-bold text-white">
                    {cls.duration}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] text-slate-400 font-semibold">{cls.faculty} • {cls.date}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{cls.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cls.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setPreviewVideo(cls)}
                      className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5 fill-blue-600" />
                      <span>Preview</span>
                    </button>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEditClass(cls)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 cursor-pointer"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC MOST ASKED QUESTIONS (FAQS) MANAGER */}
      {activeAdminTab === 'FAQS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dynamic Most Asked Questions (FAQ) Library</h3>
              <p className="text-xs text-slate-500">
                Create and manage frequently asked questions that appear inside the video player for students
              </p>
            </div>
            <button
              onClick={handleOpenAddFaq}
              className="flex items-center space-x-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-purple-500 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Most Asked Question</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="rounded bg-purple-100 text-purple-800 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                      {faq.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      👍 {faq.upvotes || 0} Student Upvotes
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditFaq(faq)}
                      className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-900">{faq.question}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>

                {faq.codeSnippet && (
                  <pre className="rounded-xl bg-slate-900 text-emerald-400 p-3 font-mono text-[10px] overflow-x-auto">
                    {faq.codeSnippet}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT IN-VIDEO DOUBTS & MENTOR REPLIES */}
      {activeAdminTab === 'DOUBTS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student In-Video Doubts Queue</h3>
              <p className="text-xs text-slate-500">
                Review questions asked by students inside recorded lectures and post verified mentor answers
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              {doubts.length} Total Questions
            </span>
          </div>

          <div className="space-y-3">
            {doubts.map((dbt) => (
              <div key={dbt.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {dbt.studentName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {dbt.studentName} <span className="text-slate-400 font-normal">({dbt.studentRoll})</span>
                      </h4>
                      <span className="text-[10px] text-blue-600 font-semibold">
                        Lecture: {dbt.lectureTitle || dbt.lectureId} • ⏱️ Timestamp: {dbt.timestamp}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold ${
                      dbt.status === 'ANSWERED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {dbt.status === 'ANSWERED' ? '✅ Answered' : '⏳ Pending Answer'}
                  </span>
                </div>

                <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                  "{dbt.question}"
                </p>

                {dbt.mentorReply ? (
                  <div className="rounded-xl bg-emerald-50/60 border border-emerald-200 p-3 text-xs space-y-1">
                    <span className="font-extrabold text-emerald-900 flex items-center space-x-1">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
                      <span>{dbt.repliedBy || 'Mentor'} Verified Answer:</span>
                    </span>
                    <p className="text-emerald-950 text-[11px] leading-relaxed">{dbt.mentorReply}</p>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setActiveReplyDoubt(dbt);
                        setReplyText('');
                      }}
                      className="flex items-center space-x-1 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1.5 text-xs font-bold shadow-xs cursor-pointer"
                    >
                      <Send className="h-3 w-3" />
                      <span>Reply to Student</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT FAQ */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingFaq ? 'Edit Most Asked Question' : 'Add Dynamic Most Asked Question (FAQ)'}
              </h3>
              <button onClick={() => setIsFaqModalOpen(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitFaq} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject / Category *</label>
                <input
                  type="text"
                  required
                  value={faqFormData.subject}
                  onChange={(e) => setFaqFormData({ ...faqFormData, subject: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:outline-none"
                  placeholder="e.g. Full-Stack Architecture, Python Core"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Title *</label>
                <input
                  type="text"
                  required
                  value={faqFormData.question}
                  onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:outline-none"
                  placeholder="e.g. How to prevent memory leaks in WebSocket listeners?"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Answer / Explanation *</label>
                <textarea
                  rows={3}
                  required
                  value={faqFormData.answer}
                  onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:outline-none"
                  placeholder="Explain the solution step-by-step..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Code Snippet (Optional)</label>
                <textarea
                  rows={2}
                  value={faqFormData.codeSnippet}
                  onChange={(e) => setFaqFormData({ ...faqFormData, codeSnippet: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-[11px] focus:outline-none"
                  placeholder="const example = () => { ... }"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="rounded-xl border px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2 font-bold text-white shadow"
                >
                  {editingFaq ? 'Save Changes' : 'Publish FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REPLY TO STUDENT DOUBT */}
      {activeReplyDoubt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Post Mentor Answer to Student Doubt</h3>
              <button onClick={() => setActiveReplyDoubt(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
              <p className="font-bold text-slate-900">{activeReplyDoubt.studentName} ({activeReplyDoubt.studentRoll})</p>
              <p className="text-slate-600 mt-1 italic">"{activeReplyDoubt.question}"</p>
            </div>

            <form onSubmit={handleReplyDoubt} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mentor Verified Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Provide technical solution and concept explanation..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveReplyDoubt(null)}
                  className="rounded-xl border px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-700 hover:bg-emerald-800 px-5 py-2 font-bold text-white shadow flex items-center space-x-1"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Answer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD / EDIT CLASS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingClass ? 'Edit Recorded Class Lecture' : 'Upload New Recorded Class Lecture'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lecture Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lecture 5: Advanced Database Indexing & B-Trees"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Faculty *</label>
                  <input
                    type="text"
                    required
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Video Stream URL *</label>
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-[11px] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recorded Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Class Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white shadow hover:bg-blue-500"
                >
                  {editingClass ? 'Update Class' : 'Publish Class'}
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
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white truncate">{previewVideo.title}</h3>
              <button onClick={() => setPreviewVideo(null)} className="rounded-lg p-1.5 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              {previewVideo.videoUrl?.includes('youtube.com') || previewVideo.videoUrl?.includes('youtu.be') ? (
                <iframe src={previewVideo.videoUrl} title={previewVideo.title} allowFullScreen className="h-full w-full border-0" />
              ) : (
                <video src={previewVideo.videoUrl} controls autoPlay className="h-full w-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
