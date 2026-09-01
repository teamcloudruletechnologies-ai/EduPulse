const { pythonClient } = require('../utils/pythonClient');
const { prisma } = require('../utils/prisma');

const getPlatformAnalytics = async (req, res, next) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalProjects = await prisma.project.count();
    const totalInstitutions = await prisma.institution.count();
    const totalSubmissions = await prisma.submission.count();

    let batchPerformance = null;
    try {
      const pyRes = await pythonClient.post('/analytics/performance', {
        institution_id: 'INST-ALL',
        batch_name: 'Platform Overview 2026',
        student_data: [
          { student_id: '1', score: 88, attendance_pct: 92 },
          { student_id: '2', score: 94, attendance_pct: 96 },
          { student_id: '3', score: 72, attendance_pct: 84 },
          { student_id: '4', score: 58, attendance_pct: 65 },
          { student_id: '5', score: 91, attendance_pct: 98 },
        ],
      });
      batchPerformance = pyRes.data;
    } catch (err) {
      console.warn('FastAPI performance endpoint warning:', err.message);
    }

    return res.json({
      success: true,
      data: {
        summary: {
          totalStudents,
          totalProjects,
          totalInstitutions,
          totalSubmissions,
        },
        batchPerformance,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlatformAnalytics,
};
