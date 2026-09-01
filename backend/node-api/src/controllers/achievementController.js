const { prisma } = require('../utils/prisma');

const getAchievements = async (req, res, next) => {
  try {
    const list = await prisma.achievement.findMany();
    return res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

const getStudentAchievements = async (req, res, next) => {
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

module.exports = {
  getAchievements,
  getStudentAchievements,
};
