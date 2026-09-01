const { prisma } = require('../utils/prisma');
const { pythonClient } = require('../utils/pythonClient');

const createSubmission = async (req, res, next) => {
  try {
    const studentId = req.user?.studentId;
    const { projectId, taskId, title, description, githubUrl, fileUrl, submissionType } = req.body;

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID required.' });
    }

    const submission = await prisma.submission.create({
      data: {
        projectId,
        taskId: taskId || null,
        studentId,
        title,
        description,
        githubUrl: githubUrl || null,
        fileUrl: fileUrl || null,
        status: 'ANALYZING',
        versions: {
          create: {
            version: 1,
            githubUrl: githubUrl || null,
            fileUrl: fileUrl || null,
            notes: 'Initial submission attempt.',
          },
        },
      },
    });

    let aiResult = null;
    try {
      const endpoint = submissionType === 'CODE' ? '/analysis/code' : '/analysis/submission';
      const pyRes = await pythonClient.post(endpoint, {
        submission_id: submission.id,
        title: submission.title,
        description: submission.description,
        github_url: submission.githubUrl,
        file_url: submission.fileUrl,
        submission_type: submissionType || 'DOCUMENT',
      });
      aiResult = pyRes.data;

      await prisma.submission.update({
        where: { id: submission.id },
        data: {
          status: 'PENDING_REVIEW',
          aiAnalysis: JSON.stringify(aiResult),
        },
      });
    } catch (err) {
      console.warn('AI analysis call warning:', err.message);
      await prisma.submission.update({
        where: { id: submission.id },
        data: { status: 'PENDING_REVIEW' },
      });
    }

    if (taskId) {
      await prisma.projectTask.update({
        where: { id: taskId },
        data: { status: 'SUBMITTED' },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Submission uploaded. AI pre-check completed and pending mentor review.',
      data: {
        submission,
        aiResult,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSubmissions = async (req, res, next) => {
  try {
    const list = await prisma.submission.findMany({
      include: {
        student: { include: { user: true } },
        project: true,
        task: true,
        versions: { orderBy: { version: 'desc' } },
        feedbacks: { include: { mentor: { include: { user: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

const getSubmissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sub = await prisma.submission.findUnique({
      where: { id },
      include: {
        student: { include: { user: true } },
        project: { include: { mentor: { include: { user: true } } } },
        task: true,
        versions: { orderBy: { version: 'desc' } },
        feedbacks: { include: { mentor: { include: { user: true } } } },
      },
    });

    if (!sub) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    return res.json({ success: true, data: sub });
  } catch (error) {
    next(error);
  }
};

const explainCode = async (req, res, next) => {
  try {
    const { code, language, inputs } = req.body;
    const pyRes = await pythonClient.post('/analysis/explain-code', {
      code,
      language: language || 'python',
      inputs: inputs || [],
    });
    return res.json({ success: true, data: pyRes.data });
  } catch (err) {
    console.warn('Python explanation error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  explainCode,
};
