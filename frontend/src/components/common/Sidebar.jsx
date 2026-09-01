import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  FolderGit2,
  CheckSquare,
  Users,
  Send,
  Award,
  MessageSquare,
  Bell,
  User,
  Settings,
  GraduationCap,
  CalendarCheck,
  FileText,
  LogOut,
  Video,
  BarChart3,
  Building2,
  ShieldAlert,
  Code2,
  ChevronDown,
  Terminal,
  FileCode2,
  X,
  Menu,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = user?.role || 'STUDENT';

  const [compilerMenuOpen, setCompilerMenuOpen] = useState(() => {
    return location.pathname.includes('/student/submissions');
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggle = () => {
    if (onToggle) onToggle();
    else window.dispatchEvent(new CustomEvent('edtech_toggle_sidebar'));
  };

  const getStudentItems = () => [
    { label: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    {
      label: 'EduPulse Compiler',
      isDropdown: true,
      icon: <Code2 className="h-4 w-4" />,
      subItems: [
        { label: 'Online IDE', path: '/student/submissions?tab=editor', icon: <Terminal className="h-3.5 w-3.5" /> },
        { label: 'My Submissions', path: '/student/submissions?tab=history', icon: <FileCode2 className="h-3.5 w-3.5" /> },
      ],
    },
    { label: 'My Learning Courses', path: '/student/learning', icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Scheduled Meetings', path: '/student/meetings', icon: <Video className="h-4 w-4" /> },
    { label: 'Capstone Projects', path: '/student/projects', icon: <FolderGit2 className="h-4 w-4" /> },
    { label: 'Tasks Kanban', path: '/student/tasks', icon: <CheckSquare className="h-4 w-4" /> },
    { label: 'Achievements', path: '/student/achievements', icon: <Award className="h-4 w-4" /> },
    { label: 'Live Mentor Chat', path: '/student/messages', icon: <MessageSquare className="h-4 w-4" /> },
    { label: 'Notifications', path: '/student/notifications', icon: <Bell className="h-4 w-4" /> },
    { label: 'Profile & Settings', path: '/student/profile', icon: <User className="h-4 w-4" /> },
  ];

  const getMentorItems = () => [
    { label: 'Mentor Dashboard', path: '/mentor/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Create & Manage Projects', path: '/mentor/projects', icon: <FolderGit2 className="h-4 w-4" /> },
    { label: 'Add Courses & Lessons', path: '/mentor/courses', icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Review Submissions', path: '/mentor/submissions', icon: <Send className="h-4 w-4" /> },
    { label: 'Schedule Meetings', path: '/mentor/sessions', icon: <Video className="h-4 w-4" /> },
    { label: 'Live Student Chat', path: '/mentor/messages', icon: <MessageSquare className="h-4 w-4" /> },
    { label: 'Profile & Settings', path: '/student/profile', icon: <User className="h-4 w-4" /> },
  ];

  const getInstitutionItems = () => [
    { label: 'Campus Dashboard', path: '/institution/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Student Management', path: '/institution/students', icon: <GraduationCap className="h-4 w-4" /> },
    { label: 'Staff & Faculty Management', path: '/institution/faculty', icon: <Users className="h-4 w-4" /> },
    { label: 'Progress & Attendance', path: '/institution/progress', icon: <CalendarCheck className="h-4 w-4" /> },
    { label: 'Analytics & Reports', path: '/institution/reports', icon: <FileText className="h-4 w-4" /> },
    { label: 'Announcements', path: '/institution/announcements', icon: <Bell className="h-4 w-4" /> },
    { label: 'Settings', path: '/student/profile', icon: <Settings className="h-4 w-4" /> },
  ];

  const getAdminItems = () => [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Institutions Verification', path: '/admin/institutions', icon: <Building2 className="h-4 w-4" /> },
    { label: 'Users Management', path: '/admin/users', icon: <Users className="h-4 w-4" /> },
    { label: 'Platform Analytics', path: '/admin/analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Security & Audit Logs', path: '/admin/audit-logs', icon: <ShieldAlert className="h-4 w-4" /> },
    { label: 'Settings', path: '/student/profile', icon: <Settings className="h-4 w-4" /> },
  ];

  let items = [];
  if (role === 'MENTOR') items = getMentorItems();
  else if (role === 'INSTITUTION_ADMIN' || role === 'FACULTY' || role === 'COORDINATOR') items = getInstitutionItems();
  else if (role === 'SUPER_ADMIN') items = getAdminItems();
  else items = getStudentItems();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 border-r border-slate-200 bg-white flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isOpen
            ? 'w-64 p-4 translate-x-0 shadow-2xl md:shadow-none'
            : '-translate-x-full md:translate-x-0 md:w-16 md:p-2'
        } min-h-[calc(100vh-4rem)]`}
      >
        <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)] pr-0.5">
          {/* Header Toggle in exact place */}
          {isOpen ? (
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 pb-2 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {role === 'MENTOR' ? 'Mentor Workspace' : role === 'INSTITUTION_ADMIN' ? 'Institution Menu' : role === 'SUPER_ADMIN' ? 'Admin Controls' : 'Student Menu'}
              </span>
              <button
                onClick={handleToggle}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Collapse Sidebar (✕)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* When collapsed, in that exact place show Hamburger Menu ☰ */
            <div className="flex items-center justify-center py-1 border-b border-slate-100 pb-2 mb-2">
              <button
                onClick={handleToggle}
                className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors cursor-pointer"
                title="Expand Sidebar (☰)"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Navigation Items */}
          {items.map((item) => {
            if (item.isDropdown) {
              const isChildActive = location.pathname.includes('/student/submissions');

              if (!isOpen) {
                // Collapsed Dropdown Item (Single Icon with Tooltip)
                return (
                  <NavLink
                    key={item.label}
                    to="/student/submissions?tab=editor"
                    className={`flex items-center justify-center rounded-xl p-2.5 text-xs font-semibold transition-all ${
                      isChildActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    title="EduPulse Compiler"
                  >
                    {item.icon}
                  </NavLink>
                );
              }

              return (
                <div key={item.label} className="space-y-1">
                  <button
                    onClick={() => setCompilerMenuOpen(!compilerMenuOpen)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      isChildActive
                        ? 'bg-blue-50 text-blue-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                        compilerMenuOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  {compilerMenuOpen && (
                    <div className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-blue-200 ml-5 animate-slide-left">
                      {item.subItems.map((sub) => {
                        const isSubActive =
                          (sub.path.includes('tab=editor') && (location.search.includes('tab=editor') || !location.search.includes('tab='))) ||
                          (sub.path.includes('tab=history') && location.search.includes('tab=history'));

                        return (
                          <NavLink
                            key={sub.path}
                            to={sub.path}
                            onClick={() => {
                              if (onClose) onClose();
                            }}
                            className={`flex items-center space-x-2.5 rounded-lg px-2.5 py-2 text-[11px] font-semibold transition-all ${
                              isSubActive
                                ? 'bg-blue-600 text-white shadow-xs font-bold'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            {sub.icon}
                            <span>{sub.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (onClose) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center ${isOpen ? 'space-x-3 px-3 py-2.5' : 'justify-center p-2.5'} rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
                title={!isOpen ? item.label : undefined}
              >
                {item.icon}
                {isOpen && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Section: User Info Card & Logout Button */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          {isOpen ? (
            <>
              <div className="flex items-center space-x-3 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 font-bold text-xs text-white shadow-xs">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user?.firstName} {user?.lastName || ''}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 truncate">
                    {user?.email || 'user@edtech.com'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center space-x-2 rounded-xl border border-rose-200 bg-rose-50/70 px-3 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-xs cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 font-bold text-xs text-white shadow-xs"
                title={`${user?.firstName || ''} ${user?.lastName || ''}`}
              >
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
