const { prisma } = require('../utils/prisma');

const getMentors = async (req, res, next) => {
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

const bookMentorSession = async (req, res, next) => {
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

const addMentorFeedback = async (req, res, next) => {
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

const getSessions = async (req, res, next) => {
  try {
    const sessions = await prisma.mentorSession.findMany({
      include: {
        mentor: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
            },
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });

    const formatted = sessions.map((s) => ({
      id: s.id,
      roomId: s.id,
      topic: s.topic,
      mentorName: s.mentor?.user ? `${s.mentor.user.firstName} ${s.mentor.user.lastName}` : 'Dr. Robert Langdon',
      mentorAvatar: s.mentor?.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      scheduledAt: s.scheduledAt ? s.scheduledAt.toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      duration: s.duration || 45,
      participants: 18,
      status: s.status || 'SCHEDULED',
      meetingUrl: s.meetingUrl || `/meeting/${s.id}?topic=${encodeURIComponent(s.topic)}`,
      notes: s.notes || 'Cohort Live Workshop',
    }));

    return res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

const createSession = async (req, res, next) => {
  try {
    const { topic, scheduledAt, duration, notes, mentorName } = req.body;

    let mentor = await prisma.mentor.findFirst();
    if (!mentor) {
      const firstUser = await prisma.user.findFirst({ where: { role: 'MENTOR' } });
      if (firstUser) {
        mentor = await prisma.mentor.create({ data: { userId: firstUser.id, expertise: 'Full Stack Development' } });
      }
    }
    let student = await prisma.student.findFirst();
    if (!student) {
      const stuUser = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
      if (stuUser) {
        student = await prisma.student.create({ data: { userId: stuUser.id, rollNumber: 'CS2026-001' } });
      }
    }

    if (!mentor || !student) {
      return res.status(400).json({ success: false, message: 'Mentor or Student not found in database.' });
    }

    const session = await prisma.mentorSession.create({
      data: {
        mentorId: mentor.id,
        studentId: student.id,
        topic: topic || 'Cohort Live Sync',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
        duration: duration ? parseInt(duration, 10) : 45,
        status: 'SCHEDULED',
        notes: notes || 'Live Cohort Meeting',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Session created successfully in cloud database.',
      data: {
        id: session.id,
        roomId: session.id,
        topic: session.topic,
        mentorName: mentorName || 'Dr. Robert Langdon',
        scheduledAt: session.scheduledAt.toISOString().slice(0, 16),
        duration: session.duration,
        status: session.status,
        meetingUrl: `/meeting/${session.id}?topic=${encodeURIComponent(session.topic)}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.mentorSession.delete({
      where: { id },
    });
    return res.json({ success: true, message: 'Session deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMentors,
  bookMentorSession,
  addMentorFeedback,
  getSessions,
  createSession,
  deleteSession,
};
