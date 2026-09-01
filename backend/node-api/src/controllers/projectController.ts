import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.studentId;
    const { title, description, problemStatement, objectives, techStack, mentorId, status } = req.body;

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID required.' });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        problemStatement,
        objectives,
        techStack,
        creatorId: studentId,
        mentorId: mentorId || null,
        status: status || 'PENDING_REVIEW',
        members: {
          create: {
            studentId,
            role: 'LEADER',
          },
        },
      },
      include: {
        creator: { include: { user: true } },
        mentor: { include: { user: true } },
        members: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Project created/submitted successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        creator: { include: { user: true } },
        mentor: { include: { user: true } },
        tasks: true,
        submissions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        creator: { include: { user: true } },
        mentor: { include: { user: true } },
        members: { include: { student: { include: { user: true } } } },
        tasks: { include: { submissions: true } },
        submissions: { include: { versions: true, feedbacks: true } },
        feedbacks: { include: { mentor: { include: { user: true } } } },
      },
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    return res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProjectStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, mentorId } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        status,
        ...(mentorId && { mentorId }),
      },
    });

    return res.json({ success: true, message: `Project status updated to ${status}.`, data: project });
  } catch (error) {
    next(error);
  }
};
