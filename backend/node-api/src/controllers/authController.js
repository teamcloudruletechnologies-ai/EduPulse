const bcrypt = require('bcryptjs');
const { prisma } = require('../utils/prisma');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, role, institutionId, programId } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ success: false, message: 'Required registration fields missing.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        role,
        otpCode,
        otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    if (role === 'STUDENT') {
      const inst = institutionId || (await prisma.institution.findFirst())?.id;
      if (inst) {
        await prisma.student.create({
          data: {
            userId: user.id,
            institutionId: inst,
            programId: programId || null,
          },
        });
      }
    } else if (role === 'PARENT') {
      await prisma.parent.create({ data: { userId: user.id } });
    } else if (role === 'MENTOR') {
      await prisma.mentor.create({
        data: {
          userId: user.id,
          expertise: 'Full-Stack Development, AI, Web Systems',
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful. OTP verification code generated.',
      data: {
        userId: user.id,
        email: user.email,
        otpCode,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otpCode } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.otpCode !== otpCode) {
      return res.status(400).json({ success: false, message: 'Invalid OTP verification code.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isOtpVerified: true, isEmailVerified: true, otpCode: null },
    });

    return res.json({ success: true, message: 'OTP verified successfully. Account activated.' });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        parentProfile: true,
        institutionAdmin: true,
        mentorProfile: true,
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      studentId: user.studentProfile?.id,
      parentId: user.parentProfile?.id,
      institutionId: user.institutionAdmin?.institutionId || user.studentProfile?.institutionId,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        resource: 'AUTH',
        details: `User ${user.email} logged in with role ${user.role}`,
      },
    });

    return res.json({
      success: true,
      message: 'Login successful.',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatarUrl: user.avatarUrl,
          studentId: user.studentProfile?.id,
          parentId: user.parentProfile?.id,
          institutionId: user.institutionAdmin?.institutionId || user.studentProfile?.institutionId,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User with specified email not found.' });
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetExpiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    });

    return res.json({
      success: true,
      message: 'Password reset token generated.',
      data: { resetToken },
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await prisma.user.findFirst({
      where: { resetToken, resetExpiresAt: { gt: new Date() } },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetExpiresAt: null },
    });

    return res.json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
};
