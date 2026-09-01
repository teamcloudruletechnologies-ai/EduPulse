const { prisma } = require('../utils/prisma');

const createTask = async (req, res, next) => {
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

const updateTaskStatus = async (req, res, next) => {
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

module.exports = {
  createTask,
  updateTaskStatus,
};
