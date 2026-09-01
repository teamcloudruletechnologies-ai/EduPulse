# EdTech Platform - Production Setup Guide

## System Architecture

```
React.js Frontend (Port 3000)
       ↓ (REST APIs & JWT Auth)
Node.js + Express + TypeScript Backend (Port 5000)
       ↓                                ↓
PostgreSQL Database (Port 5432)   Python FastAPI Microservice (Port 8000)
```

## Quick Start Instructions

### 1. Database Configuration
Update `backend/node-api/.env` with your PostgreSQL database credentials:
```env
DATABASE_URL=postgresql://root:root%40123@localhost:5432/edtech_db?schema=public
```

### 2. Install Dependencies & Generate Prisma Client
```bash
# Node.js API Dependencies
cd backend/node-api
npm install
npm run prisma:generate

# Python Microservice Dependencies
cd ../python-service
pip install -r requirements.txt

# React Frontend Dependencies
cd "../../frontend"
npm install
```

### 3. Database Migration & Seed Data
```bash
# Push Prisma Schema to PostgreSQL
cd backend/node-api
npm run prisma:push

# Populate Demo Data (SuperAdmin, InstAdmin, Mentor, Parent, Student, Courses, Projects)
npm run prisma:seed
```

### 4. Running the Platform Services

**Node.js REST API (Port 5000):**
```bash
cd backend/node-api
npm run dev
```

**Python FastAPI Microservice (Port 8000):**
```bash
cd backend/python-service
uvicorn main:app --reload --port 8000
```

**React Frontend (Port 3000):**
```bash
cd frontend
npm run dev
```

---

## Pre-Configured Demo Credentials

| Portal | Role | Demo Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Student Portal** | `STUDENT` | `student@edtech.com` | `Password123!` | Courses, Quizzes, Projects, Tasks, Submissions, Badges, Certs |
| **Parent Portal** | `PARENT` | `parent@edtech.com` | `Password123!` | **Strict Read-Only Access** to linked child progress & reports |
| **Institution Portal** | `INSTITUTION_ADMIN` | `institution@edtech.com` | `Password123!` | Student & Faculty management, Batches, Attendance, Announcements |
| **Super Admin Portal** | `SUPER_ADMIN` | `admin@edtech.com` | `Password123!` | Institution verification, Global platform analytics, Audit logs |
