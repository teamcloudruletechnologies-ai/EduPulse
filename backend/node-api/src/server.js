const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const institutionRoutes = require('./routes/institutionRoutes');
const studentRoutes = require('./routes/studentRoutes');
const parentRoutes = require('./routes/parentRoutes');
const learningRoutes = require('./routes/learningRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
if (userRoutes) app.use('/api/users', userRoutes);
if (institutionRoutes) app.use('/api/institutions', institutionRoutes);
if (studentRoutes) app.use('/api/students', studentRoutes);
if (parentRoutes) app.use('/api/parents', parentRoutes);
if (learningRoutes) app.use('/api/learning', learningRoutes);
if (projectRoutes) app.use('/api/projects', projectRoutes);
if (taskRoutes) app.use('/api/tasks', taskRoutes);
if (mentorRoutes) app.use('/api/mentors', mentorRoutes);
if (submissionRoutes) app.use('/api/submissions', submissionRoutes);
if (achievementRoutes) app.use('/api/achievements', achievementRoutes);
if (certificateRoutes) app.use('/api/certificates', certificateRoutes);
if (notificationRoutes) app.use('/api/notifications', notificationRoutes);
if (analyticsRoutes) app.use('/api/analytics', analyticsRoutes);
if (messageRoutes) app.use('/api/messages', messageRoutes);

// In-Memory WebRTC Signaling Store for EduPulse Native Meeting Rooms
const meetingSignals = new Map();

app.post('/api/meetings/signal', (req, res) => {
  try {
    const { roomId, sender, type, payload } = req.body;
    if (!roomId) return res.status(400).json({ error: 'roomId required' });

    if (!meetingSignals.has(roomId)) {
      meetingSignals.set(roomId, { participants: new Set(), signals: [] });
    }

    const room = meetingSignals.get(roomId);
    if (sender) room.participants.add(sender);

    const signalMsg = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      sender,
      type,
      payload,
      timestamp: Date.now(),
    };

    room.signals.push(signalMsg);

    // Keep last 150 signals to keep memory tiny
    if (room.signals.length > 150) {
      room.signals = room.signals.slice(-150);
    }

    return res.json({ success: true, timestamp: signalMsg.timestamp });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/meetings/signals/:roomId', (req, res) => {
  try {
    const { roomId } = req.params;
    const since = parseInt(req.query.since || '0', 10);
    const sender = req.query.sender || '';

    if (!meetingSignals.has(roomId)) {
      return res.json({ success: true, signals: [], participants: [] });
    }

    const room = meetingSignals.get(roomId);
    const newSignals = room.signals.filter(
      (s) => s.timestamp > since && (!sender || s.sender !== sender)
    );

    return res.json({
      success: true,
      signals: newSignals,
      participants: Array.from(room.participants),
      serverTime: Date.now(),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'EdTech Main REST API (Node.js + Express JS)',
    timestamp: new Date().toISOString(),
  });
});

// ─── Paste Lock (Anti-Cheat) API ─────────────────────────────────────────────
// Mentor calls PUT to lock/unlock. Students poll GET every 4 seconds.
let pasteLockState = { locked: true, updatedAt: Date.now(), updatedBy: 'system' };

app.get('/api/settings/paste-lock', (req, res) => {
  res.json({ success: true, ...pasteLockState });
});

app.put('/api/settings/paste-lock', (req, res) => {
  const { locked, updatedBy } = req.body;
  if (typeof locked !== 'boolean') {
    return res.status(400).json({ error: '"locked" must be a boolean' });
  }
  pasteLockState = { locked, updatedAt: Date.now(), updatedBy: updatedBy || 'mentor' };
  return res.json({ success: true, ...pasteLockState });
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── Recorded Classes Management API ──────────────────────────────────────────

// Admin uploads/edits/deletes recorded class lectures. Students stream & view them in /student/learning.
let recordedClasses = [
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
    uploadedAt: Date.now() - 86400000,
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
    uploadedAt: Date.now() - 172800000,
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
    uploadedAt: Date.now() - 259200000,
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
    uploadedAt: Date.now() - 345600000,
  },
];

app.get('/api/recorded-classes', (req, res) => {
  res.json({ success: true, data: recordedClasses });
});

app.post('/api/recorded-classes', (req, res) => {
  const { title, subject, faculty, duration, date, videoUrl, thumbnail, description, tags, timestamps } = req.body;
  if (!title || !videoUrl) {
    return res.status(400).json({ error: 'Title and Video URL are required' });
  }

  const newClass = {
    id: 'rec-' + Date.now(),
    title,
    subject: subject || 'General Engineering',
    faculty: faculty || 'Admin Faculty',
    duration: duration || '45 mins',
    date: date || new Date().toISOString().split('T')[0],
    videoUrl,
    thumbnail: thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    description: description || 'Recorded classroom lecture uploaded by Admin.',
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : ['Class Lecture']),
    timestamps: Array.isArray(timestamps) ? timestamps : [],
    uploadedBy: 'Super Admin',
    uploadedAt: Date.now(),
  };

  recordedClasses.unshift(newClass);
  return res.status(201).json({ success: true, data: newClass });
});

app.put('/api/recorded-classes/:id', (req, res) => {
  const { id } = req.params;
  const index = recordedClasses.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Recorded class not found' });
  }

  recordedClasses[index] = {
    ...recordedClasses[index],
    ...req.body,
    updatedAt: Date.now(),
  };

  return res.json({ success: true, data: recordedClasses[index] });
});

app.delete('/api/recorded-classes/:id', (req, res) => {
  const { id } = req.params;
  recordedClasses = recordedClasses.filter((c) => c.id !== id);
  return res.json({ success: true, message: 'Class deleted successfully' });
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── In-Video Doubts & Discussion API ─────────────────────────────────────────
// Students ask questions inside the video player (with timestamp). Mentors/Admins reply anytime.
let lectureDoubts = [
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
    repliedAt: Date.now() - 3600000,
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'dbt-2',
    lectureId: 'rec-1',
    lectureTitle: 'Lecture 1: High-Concurrency WebSockets & Real-Time Signaling',
    studentName: 'Sujitha',
    studentEmail: 'sujitha@edtech.com',
    studentRoll: 'CS2026-018',
    timestamp: '28:45',
    question: 'How does BroadcastChannel differ from WebSocket for multi-tab communication?',
    status: 'ANSWERED',
    mentorReply: 'BroadcastChannel is purely browser-local across same-origin tabs on the same computer without any network requests. WebSockets connect over the internet to the central server so different users on different PCs can communicate.',
    repliedBy: 'Viji (Lead Mentor)',
    repliedAt: Date.now() - 1800000,
    createdAt: Date.now() - 3600000,
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
    createdAt: Date.now() - 900000,
  },
];

app.get('/api/lecture-doubts', (req, res) => {
  const { lectureId } = req.query;
  if (lectureId) {
    const filtered = lectureDoubts.filter((d) => d.lectureId === lectureId);
    return res.json({ success: true, data: filtered });
  }
  return res.json({ success: true, data: lectureDoubts });
});

app.post('/api/lecture-doubts', (req, res) => {
  const { lectureId, lectureTitle, studentName, studentEmail, studentRoll, timestamp, question } = req.body;
  if (!lectureId || !question) {
    return res.status(400).json({ error: 'lectureId and question are required' });
  }

  const newDoubt = {
    id: 'dbt-' + Date.now(),
    lectureId,
    lectureTitle: lectureTitle || 'Recorded Class Lecture',
    studentName: studentName || 'Student',
    studentEmail: studentEmail || 'student@edtech.com',
    studentRoll: studentRoll || 'CS2026',
    timestamp: timestamp || '00:00',
    question,
    status: 'PENDING',
    mentorReply: null,
    repliedBy: null,
    repliedAt: null,
    createdAt: Date.now(),
  };

  lectureDoubts.unshift(newDoubt);
  return res.status(201).json({ success: true, data: newDoubt });
});

app.post('/api/lecture-doubts/:id/reply', (req, res) => {
  const { id } = req.params;
  const { reply, repliedBy } = req.body;
  if (!reply) {
    return res.status(400).json({ error: 'Reply text is required' });
  }

  const index = lectureDoubts.findIndex((d) => d.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Doubt not found' });
  }

  lectureDoubts[index] = {
    ...lectureDoubts[index],
    mentorReply: reply,
    repliedBy: repliedBy || 'Viji (Lead Mentor)',
    repliedAt: Date.now(),
    status: 'ANSWERED',
  };

  return res.json({ success: true, data: lectureDoubts[index] });
});

app.delete('/api/lecture-doubts/:id', (req, res) => {
  const { id } = req.params;
  lectureDoubts = lectureDoubts.filter((d) => d.id !== id);
  return res.json({ success: true, message: 'Doubt deleted successfully' });
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── Dynamic Most Asked Questions (FAQ) API ──────────────────────────────────
// Admin can dynamically create, update, and delete FAQs for lectures.
let lectureFaqs = [
  {
    id: 'faq-1',
    lectureId: 'rec-1',
    subject: 'Full-Stack Architecture',
    question: 'How do we handle WebSocket reconnects when internet drops unexpectedly?',
    answer: 'Implement an exponential backoff reconnection strategy on the client. For example, retry after 1s, 2s, 4s, 8s up to 30s max, and use a heartbeat ping/pong every 15 seconds to detect dead TCP sockets.',
    codeSnippet: `const connectWebSocket = (retryDelay = 1000) => {\n  const ws = new WebSocket('wss://api.edupulse.com');\n  ws.onclose = () => {\n    setTimeout(() => connectWebSocket(Math.min(retryDelay * 2, 30000)), retryDelay);\n  };\n};`,
    upvotes: 14,
    author: 'Admin Faculty',
    createdAt: Date.now() - 172800000,
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
    createdAt: Date.now() - 259200000,
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
    createdAt: Date.now() - 345600000,
  },
  {
    id: 'faq-4',
    lectureId: 'rec-4',
    subject: 'Cloud & Infrastructure',
    question: 'Why should we avoid running Docker containers as root in production?',
    answer: 'Running containers as root poses a major security risk. If an attacker exploits a container escape vulnerability, they gain root access on the host VM.',
    codeSnippet: `FROM node:20-alpine\nUSER node\nCMD ["node", "server.js"]`,
    upvotes: 12,
    author: 'Admin Faculty',
    createdAt: Date.now() - 432000000,
  },
];

app.get('/api/lecture-faqs', (req, res) => {
  const { lectureId } = req.query;
  if (lectureId) {
    const filtered = lectureFaqs.filter((f) => f.lectureId === lectureId || f.lectureId === 'all');
    return res.json({ success: true, data: filtered });
  }
  return res.json({ success: true, data: lectureFaqs });
});

app.post('/api/lecture-faqs', (req, res) => {
  const { lectureId, subject, question, answer, codeSnippet, author } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and Answer are required' });
  }

  const newFaq = {
    id: 'faq-' + Date.now(),
    lectureId: lectureId || 'all',
    subject: subject || 'General',
    question,
    answer,
    codeSnippet: codeSnippet || '',
    upvotes: 0,
    author: author || 'Admin Faculty',
    createdAt: Date.now(),
  };

  lectureFaqs.unshift(newFaq);
  return res.status(201).json({ success: true, data: newFaq });
});

app.put('/api/lecture-faqs/:id', (req, res) => {
  const { id } = req.params;
  const index = lectureFaqs.findIndex((f) => f.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'FAQ not found' });
  }

  lectureFaqs[index] = {
    ...lectureFaqs[index],
    ...req.body,
    updatedAt: Date.now(),
  };

  return res.json({ success: true, data: lectureFaqs[index] });
});

app.delete('/api/lecture-faqs/:id', (req, res) => {
  const { id } = req.params;
  lectureFaqs = lectureFaqs.filter((f) => f.id !== id);
  return res.json({ success: true, message: 'FAQ deleted successfully' });
});

app.post('/api/lecture-faqs/:id/upvote', (req, res) => {
  const { id } = req.params;
  const faq = lectureFaqs.find((f) => f.id === id);
  if (!faq) return res.status(404).json({ error: 'FAQ not found' });
  faq.upvotes = (faq.upvotes || 0) + 1;
  return res.json({ success: true, upvotes: faq.upvotes });
});
// ─────────────────────────────────────────────────────────────────────────────





// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 EdTech Node.js REST API Server running on port ${PORT} (JavaScript Mode)`);
  console.log(`📡 Connected Python microservice: ${process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'}`);
});

module.exports = app;
