# EdTech Platform - API Endpoints Specification

## 1. Authentication Endpoints (`/api/auth`)

- `POST /api/auth/register`: Register new account (Student, Parent, Institution, Mentor)
- `POST /api/auth/login`: Authenticate and receive JWT Access & Refresh tokens
- `POST /api/auth/verify-otp`: Validate 6-digit OTP code
- `POST /api/auth/forgot-password`: Generate password reset token
- `POST /api/auth/reset-password`: Reset user password

## 2. Parent Endpoints (`/api/parents`) - *Read-Only Policy Enforced*

- `GET /api/parents/children`: List linked child accounts with full learning/project metrics
- `POST /api/parents/link-child`: Request new student account linking
- `GET /api/parents/reports/weekly/:studentId`: Download Pandas-generated weekly progress report

## 3. Student & Learning Endpoints (`/api/students`, `/api/learning`)

- `GET /api/students/dashboard`: Student dashboard stat cards, active project milestones, and Python AI insights
- `GET /api/learning/courses`: List all enrolled learning courses with modules and quizzes
- `GET /api/learning/courses/:id`: Get course detail and lesson curriculum
- `POST /api/learning/quiz/attempt`: Submit quiz answers and calculate score
- `POST /api/learning/progress`: Update course progress percentage

## 4. Project & Task Endpoints (`/api/projects`, `/api/tasks`)

- `GET /api/projects`: List projects with assigned mentor and task deliverables
- `POST /api/projects`: Create project proposal (8-step wizard payload) or save as draft
- `PATCH /api/projects/:id/status`: Update status (`DRAFT`, `PENDING_REVIEW`, `ACTIVE`, `REVISION_REQUIRED`, `COMPLETED`)
- `POST /api/tasks`: Create project task deliverable
- `PATCH /api/tasks/:id/status`: Update task progress status

## 5. Submissions & Python AI Pre-Check Endpoints (`/api/submissions`)

- `POST /api/submissions`: Upload work evidence (GitHub URL, document link). Forwards payload internally to Python FastAPI service for AI analysis pre-check.
- `GET /api/submissions`: List submission history and version payloads

## 6. Certificate & Public Verification (`/api/certificates`)

- `POST /api/certificates/generate`: Generate official certificate record with QR code
- `GET /api/certificates/verify/:certificateId`: Public verification endpoint for QR scanners
