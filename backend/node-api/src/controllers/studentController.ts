import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { pythonClient } from '../utils/pythonClient';

export const getStudentDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.studentId || req.params.studentId;

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID required.' });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        institution: true,
        program: true,
        batch: true,
        learningProgress: { include: { course: true } },
        projects: { include: { tasks: true, mentor: { include: { user: true } } } },
        achievements: { include: { achievement: true } },
        certificates: true,
        mentorSessions: {
          where: { scheduledAt: { gte: new Date() } },
          include: { mentor: { include: { user: true } } },
          orderBy: { scheduledAt: 'asc' },
          take: 3,
        },
      },
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Call Python FastAPI service for AI progress analysis
    let aiAnalytics = null;
    try {
      const pythonRes = await pythonClient.post('/analytics/student-progress', {
        student_id: student.id,
        courses_enrolled: student.learningProgress.length || 1,
        courses_completed: student.learningProgress.filter((lp) => lp.completed).length,
        total_quizzes_taken: 5,
        quiz_scores: [85, 90, 78, 92, 88],
        tasks_completed: student.projects.flatMap((p) => p.tasks).filter((t) => t.status === 'COMPLETED').length,
        total_tasks_assigned: student.projects.flatMap((p) => p.tasks).length || 1,
        study_hours_weekly: 14.5,
      });
      aiAnalytics = pythonRes.data;
    } catch (err) {
      console.warn('Python FastAPI microservice warning:', (err as Error).message);
    }

    return res.json({
      success: true,
      data: {
        student,
        aiAnalytics,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentsList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        institution: { select: { name: true, code: true } },
        program: { select: { name: true } },
        learningProgress: true,
        projects: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};
