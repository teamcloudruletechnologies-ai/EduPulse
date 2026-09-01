# EduPulse Platform — Complete 47 Node.js REST APIs Specification (with JSON Payloads)

Complete reference manual for all **47 REST APIs** in the EduPulse Node.js + Express backend (`http://localhost:5000`). Each endpoint includes HTTP Method, Full URL, Required Headers, Request JSON Body, and Response JSON Body.

---

## 📌 Global Configuration
* **Base URL:** `http://localhost:5000`
* **Default Port:** `5000`
* **Database:** MySQL 8.0 via Prisma ORM
* **Content-Type:** `application/json`
* **Authentication Scheme:** `Authorization: Bearer <JWT_ACCESS_TOKEN>`

---

## 1. System Health Check

### 1.1 Health & Server Telemetry
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/health`
* **Access:** Public
* **Headers:** None
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "status": "ONLINE",
  "service": "EdTech Main REST API (Node.js + Express JS)",
  "timestamp": "2026-08-31T12:30:19.655Z"
}
```

---

## 2. Authentication & Account Security (`/api/auth`)

### 2.1 User Registration
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/auth/register`
* **Access:** Public
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-0199",
  "role": "STUDENT",
  "institutionId": "168b07cc-9c78-4b83-8e07-de1db12b6e72",
  "rollNumber": "CS2026-099"
}
```
* **Response Body (`201 Created`):**
```json
{
  "success": true,
  "message": "User registered successfully. Verification OTP dispatched.",
  "data": {
    "userId": "usr-81920",
    "email": "john.doe@example.com",
    "role": "STUDENT",
    "isOtpVerified": false
  }
}
```

### 2.2 User Login
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/auth/login`
* **Access:** Public
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "email": "student@edtech.com",
  "password": "Password123!"
}
```
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "2db6154e-edbb-4ccd-89b5-152f3fb0f0df",
      "email": "student@edtech.com",
      "firstName": "Alex",
      "lastName": "Mercer",
      "role": "STUDENT",
      "studentId": "d7ad5952-d5b7-41a7-afbe-8b9191a1aa8d",
      "institutionId": "168b07cc-9c78-4b83-8e07-de1db12b6e72"
    }
  }
}
```

### 2.3 Verify 6-Digit OTP
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/auth/verify-otp`
* **Access:** Public
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "email": "student@edtech.com",
  "otp": "492018"
}
```
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Account verified successfully."
}
```

### 2.4 Forgot Password Request
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/auth/forgot-password`
* **Access:** Public
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "email": "student@edtech.com"
}
```
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Password reset token sent to your registered email."
}
```

### 2.5 Reset Password
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/auth/reset-password`
* **Access:** Public
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "resetToken": "rst-8f2038bfa92c",
  "newPassword": "NewSecurePassword123!"
}
```
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Password reset successful. Please login with your new credentials."
}
```

---

## 3. User Profiles & Directory (`/api/users`)

### 3.1 Get Current User Profile
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/users/profile`
* **Access:** Authenticated (Any Role)
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "2db6154e-edbb-4ccd-89b5-152f3fb0f0df",
    "email": "student@edtech.com",
    "firstName": "Alex",
    "lastName": "Mercer",
    "phone": "+1-800-555-0105",
    "role": "STUDENT",
    "isEmailVerified": true,
    "createdAt": "2026-08-28T07:46:26.204Z"
  }
}
```

### 3.2 Update User Profile
* **Method:** `PUT`
* **Endpoint:** `http://localhost:5000/api/users/profile`
* **Access:** Authenticated (Any Role)
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "firstName": "Alexander",
  "lastName": "Mercer",
  "phone": "+1-800-555-9988",
  "bio": "Full-Stack engineering student specializing in distributed systems."
}
```
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "data": {
    "id": "2db6154e-edbb-4ccd-89b5-152f3fb0f0df",
    "firstName": "Alexander",
    "lastName": "Mercer",
    "phone": "+1-800-555-9988"
  }
}
```

### 3.3 Get All Registered Users
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/users/all`
* **Access:** Super Admin, Institution Admin
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "2db6154e-edbb-4ccd-89b5-152f3fb0f0df",
      "email": "student@edtech.com",
      "firstName": "Alex",
      "lastName": "Mercer",
      "role": "STUDENT"
    },
    {
      "id": "053c442f-2b6f-4e88-a09f-cf94ab4f8a7e",
      "email": "mentor@edtech.com",
      "firstName": "Dr. Robert",
      "lastName": "Langdon",
      "role": "MENTOR"
    }
  ]
}
```

