import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';

export const getAchievements = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const list = await prisma.achievement.findMany();
    return res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

export const getStudentAchievements = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.params.studentId || req.user?.studentId;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID required.' });
    }

    const list = await prisma.studentAchievement.findMany({
      where: { studentId },
      include: { achievement: true },
      orderBy: { earnedAt: 'desc' },
    });

    return res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};
