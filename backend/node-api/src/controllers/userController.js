const { prisma } = require('../utils/prisma');

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: { include: { institution: true, program: true } },
        parentProfile: { include: { children: { include: { student: { include: { user: true } } } } } },
        institutionAdmin: { include: { institution: true } },
        mentorProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { firstName, lastName, phone, avatarUrl } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName, phone, avatarUrl },
    });

    return res.json({ success: true, message: 'Profile updated successfully.', data: updated });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    return res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
};
