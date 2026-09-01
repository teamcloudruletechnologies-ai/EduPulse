import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';

export const getCourses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true,
            quizzes: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            lessons: { orderBy: { orderIndex: 'asc' } },
            quizzes: { include: { questions: true } },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    return res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

export const submitQuizAttempt = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.studentId;
    const { quizId, answers, score } = req.body;

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student identity required to record quiz score.' });
    }

    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    const passed = score >= quiz.passMarks;

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        studentId,
        score,
        passed,
        answers: JSON.stringify(answers || {}),
      },
    });

    // Check achievement trigger
    if (passed) {
      const ach = await prisma.achievement.findFirst({ where: { title: 'Quiz Whiz' } });
      if (ach) {
        await prisma.studentAchievement.upsert({
          where: { studentId_achievementId: { studentId, achievementId: ach.id } },
          create: { studentId, achievementId: ach.id },
          update: {},
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: passed ? 'Congratulations! Quiz passed.' : 'Quiz completed. Keep reviewing and try again.',
      data: attempt,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLearningProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.studentId;
    const { courseId, progressPct } = req.body;

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID required.' });
    }

    const completed = progressPct >= 100.0;

    const record = await prisma.learningProgress.upsert({
      where: { studentId_courseId: { studentId, courseId } },
      create: { studentId, courseId, progressPct, completed },
      update: { progressPct, completed },
    });

    return res.json({ success: true, message: 'Learning progress saved.', data: record });
  } catch (error) {
    next(error);
  }
};
