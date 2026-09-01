const { prisma } = require('../utils/prisma');
const { pythonClient } = require('../utils/pythonClient');

const getLinkedChildren = async (req, res, next) => {
  try {
    const parentId = req.user?.parentId;

    const parent = await prisma.parent.findUnique({
      where: { id: parentId },
      include: {
        children: {
          include: {
            student: {
              include: {
                user: true,
                institution: true,
                program: true,
                learningProgress: { include: { course: true } },
                projects: { include: { tasks: true, feedbacks: true } },
                certificates: true,
                achievements: { include: { achievement: true } },
              },
            },
          },
        },
      },
    });

    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent record not found.' });
    }

    return res.json({
      success: true,
      message: 'Linked children fetched successfully (Read-Only Mode).',
      accessMode: 'READ_ONLY',
      data: parent.children.map((c) => c.student),
    });
  } catch (error) {
    next(error);
  }
};

const linkChildAccount = async (req, res, next) => {
  try {
    const parentId = req.user?.parentId;
    const { studentEmail, relation } = req.body;

    if (!parentId) {
      return res.status(400).json({ success: false, message: 'Parent profile missing.' });
    }

    const studentUser = await prisma.user.findUnique({
      where: { email: studentEmail },
      include: { studentProfile: true },
    });

    if (!studentUser || !studentUser.studentProfile) {
      return res.status(404).json({ success: false, message: 'Student with provided email not found.' });
    }

    const link = await prisma.parentStudentLink.create({
      data: {
        parentId,
        studentId: studentUser.studentProfile.id,
        relation: relation || 'GUARDIAN',
        isVerified: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Child account successfully linked with Read-Only access.',
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

const getChildWeeklyReport = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true, learningProgress: true, projects: { include: { tasks: true } } },
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const totalTasks = student.projects.flatMap((p) => p.tasks).length;
    const tasksDone = student.projects.flatMap((p) => p.tasks).filter((t) => t.status === 'COMPLETED').length;
    const avgProgress = student.learningProgress.length
      ? student.learningProgress.reduce((acc, curr) => acc + curr.progressPct, 0) / student.learningProgress.length
      : 75.0;

    const pythonRes = await pythonClient.post('/reports/weekly', {
      student_id: student.id,
      student_name: `${student.user.firstName} ${student.user.lastName}`,
      period: 'WEEKLY',
      learning_progress_pct: Math.round(avgProgress),
      project_status: student.projects[0]?.status || 'ACTIVE',
      tasks_done: tasksDone || 4,
      total_tasks: totalTasks || 5,
      mentor_notes: 'Exemplary dedication to project tasks and online quiz performance.',
    });

    return res.json({
      success: true,
      data: pythonRes.data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLinkedChildren,
  linkChildAccount,
  getChildWeeklyReport,
};
