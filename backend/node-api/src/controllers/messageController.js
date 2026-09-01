const { prisma } = require('../utils/prisma');

const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user?.userId;
    const { receiverId, content } = req.body;

    if (!senderId) {
      return res.status(400).json({ success: false, message: 'Sender required.' });
    }

    const msg = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: { select: { firstName: true, lastName: true, role: true } },
        receiver: { select: { firstName: true, lastName: true, role: true } },
      },
    });

    return res.status(201).json({ success: true, data: msg });
  } catch (error) {
    next(error);
  }
};

const getConversation = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { otherUserId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    });

    return res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getConversation,
};
