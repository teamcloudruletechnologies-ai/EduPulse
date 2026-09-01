import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('student@edtech.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const { login, switchDemoRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      showToast(`Welcome back, ${res?.user?.firstName || 'User'}!`, 'success');
      const role = res?.user?.role || 'STUDENT';
      const redirectMap = {
        STUDENT: '/student/dashboard',
        MENTOR: '/mentor/dashboard',
        INSTITUTION_ADMIN: '/institution/dashboard',
        SUPER_ADMIN: '/admin/dashboard',
      };
      navigate(redirectMap[role] || '/student/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role) => {
    try {
      const res = await switchDemoRole(role);
      showToast(`Logged in as ${role.replace('_', ' ')}!`, 'success');
      const redirectMap = {
        STUDENT: '/student/dashboard',
        MENTOR: '/mentor/dashboard',
        INSTITUTION_ADMIN: '/institution/dashboard',
        SUPER_ADMIN: '/admin/dashboard',
      };
      navigate(redirectMap[role] || '/student/dashboard');
    } catch (err) {
      showToast('Error switching demo account: ' + err.message, 'error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-900 text-white shadow-lg">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900">EduPulse Platform</h2>
          <p className="mt-1 text-xs text-slate-500">Sign in to your learning, mentor, or campus portal</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-brand-900 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-800 transition-colors"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Demo Quick Logins */}
        <div className="border-t border-slate-200 pt-6">
          <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Instant Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleQuickDemoLogin('STUDENT')}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:bg-brand-50 hover:border-brand-300 transition-colors shadow-xs"
            >
              <span className="block text-xs font-bold text-slate-900">🎓 Student</span>
              <span className="text-[10px] text-slate-500">Learning & Tasks</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('MENTOR')}
              className="rounded-xl border border-purple-200 bg-purple-50 p-3 text-left hover:bg-purple-100 transition-colors shadow-xs"
            >
              <span className="block text-xs font-bold text-purple-950">👨‍🏫 Mentor</span>
              <span className="text-[10px] text-purple-700">Projects & Reviews</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('INSTITUTION_ADMIN')}
              className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-left hover:bg-blue-100 transition-colors shadow-xs"
            >
              <span className="block text-xs font-bold text-blue-950">🏛️ Institution</span>
              <span className="text-[10px] text-blue-700">Students & Staff</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('SUPER_ADMIN')}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left hover:bg-emerald-100 transition-colors shadow-xs"
            >
              <span className="block text-xs font-bold text-emerald-950">🛡️ Super Admin</span>
              <span className="text-[10px] text-emerald-700">System Controls</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