---

## 4. Institutions & Campuses (`/api/institutions`)

### 4.1 Register New Institution
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/institutions/register`
* **Access:** Public / Admin
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "name": "Stanford Global School of Computing",
  "code": "SGSC-2026",
  "address": "450 Serra Mall, Stanford, CA",
  "contactEmail": "admissions@sgsc.edu",
  "contactPhone": "+1-650-723-2300"
}
```
* **Response Body (`201 Created`):**
```json
{
  "success": true,
  "message": "Institution registered successfully, pending verification.",
  "data": {
    "id": "inst-49201",
    "name": "Stanford Global School of Computing",
    "status": "PENDING_VERIFICATION"
  }
}
```

### 4.2 List All Institutions
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/institutions`
* **Access:** Authenticated
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "168b07cc-9c78-4b83-8e07-de1db12b6e72",
      "name": "Apex Institute of Technology",
      "code": "AIT-2026",
      "isVerified": true
    }
  ]
}
```

### 4.3 Verify Institution Accreditation
* **Method:** `PATCH`
* **Endpoint:** `http://localhost:5000/api/institutions/168b07cc-9c78-4b83-8e07-de1db12b6e72/verify`
* **Access:** Super Admin
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "isVerified": true
}
```
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Institution verification status updated."
}
```

### 4.4 Create Academic Program
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/institutions/programs`
* **Access:** Super Admin, Institution Admin
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "institutionId": "168b07cc-9c78-4b83-8e07-de1db12b6e72",
  "name": "B.Tech Computer Science & AI Systems",
  "code": "BT-CSAI",
  "durationYears": 4
}
```
* **Response Body (`201 Created`):**
```json
{
  "success": true,
  "message": "Degree program created.",
  "data": {
    "id": "prg-102",
    "name": "B.Tech Computer Science & AI Systems"
  }
}
```

### 4.5 Create Academic Batch / Cohort
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/institutions/batches`
* **Access:** Super Admin, Institution Admin
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "programId": "78fd5152-56f5-4f40-9699-f3d871375177",
  "name": "Cohort Batch 2026-Alpha",
  "startYear": 2026,
  "endYear": 2030
}
```
* **Response Body (`201 Created`):**
```json
{
  "success": true,
  "message": "Cohort batch created.",
  "data": {
    "id": "bat-2026",
    "name": "Cohort Batch 2026-Alpha"
  }
}
```

---

## 5. Student Academic Directory (`/api/students`)

### 5.1 Get Logged-In Student Dashboard
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/students/dashboard`
* **Access:** Authenticated (Student)
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "student": {
      "rollNumber": "CS2026-042",
      "user": { "firstName": "Alex", "lastName": "Mercer" }
    },
    "aiAnalytics": {
      "learning_velocity_score": 88,
      "overall_progressPct": 75,
      "task_completion_rate": 80
    }
  }
}
```

### 5.2 Get Specific Student Dashboard by ID
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/students/dashboard/d7ad5952-d5b7-41a7-afbe-8b9191a1aa8d`
* **Access:** Mentor, Admin, Parent
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "studentId": "d7ad5952-d5b7-41a7-afbe-8b9191a1aa8d",
    "rollNumber": "CS2026-042",
    "activeProjectsCount": 1,
    "completedMilestones": 4
  }
}
```

### 5.3 Get Enrolled Students List
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/students/all`
* **Access:** Super Admin, Institution Admin, Staff
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "d7ad5952-d5b7-41a7-afbe-8b9191a1aa8d",
      "rollNumber": "CS2026-042",
      "user": {
        "firstName": "Alex",
        "lastName": "Mercer",
        "email": "student@edtech.com"
      }
    }
  ]
}
```

---

## 6. Courses & Interactive Quizzes (`/api/learning`)

### 6.1 Get All Courses
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/learning/courses`
* **Access:** Public / Authenticated
* **Headers:** None
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "b37ee1dc-3297-46ca-a7d4-d1cc0ae6fd5e",
      "code": "CS-501",
      "title": "Full-Stack Enterprise Systems & AI Integration",
      "category": "Software Engineering",
      "description": "Master enterprise software architecture, Node.js REST APIs, Python microservices, and React design patterns."
    }
  ]
}
```

