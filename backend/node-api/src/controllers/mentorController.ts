import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';

export const getMentors = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const mentors = await prisma.mentor.findMany({
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        projects: { select: { id: true, title: true, status: true } },
      },
    });
    return res.json({ success: true, data: mentors });
  } catch (error) {
    next(error);
  }
};

export const bookMentorSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.studentId;
    const { mentorId, topic, scheduledAt, duration, notes } = req.body;

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID required.' });
    }

    const session = await prisma.mentorSession.create({
      data: {
        mentorId,
        studentId,
        topic,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 30,
        meetingUrl: 'https://meet.jit.si/EdTechMentorSession-' + Math.random().toString(36).substring(7),
        status: 'SCHEDULED',
        notes,
      },
      include: { mentor: { include: { user: true } } },
    });

    return res.status(201).json({
      success: true,
      message: 'Mentor session booked successfully.',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

export const addMentorFeedback = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const mentorId = req.user?.mentorId;
    const { projectId, submissionId, rating, comments, decision } = req.body;

    const feedback = await prisma.mentorFeedback.create({
      data: {
        mentorId: mentorId || (await prisma.mentor.findFirst())?.id || 'demo-mentor-id',
        projectId,
        submissionId,
        rating: rating || 5,
        comments,
        decision: decision || 'APPROVED',
      },
    });

    if (submissionId) {
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: decision === 'APPROVED' ? 'APPROVED' : 'REVISION_REQUIRED',
        },
      });
    }

    if (projectId) {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          status: decision === 'APPROVED' ? 'ACTIVE' : 'REVISION_REQUIRED',
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Mentor feedback submitted.',
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};
