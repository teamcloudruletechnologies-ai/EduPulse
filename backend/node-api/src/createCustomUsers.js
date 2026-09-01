const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Creating Custom Students & Mentor in TiDB Cloud...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Get or create Institution
  let institution = await prisma.institution.findFirst({
    where: { code: 'MIT-TECH-2026' },
  });
  if (!institution) {
    institution = await prisma.institution.create({
      data: {
        name: 'Apex Institute of Technology & Engineering',
        code: 'MIT-TECH-2026',
        type: 'COLLEGE',
        email: 'contact@apextech.edu',
        phone: '+1-800-555-0100',
        address: '100 Innovation Parkway, Tech District',
        website: 'https://apextech.edu',
        status: 'APPROVED',
      },
    });
  }

  // 2. Get or create Program & Batch
  let program = await prisma.program.findFirst({ where: { code: 'CS-AI-2026' } });
  if (!program) {
    program = await prisma.program.create({
      data: {
        name: 'B.Tech Computer Science & Artificial Intelligence',
        code: 'CS-AI-2026',
        description: 'Comprehensive 4-year degree specializing in full-stack cloud and AI systems.',
        institutionId: institution.id,
      },
    });
  }

  let batch = await prisma.batch.findFirst({ where: { name: 'Batch 2026-Alpha' } });
  if (!batch) {
    batch = await prisma.batch.create({
      data: {
        name: 'Batch 2026-Alpha',
        programId: program.id,
        institutionId: institution.id,
      },
    });
  }

  // 3. Create Mentor: Viji
  const vijiMentor = await prisma.user.upsert({
    where: { email: 'viji@edtech.com' },
    update: {
      firstName: 'Viji',
      lastName: 'Mentor',
      role: 'MENTOR',
    },
    create: {
      email: 'viji@edtech.com',
      passwordHash,
      firstName: 'Viji',
      lastName: 'Mentor',
      phone: '+91-98765-43210',
      role: 'MENTOR',
      isEmailVerified: true,
      isOtpVerified: true,
      mentorProfile: {
        create: {
          expertise: 'Full-Stack Development, Cloud Architecture, Python & AI',
          bio: 'Lead Technical Mentor and Software Specialist at EduPulse.',
          availability: 'Mon-Sat 10:00 AM - 7:00 PM',
        },
      },
    },
    include: { mentorProfile: true },
  });
  console.log(`✅ Created/Updated Mentor: Viji (viji@edtech.com, Password123!) [ID: ${vijiMentor.id}]`);

  // 4. Create Students: Sailesh, Sujitha, Isaac, Harrish, Praveen
  const studentList = [
    {
      firstName: 'Sailesh',
      lastName: 'Kumar',
      email: 'sailesh@edtech.com',
      rollNumber: 'CS2026-SAIL',
      phone: '+91-98765-00001',
    },
    {
      firstName: 'Sujitha',
      lastName: 'Ramesh',
      email: 'sujitha@edtech.com',
      rollNumber: 'CS2026-SUJI',
      phone: '+91-98765-00002',
    },
    {
      firstName: 'Isaac',
      lastName: 'Newton',
      email: 'isaac@edtech.com',
      rollNumber: 'CS2026-ISAC',
      phone: '+91-98765-00003',
    },
    {
      firstName: 'Harrish',
      lastName: 'Prabhu',
      email: 'harrish@edtech.com',
      rollNumber: 'CS2026-HARR',
      phone: '+91-98765-00004',
    },
    {
      firstName: 'Praveen',
      lastName: 'Raj',
      email: 'praveen@edtech.com',
      rollNumber: 'CS2026-PRAV',
      phone: '+91-98765-00005',
    },
  ];

  for (const s of studentList) {
    const studentUser = await prisma.user.upsert({
      where: { email: s.email },
      update: {
        firstName: s.firstName,
        lastName: s.lastName,
        role: 'STUDENT',
      },
      create: {
        email: s.email,
        passwordHash,
        firstName: s.firstName,
        lastName: s.lastName,
        phone: s.phone,
        role: 'STUDENT',
        isEmailVerified: true,
        isOtpVerified: true,
        studentProfile: {
          create: {
            institutionId: institution.id,
            programId: program.id,
            batchId: batch.id,
            rollNumber: s.rollNumber,
          },
        },
      },
      include: { studentProfile: true },
    });
    console.log(`✅ Created/Updated Student: ${s.firstName} (${s.email}, Password123!) [Roll: ${s.rollNumber}]`);
  }

  // 5. Connect session to first student (Sailesh)
  const sailesh = await prisma.student.findFirst({ where: { rollNumber: 'CS2026-SAIL' } });

  const session = await prisma.mentorSession.upsert({
    where: { id: 'sess-viji-live-cohort' },
    update: {
      topic: 'Full-Stack Architecture & Live Mentorship Sync with Viji',
      mentor: { connect: { id: vijiMentor.mentorProfile.id } },
      student: { connect: { id: sailesh.id } },
      scheduledAt: new Date(),
      duration: 60,
      status: 'SCHEDULED',
      meetingUrl: '/meeting/EduPulseGlobalCohort?topic=Full%20Stack%20Architecture%20Mentorship%20Sync&host=Viji%20(Lead%20Mentor)',
    },
    create: {
      id: 'sess-viji-live-cohort',
      topic: 'Full-Stack Architecture & Live Mentorship Sync with Viji',
      mentor: { connect: { id: vijiMentor.mentorProfile.id } },
      student: { connect: { id: sailesh.id } },
      scheduledAt: new Date(),
      duration: 60,
      status: 'SCHEDULED',
      meetingUrl: '/meeting/EduPulseGlobalCohort?topic=Full%20Stack%20Architecture%20Mentorship%20Sync&host=Viji%20(Lead%20Mentor)',
    },
  });
  console.log(`🎉 Created Live Mentor Session for Viji: "${session.topic}"`);

  console.log('✨ All 5 Students and Mentor Viji have been successfully created in TiDB Cloud!');
}

main()
  .catch((e) => {
    console.error('Error creating users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