### 6.2 Get Course Details by ID
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/learning/courses/b37ee1dc-3297-46ca-a7d4-d1cc0ae6fd5e`
* **Access:** Public / Authenticated
* **Headers:** None
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "b37ee1dc-3297-46ca-a7d4-d1cc0ae6fd5e",
    "title": "Full-Stack Enterprise Systems & AI Integration",
    "modules": [
      {
        "id": "37f02954-cf69-47b9-b8aa-113b0c495c04",
        "title": "Module 1: Architecture & Data Modeling",
        "lessons": [
          { "id": "801eafa6", "title": "Introduction to Multi-Tenant Architecture", "duration": 45 }
        ],
        "quizzes": [
          { "id": "427dfc84", "title": "Architecture & SQL Fundamentals Quiz", "passMarks": 60 }
        ]
      }
    ]
  }
}
```

### 6.3 Submit Quiz Attempt
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/learning/quiz/attempt`
* **Access:** Authenticated (Student)
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "quizId": "427dfc84-9124-4b5d-b4ff-4178d398e4d9",
  "answers": [
    { "questionId": 1, "selectedOption": 0 },
    { "questionId": 2, "selectedOption": 1 },
    { "questionId": 3, "selectedOption": 1 }
  ]
}
```
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "score": 100,
    "passMarks": 60,
    "passed": true,
    "earnedXP": 150
  }
}
```

### 6.4 Update Learning Progress
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/learning/progress`
* **Access:** Authenticated (Student)
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "lessonId": "801eafa6-c29f-4a01-93c1-e74c0e7b067d",
  "isCompleted": true,
  "timeSpentSeconds": 1800
}
```
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Lesson progress recorded."
}
```

---

## 7. Capstone Projects (`/api/projects`)

### 7.1 List All Projects
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/projects`
* **Access:** Public / Authenticated
* **Headers:** None
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "805f34cf-877a-4ab4-b5c5-49ea4b103352",
      "title": "Autonomous EdTech Progress Tracking Engine",
      "status": "ACTIVE",
      "techStack": "React, Node.js, Express, Python FastAPI, MySQL"
    }
  ]
}
```

### 7.2 Get Project by ID
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/projects/805f34cf-877a-4ab4-b5c5-49ea4b103352`
* **Access:** Public / Authenticated
* **Headers:** None
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "805f34cf-877a-4ab4-b5c5-49ea4b103352",
    "title": "Autonomous EdTech Progress Tracking Engine",
    "objectives": "Build multi-portal architecture with AI telemetry",
    "tasks": [
      { "id": "43534ab9", "title": "Design MySQL Schema", "status": "COMPLETED" }
    ]
  }
}
```

### 7.3 Create / Propose Capstone Project
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/projects`
* **Access:** Authenticated (Student, Mentor)
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "title": "Distributed Cloud Compiler & Sandbox",
  "description": "High-speed multi-language code compilation microservices in Docker containers.",
  "techStack": "Node.js, Docker, WebAssembly, Go, React",
  "objectives": "Execute student code with standard input support under 100ms latency.",
  "mentorId": "c94c9c5d-f984-450a-8f5b-1f4ead4aa017"
}
```
* **Response Body (`201 Created`):**
```json
{
  "success": true,
  "message": "Capstone project proposed successfully.",
  "data": {
    "id": "proj-901",
    "title": "Distributed Cloud Compiler & Sandbox",
    "status": "PROPOSED"
  }
}
```

### 7.4 Update Project Status
* **Method:** `PATCH`
* **Endpoint:** `http://localhost:5000/api/projects/805f34cf-877a-4ab4-b5c5-49ea4b103352/status`
* **Access:** Authenticated (Mentor, Admin)
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "status": "COMPLETED"
}
```
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Project milestone status updated to COMPLETED."
}
```

---

## 8. Tasks Kanban Board (`/api/tasks`)

### 8.1 Create Task
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/tasks`
* **Access:** Authenticated (Student, Mentor)
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "projectId": "805f34cf-877a-4ab4-b5c5-49ea4b103352",
  "title": "Setup In-Website WebRTC Video Container",
  "description": "EduPulse In-House Native Real-Time Meeting Room with Custom Cloud Signaling.",
  "priority": "HIGH"
}
```
* **Response Body (`201 Created`):**
```json
{
  "success": true,
  "message": "Task card added to Kanban board.",
  "data": {
    "id": "tsk-702",
    "title": "Setup In-Website WebRTC Video Container",
    "status": "TODO"
  }
}
```

