import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, title, description, priority, deadline } = req.body;

    const task = await prisma.projectTask.create({
      data: {
        projectId,
        title,
        description,
        priority: priority || 'MEDIUM',
        deadline: deadline ? new Date(deadline) : null,
        status: 'PENDING',
      },
    });

    return res.status(201).json({ success: true, message: 'Task created.', data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const studentId = req.user?.studentId;

    const task = await prisma.projectTask.update({
      where: { id },
      data: { status },
    });

    if (studentId) {
      await prisma.taskProgress.create({
        data: {
          taskId: id,
          studentId,
          status,
          notes,
        },
      });
    }

    return res.json({ success: true, message: `Task status updated to ${status}.`, data: task });
  } catch (error) {
    next(error);
  }
};
