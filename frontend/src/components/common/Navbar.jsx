import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Bell, Sparkles, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = async (e) => {
    const newRole = e.target.value;
    await switchDemoRole(newRole);
    const redirectMap = {
      STUDENT: '/student/dashboard',
      MENTOR: '/mentor/dashboard',
      INSTITUTION_ADMIN: '/institution/dashboard',
      SUPER_ADMIN: '/admin/dashboard',
    };
    navigate(redirectMap[newRole] || '/student/dashboard');
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white shadow-xs">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left Side: Brand Header */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-none">EduPulse</h1>
              <p className="text-[10px] text-slate-500 hidden sm:block mt-0.5">EdTech Learning & Project Management</p>
            </div>
          </div>
        </div>

        {/* Right Section Controls */}
        <div className="flex items-center space-x-3">
          {/* Active Portal Switcher */}
          <div className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700">
            <Shield className="h-3.5 w-3.5 text-brand-900 shrink-0" />
            <span className="hidden md:inline font-medium text-slate-500">Portal:</span>
            <select
              value={user?.role || 'STUDENT'}
              onChange={handleRoleSwitch}
              className="bg-transparent font-bold text-brand-900 focus:outline-none cursor-pointer text-xs"
            >
              <option value="STUDENT">🎓 Student Portal</option>
              <option value="MENTOR">👨‍🏫 Mentor Portal</option>
              <option value="INSTITUTION_ADMIN">🏛️ Institution Portal</option>
              <option value="SUPER_ADMIN">🛡️ Super Admin Portal</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-bold text-xs text-brand-900">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">{user ? `${user.firstName} ${user.lastName}` : 'Guest User'}</p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">{user?.role || 'STUDENT'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