### 8.2 Update Task Status
* **Method:** `PATCH`
* **Endpoint:** `http://localhost:5000/api/tasks/tsk-702/status`
* **Access:** Authenticated (Student, Mentor)
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "status": "COMPLETED"
}
```
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Task status updated to COMPLETED."
}
```

---

## 9. Mentorship & Meeting Sessions (`/api/mentors`)

### 9.1 List Mentors
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/mentors`
* **Access:** Public / Authenticated
* **Headers:** None
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "c94c9c5d-f984-450a-8f5b-1f4ead4aa017",
      "expertise": "Full-Stack React/Node, Distributed Systems",
      "user": {
        "firstName": "Dr. Robert",
        "lastName": "Langdon",
        "email": "mentor@edtech.com"
      }
    }
  ]
}
```

### 9.2 Book / Schedule Video Meeting Session
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/mentors/session`
* **Access:** Authenticated (Student, Mentor)
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "mentorId": "c94c9c5d-f984-450a-8f5b-1f4ead4aa017",
  "topic": "Live Q&A & Milestone 1 Architecture Review",
  "scheduledAt": "2026-09-02T10:30:00.000Z",
  "durationMinutes": 45
}
```
* **Response Body (`201 Created`):**
```json
{
  "success": true,
  "message": "Meeting scheduled successfully.",
  "data": {
    "id": "sess-4091",
    "meetingUrl": "https://meet.jit.si/EdTechMeeting-982103",
    "status": "SCHEDULED"
  }
}
```

### 9.3 Record Mentor Milestone Feedback
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/mentors/feedback`
* **Access:** Authenticated (Mentor)
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "submissionId": "sub-902183",
  "projectId": "805f34cf-877a-4ab4-b5c5-49ea4b103352",
  "rating": 5,
  "decision": "APPROVED",
  "comments": "Superb architecture and clean AST validation. Approved!"
}
```
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Formal evaluation recorded and status updated to APPROVED.",
  "data": {
    "decision": "APPROVED",
    "rating": 5
  }
}
```

---

## 10. Code Deliverables & Submissions (`/api/submissions`)

### 10.1 List Submissions Queue
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/submissions`
* **Access:** Authenticated (Student, Mentor)
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "sub-101",
      "title": "Python Data Telemetry Service (main.py)",
      "status": "PENDING_REVIEW",
      "createdAt": "2026-08-31T12:35:00.000Z"
    }
  ]
}
```

### 10.2 Get Submission by ID
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/submissions/sub-101`
* **Access:** Authenticated (Student, Mentor)
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "sub-101",
    "title": "Python Data Telemetry Service (main.py)",
    "codeSnippet": "a = int(input())\nb = int(input())\nprint(a + b)",
    "status": "PENDING_REVIEW"
  }
}
```

### 10.3 Submit Code from Compiler
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/submissions`
* **Access:** Authenticated (Student)
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "projectId": "805f34cf-877a-4ab4-b5c5-49ea4b103352",
  "title": "Java Armstrong Number Algorithm",
  "description": "Implemented using Scanner interactive standard input.",
  "codeSnippet": "import java.util.Scanner;\npublic class Main { ... }"
}
```
* **Response Body (`201 Created`):**
```json
{
  "success": true,
  "message": "Submission uploaded successfully.",
  "data": {
    "id": "sub-902183",
    "status": "PENDING_REVIEW"
  }
}
```

---

## 11. Student Achievements & Gamification (`/api/achievements`)

### 11.1 List All Available Badges
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/achievements`
* **Access:** Public / Authenticated
* **Headers:** None
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "ach-1",
      "title": "First Code Milestone",
      "points": 50,
      "badgeUrl": "https://assets.edtech.com/badges/milestone.svg"
    }
  ]
}
```

### 11.2 Get My Earned Achievements
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/achievements/my`
* **Access:** Authenticated (Student)
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "totalXP": 450,
    "badgesCount": 3,
    "achievements": [
      { "id": "ach-1", "title": "First Code Milestone", "unlockedAt": "2026-08-28T09:00:00Z" }
    ]
  }
}
```

### 11.3 Get Achievements for Specific Student
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/achievements/student/d7ad5952-d5b7-41a7-afbe-8b9191a1aa8d`
* **Access:** Authenticated
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "studentId": "d7ad5952-d5b7-41a7-afbe-8b9191a1aa8d",
    "totalXP": 450,
    "badges": ["First Code Milestone", "SQL Master"]
  }
}
```

---

## 12. Digital Certificates & Verification (`/api/certificates`)

### 12.1 Public Certificate Verification
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/certificates/verify/CERT-2026-CS501-A92B`
* **Access:** Public (No Auth)
* **Headers:** None
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "certificateId": "CERT-2026-CS501-A92B",
    "recipient": "Alex Mercer",
    "courseTitle": "Full-Stack Enterprise Systems & AI Integration",
    "grade": "Distinction (A+)",
    "issueDate": "2026-08-28",
    "isAuthentic": true
  }
}
```

### 12.2 Get Issued Certificates
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/certificates`
* **Access:** Authenticated
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cert-1",
      "certificateNumber": "CERT-2026-CS501-A92B",
      "status": "ISSUED"
    }
  ]
}
```

### 12.3 Generate Certificate
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/certificates/generate`
* **Access:** Super Admin, Inst Admin, Mentor
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "studentId": "d7ad5952-d5b7-41a7-afbe-8b9191a1aa8d",
  "courseId": "b37ee1dc-3297-46ca-a7d4-d1cc0ae6fd5e",
  "grade": "A+"
}
```
* **Response Body (`201 Created`):**
```json
{
  "success": true,
  "message": "Certificate issued.",
  "data": {
    "certificateNumber": "CERT-2026-CS501-A92B",
    "verificationUrl": "http://localhost:3000/verify/CERT-2026-CS501-A92B"
  }
}
```

---

## 13. Real-Time Chat & Messaging (`/api/messages`)

### 13.1 Send Direct Message
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/messages`
* **Access:** Authenticated (Any Role)
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "receiverId": "053c442f-2b6f-4e88-a09f-cf94ab4f8a7e",
  "content": "Dr. Robert, I have completed the database schema task."
}
```
* **Response Body (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "msg-4019",
    "senderId": "2db6154e-edbb-4ccd-89b5-152f3fb0f0df",
    "receiverId": "053c442f-2b6f-4e88-a09f-cf94ab4f8a7e",
    "content": "Dr. Robert, I have completed the database schema task.",
    "isRead": false,
    "createdAt": "2026-08-31T12:37:45.000Z"
  }
}
```

