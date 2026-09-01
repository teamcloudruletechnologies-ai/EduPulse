const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding for EdTech Platform (MySQL)...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Super Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@edtech.com' },
    update: {},
    create: {
      email: 'admin@edtech.com',
      passwordHash,
      firstName: 'System',
      lastName: 'SuperAdmin',
      phone: '+1-800-555-0199',
      role: 'SUPER_ADMIN',
      isEmailVerified: true,
      isOtpVerified: true,
    },
  });

  // 2. Create Institution
  const institution = await prisma.institution.upsert({
    where: { code: 'MIT-TECH-2026' },
    update: {},
    create: {
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

  // 3. Create Institution Admin User
  const instAdminUser = await prisma.user.upsert({
    where: { email: 'institution@edtech.com' },
    update: {},
    create: {
      email: 'institution@edtech.com',
      passwordHash,
      firstName: 'Eleanor',
      lastName: 'Vance',
      phone: '+1-800-555-0102',
      role: 'INSTITUTION_ADMIN',
      isEmailVerified: true,
      isOtpVerified: true,
      institutionAdmin: {
        create: {
          institutionId: institution.id,
        },
      },
    },
  });

  // 4. Create Program & Batch
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

  // 5. Create Mentor: Viji
  const mentorUser = await prisma.user.upsert({
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
          expertise: 'Full-Stack React/Node, FastAPI, Distributed Systems',
          bio: 'Lead Technical Mentor and Software Specialist at EduPulse.',
          availability: 'Mon-Sat 10AM-7PM IST',
        },
      },
    },
    include: { mentorProfile: true },
  });

  // 6. Create Student
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@edtech.com' },
    update: {},
    create: {
      email: 'student@edtech.com',
      passwordHash,
      firstName: 'Alex',
      lastName: 'Mercer',
      phone: '+1-800-555-0105',
      role: 'STUDENT',
      isEmailVerified: true,
      isOtpVerified: true,
      studentProfile: {
        create: {
          institutionId: institution.id,
          programId: program.id,
          batchId: batch.id,
          rollNumber: 'CS2026-042',
        },
      },
    },
    include: { studentProfile: true },
  });

  // 7. Create Parent & Link Child
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@edtech.com' },
    update: {},
    create: {
      email: 'parent@edtech.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Mercer',
      phone: '+1-800-555-0106',
      role: 'PARENT',
      isEmailVerified: true,
      isOtpVerified: true,
      parentProfile: {
        create: {
          children: {
            create: {
              studentId: studentUser.studentProfile.id,
              relation: 'MOTHER',
              isVerified: true,
            },
          },
        },
      },
    },
  });

  // 8. Create Course & Modules
  let course = await prisma.course.findFirst({ where: { code: 'CS-501' } });
  if (!course) {
    course = await prisma.course.create({
      data: {
        title: 'Full-Stack Enterprise Systems & AI Integration',
        code: 'CS-501',
        description: 'Master enterprise software architecture, Node.js REST APIs, Python microservices, and React design patterns.',
        category: 'Software Engineering',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
        programId: program.id,
        modules: {
          create: [
            {
              title: 'Module 1: Architecture & Data Modeling',
              orderIndex: 1,
              lessons: {
                create: [
                  {
                    title: 'Introduction to Multi-Tenant Enterprise Architecture',
                    content: 'Learn layer separation, microservices vs monoliths, and API contract design.',
                    duration: 45,
                    orderIndex: 1,
                  },
                  {
                    title: 'Relational Schema & ORM Best Practices',
                    content: 'Master Prisma schemas, indexes, foreign keys, and migration scripts.',
                    duration: 60,
                    orderIndex: 2,
                  },
                ],
              },
              quizzes: {
                create: [
                  {
                    title: 'Architecture & SQL Fundamentals Quiz',
                    totalMarks: 100,
                    passMarks: 60,
                    questions: {
                      create: [
                        {
                          questionText: 'What layer handles main application business logic in our stack?',
                          options: JSON.stringify(['React Frontend', 'Node.js Express REST API', 'MySQL DB', 'Python Microservice']),
                          correctAnswer: 'Node.js Express REST API',
                          marks: 50,
                        },
                        {
                          questionText: 'Which service is responsible for report generation and Pandas data analytics?',
                          options: JSON.stringify(['Python FastAPI Microservice', 'React Redux', 'Node.js Middleware', 'Prisma Engine']),
                          correctAnswer: 'Python FastAPI Microservice',
                          marks: 50,
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    await prisma.learningProgress.upsert({
      where: {
        studentId_courseId: {
          studentId: studentUser.studentProfile.id,
          courseId: course.id,
        },
      },
      update: {},
      create: {
        studentId: studentUser.studentProfile.id,
        courseId: course.id,
        progressPct: 75.0,
        completed: false,
      },
    });
  }

  // 9. Create Demo Project, Tasks, & Submission
  const existingProject = await prisma.project.findFirst({ where: { title: 'Autonomous EdTech Progress Tracking Engine' } });
  if (!existingProject) {
    await prisma.project.create({
      data: {
        title: 'Autonomous EdTech Progress Tracking Engine',
        description: 'End-to-end multi-portal progress tracking platform with AI pre-check and mentor validation.',
        problemStatement: 'Institutions lack real-time visibility into student milestone execution and task verification.',
        objectives: 'Build 4 distinct portals (Student, Parent Read-Only, Institution, Admin) connected to Node.js and FastAPI backend.',
        techStack: 'React, JavaScript, Node.js, Express, Python FastAPI, MySQL, Tailwind CSS',
        creatorId: studentUser.studentProfile.id,
        mentorId: mentorUser.mentorProfile.id,
        status: 'ACTIVE',
        members: {
          create: {
            studentId: studentUser.studentProfile.id,
            role: 'LEADER',
          },
        },
        tasks: {
          create: [
            {
              title: 'Design MySQL Schema & Prisma Migration',
              description: 'Create 30+ tables with full foreign key constraints and seed data.',
              priority: 'HIGH',
              status: 'COMPLETED',
            },
            {
              title: 'Implement Node.js REST API Controllers & RBAC Guard',
              description: 'Create controllers for auth, projects, parent read-only access, and FastAPI proxying.',
              priority: 'HIGH',
              status: 'IN_PROGRESS',
            },
          ],
        },
      },
    });
  }

  // 10. Achievements & Badges
  const badge1 = await prisma.achievement.upsert({
    where: { id: 'achieve-1' },
    update: {},
    create: {
      id: 'achieve-1',
      title: 'Architect Milestone Complete',
      description: 'Successfully submitted and verified full-stack project architecture proposal.',
      badgeIcon: 'Award',
      criteria: 'Project proposal approved by assigned industry mentor.',
    },
  });

  const badge2 = await prisma.achievement.upsert({
    where: { id: 'achieve-2' },
    update: {},
    create: {
      id: 'achieve-2',
      title: 'Quiz Whiz',
      description: 'Scored 85%+ on architectural knowledge check.',
      badgeIcon: 'Zap',
      criteria: 'Pass quiz with distinction score.',
    },
  });

  await prisma.studentAchievement.upsert({
    where: {
      studentId_achievementId: {
        studentId: studentUser.studentProfile.id,
        achievementId: badge1.id,
      },
    },
    update: {},
    create: {
      studentId: studentUser.studentProfile.id,
      achievementId: badge1.id,
    },
  });

  // 11. Certificates
  await prisma.certificate.upsert({
    where: { certificateId: 'CERT-2026-9841' },
    update: {},
    create: {
      certificateId: 'CERT-2026-9841',
      studentId: studentUser.studentProfile.id,
      courseId: course?.id || null,
      title: 'Full-Stack Architecture & Microservices Certification',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:3000/verify-certificate/CERT-2026-9841',
    },
  });

  console.log('✅ Database Seeding Complete (MySQL)!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials for testing:');
  console.log('🔑 Super Admin: admin@edtech.com / Password123!');
  console.log('🔑 Inst Admin:  institution@edtech.com / Password123!');
  console.log('🔑 Mentor:      mentor@edtech.com / Password123!');
  console.log('🔑 Parent:      parent@edtech.com / Password123!');
  console.log('🔑 Student:     student@edtech.com / Password123!');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
