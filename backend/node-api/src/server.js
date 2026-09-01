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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'EdTech Main REST API (Node.js + Express JS)',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 EdTech Node.js REST API Server running on port ${PORT} (JavaScript Mode)`);
  console.log(`📡 Connected Python microservice: ${process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'}`);
});

module.exports = app;
