const { prisma } = require('../utils/prisma');

const registerInstitution = async (req, res, next) => {
  try {
    const { name, code, type, email, phone, address, website, documentUrl } = req.body;

    const existing = await prisma.institution.findUnique({ where: { code } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Institution with code already exists.' });
    }

    const inst = await prisma.institution.create({
      data: {
        name,
        code,
        type,
        email,
        phone,
        address,
        website,
        documentUrl,
        status: 'PENDING_VERIFICATION',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Institution registration submitted for Super Admin verification.',
      data: inst,
    });
  } catch (error) {
    next(error);
  }
};

const verifyInstitution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inst = await prisma.institution.update({
      where: { id },
      data: { status },
    });

    return res.json({
      success: true,
      message: `Institution status updated to ${status}.`,
      data: inst,
    });
  } catch (error) {
    next(error);
  }
};

const getInstitutions = async (req, res, next) => {
  try {
    const list = await prisma.institution.findMany({
      include: {
        programs: true,
        batches: true,
        _count: { select: { students: true, faculty: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

const createProgram = async (req, res, next) => {
  try {
    const { institutionId, name, code, description } = req.body;
    const program = await prisma.program.create({
      data: { institutionId, name, code, description },
    });
    return res.status(201).json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
};

const createBatch = async (req, res, next) => {
  try {
    const { institutionId, programId, name } = req.body;
    const batch = await prisma.batch.create({
      data: { institutionId, programId, name },
    });
    return res.status(201).json({ success: true, data: batch });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerInstitution,
  verifyInstitution,
  getInstitutions,
  createProgram,
  createBatch,
};
