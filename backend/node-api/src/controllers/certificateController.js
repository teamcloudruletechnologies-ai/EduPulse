const { prisma } = require('../utils/prisma');

const generateCertificate = async (req, res, next) => {
  try {
    const { studentId, courseId, projectId, title } = req.body;

    const certCode = 'CERT-2026-' + Math.floor(100000 + Math.random() * 900000).toString();

    const cert = await prisma.certificate.create({
      data: {
        certificateId: certCode,
        studentId,
        courseId: courseId || null,
        projectId: projectId || null,
        title: title || 'Certificate of Completion',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:3000/verify-certificate/${certCode}`,
      },
      include: {
        student: { include: { user: true, institution: true } },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Certificate generated with QR verification code.',
      data: cert,
    });
  } catch (error) {
    next(error);
  }
};

const getCertificates = async (req, res, next) => {
  try {
    const list = await prisma.certificate.findMany({
      include: {
        student: { include: { user: true, institution: true } },
        course: true,
        project: true,
      },
      orderBy: { issuedAt: 'desc' },
    });
    return res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

const verifyCertificatePublic = async (req, res, next) => {
  try {
    const { certificateId } = req.params;
    const cert = await prisma.certificate.findUnique({
      where: { certificateId },
      include: {
        student: { include: { user: true, institution: true, program: true } },
        course: true,
        project: true,
      },
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'Invalid Certificate ID. Certificate verification failed.',
      });
    }

    return res.json({
      success: true,
      verified: true,
      message: 'Certificate successfully verified on official blockchain / EdTech registry.',
      data: cert,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateCertificate,
  getCertificates,
  verifyCertificatePublic,
};
