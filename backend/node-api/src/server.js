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




// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 EdTech Node.js REST API Server running on port ${PORT} (JavaScript Mode)`);
  console.log(`📡 Connected Python microservice: ${process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'}`);
});

module.exports = app;