### 13.2 Get Conversation History
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/messages/conversation/053c442f-2b6f-4e88-a09f-cf94ab4f8a7e`
* **Access:** Authenticated
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg-4019",
      "content": "Dr. Robert, I have completed the database schema task.",
      "senderId": "2db6154e-edbb-4ccd-89b5-152f3fb0f0df",
      "createdAt": "2026-08-31T12:37:45.000Z"
    }
  ]
}
```

---

## 14. Notifications (`/api/notifications`)

### 14.1 Get Notifications List
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/notifications`
* **Access:** Authenticated
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif-1",
      "title": "Milestone Approved",
      "message": "Dr. Robert approved your Java Armstrong Algorithm.",
      "isRead": false
    }
  ]
}
```

### 14.2 Mark Notification as Read
* **Method:** `PATCH`
* **Endpoint:** `http://localhost:5000/api/notifications/notif-1/read`
* **Access:** Authenticated
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Notification marked as read."
}
```

---

## 15. Platform Analytics (`/api/analytics`)

### 15.1 Overview Metrics
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/analytics/overview`
* **Access:** Super Admin, Institution Admin
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "totalStudents": 1420,
    "activeProjects": 85,
    "coursePassRate": 94.2,
    "averageQuizScore": 86.8
  }
}
```

---

## 16. Parent Oversight (`/api/parents`)

### 16.1 Get Linked Children
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/parents/children`
* **Access:** Parent, Super Admin
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "studentId": "d7ad5952-d5b7-41a7-afbe-8b9191a1aa8d",
      "name": "Alex Mercer",
      "rollNumber": "CS2026-042"
    }
  ]
}
```

### 16.2 Link Child Account
* **Method:** `POST`
* **Endpoint:** `http://localhost:5000/api/parents/link-child`
* **Access:** Parent
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
```json
{
  "studentRollNumber": "CS2026-042",
  "verificationPin": "892011"
}
```
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Student account linked successfully."
}
```

### 16.3 Get Child Weekly Digest Report
* **Method:** `GET`
* **Endpoint:** `http://localhost:5000/api/parents/reports/weekly/d7ad5952-d5b7-41a7-afbe-8b9191a1aa8d`
* **Access:** Parent
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:** None
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "studentName": "Alex Mercer",
    "attendanceRate": "98%",
    "weeklyHoursSpent": 18.5,
    "milestonesCompleted": 2
  }
}
```
