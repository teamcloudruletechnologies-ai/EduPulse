import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Menu } from 'lucide-react';

// Auth Pages
import { Login } from './pages/auth/Login';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyLearning } from './pages/student/MyLearning';
import { StudentProjects } from './pages/student/StudentProjects';
import { ProjectCreate } from './pages/student/ProjectCreate';
import { StudentTasks } from './pages/student/StudentTasks';
import { StudentSubmissions } from './pages/student/StudentSubmissions';
import { StudentAchievements } from './pages/student/StudentAchievements';
import { StudentMessages } from './pages/student/StudentMessages';
import { StudentNotifications } from './pages/student/StudentNotifications';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentMeetings } from './pages/student/StudentMeetings';

// Mentor Pages
import { MentorDashboard } from './pages/mentor/MentorDashboard';
import { MentorProjects } from './pages/mentor/MentorProjects';
import { MentorCourses } from './pages/mentor/MentorCourses';
import { MentorSubmissions } from './pages/mentor/MentorSubmissions';
import { MentorSessions } from './pages/mentor/MentorSessions';
import { MentorMessages } from './pages/mentor/MentorMessages';

// Institution Pages
import { InstitutionDashboard } from './pages/institution/InstitutionDashboard';
import { InstitutionStudents } from './pages/institution/InstitutionStudents';
import { InstitutionFaculty } from './pages/institution/InstitutionFaculty';
import { InstitutionAnalytics } from './pages/institution/InstitutionAnalytics';
import { InstitutionAnnouncements } from './pages/institution/InstitutionAnnouncements';

// Super Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminInstitutions } from './pages/admin/AdminInstitutions';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminRecordedClasses } from './pages/admin/AdminRecordedClasses';

// Standalone Live Video Meeting Room

import { LiveMeetingRoom } from './pages/meeting/LiveMeetingRoom';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  React.useEffect(() => {
    const handleToggle = () => setIsSidebarOpen((prev) => !prev);
    window.addEventListener('edtech_toggle_sidebar', handleToggle);
    return () => window.removeEventListener('edtech_toggle_sidebar', handleToggle);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className={`flex-1 p-4 sm:p-6 overflow-y-auto w-full transition-all duration-200 ${isSidebarOpen ? 'max-w-7xl mx-auto' : 'max-w-full px-6'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xs font-semibold">
        Authenticating session...
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <MainLayout>{children}</MainLayout>;
};

export const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/meeting/:roomId" element={<LiveMeetingRoom />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/submissions" element={<ProtectedRoute><StudentSubmissions /></ProtectedRoute>} />
            <Route path="/student/learning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />
            <Route path="/student/meetings" element={<ProtectedRoute><StudentMeetings /></ProtectedRoute>} />
            <Route path="/student/projects" element={<ProtectedRoute><StudentProjects /></ProtectedRoute>} />
            <Route path="/student/projects/create" element={<ProtectedRoute><ProjectCreate /></ProtectedRoute>} />
            <Route path="/student/tasks" element={<ProtectedRoute><StudentTasks /></ProtectedRoute>} />
            <Route path="/student/achievements" element={<ProtectedRoute><StudentAchievements /></ProtectedRoute>} />
            <Route path="/student/messages" element={<ProtectedRoute><StudentMessages /></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute><StudentNotifications /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="/student/settings" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="/student/*" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />

            {/* Mentor Routes */}
            <Route path="/mentor/dashboard" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
            <Route path="/mentor/projects" element={<ProtectedRoute><MentorProjects /></ProtectedRoute>} />
            <Route path="/mentor/courses" element={<ProtectedRoute><MentorCourses /></ProtectedRoute>} />
            <Route path="/mentor/submissions" element={<ProtectedRoute><MentorSubmissions /></ProtectedRoute>} />
            <Route path="/mentor/sessions" element={<ProtectedRoute><MentorSessions /></ProtectedRoute>} />
            <Route path="/mentor/messages" element={<ProtectedRoute><MentorMessages /></ProtectedRoute>} />
            <Route path="/mentor/*" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />

            {/* Institution Routes */}
            <Route path="/institution/dashboard" element={<ProtectedRoute><InstitutionDashboard /></ProtectedRoute>} />
            <Route path="/institution/students" element={<ProtectedRoute><InstitutionStudents /></ProtectedRoute>} />
            <Route path="/institution/faculty" element={<ProtectedRoute><InstitutionFaculty /></ProtectedRoute>} />
            <Route path="/institution/progress" element={<ProtectedRoute><InstitutionAnalytics /></ProtectedRoute>} />
            <Route path="/institution/attendance" element={<ProtectedRoute><InstitutionAnalytics /></ProtectedRoute>} />
            <Route path="/institution/reports" element={<ProtectedRoute><InstitutionAnalytics /></ProtectedRoute>} />
            <Route path="/institution/announcements" element={<ProtectedRoute><InstitutionAnnouncements /></ProtectedRoute>} />
            <Route path="/institution/settings" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="/institution/*" element={<ProtectedRoute><InstitutionDashboard /></ProtectedRoute>} />

            {/* Super Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/recorded-classes" element={<ProtectedRoute><AdminRecordedClasses /></ProtectedRoute>} />
            <Route path="/admin/institutions" element={<ProtectedRoute><AdminInstitutions /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/admin/audit-logs" element={<ProtectedRoute><AdminAuditLogs /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />


            {/* Default Fallback */}
            <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
