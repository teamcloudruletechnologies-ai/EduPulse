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



// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 EdTech Node.js REST API Server running on port ${PORT} (JavaScript Mode)`);
  console.log(`📡 Connected Python microservice: ${process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'}`);
});

module.exports = app;
