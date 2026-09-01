import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import institutionRoutes from './routes/institutionRoutes';
import studentRoutes from './routes/studentRoutes';
import parentRoutes from './routes/parentRoutes';
import learningRoutes from './routes/learningRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import mentorRoutes from './routes/mentorRoutes';
import submissionRoutes from './routes/submissionRoutes';
import achievementRoutes from './routes/achievementRoutes';
import certificateRoutes from './routes/certificateRoutes';
import notificationRoutes from './routes/notificationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import messageRoutes from './routes/messageRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'EdTech Main REST API (Node.js + Express)',
    timestamp: new Date().isoformat(),
  });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 EdTech Node.js REST API Server running on port ${PORT}`);
  console.log(`📡 Connected Python microservice: ${process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'}`);
});

export default app;
