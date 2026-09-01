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
          <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            👨‍🏫 Mentor & 🎓 Students
          </p>

          {/* Mentor Viji */}
          <div className="mb-3">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('VIJI')}
              className="w-full rounded-xl border border-purple-300 bg-purple-50 p-2.5 text-left hover:bg-purple-100 transition-all shadow-xs flex items-center justify-between"
            >
              <div>
                <span className="block text-xs font-extrabold text-purple-950">👨‍🏫 Viji (Mentor)</span>
                <span className="text-[10px] text-purple-700">viji@edtech.com • Lead Tech Mentor</span>
              </div>
              <span className="text-xs font-bold text-purple-800 bg-purple-200 px-2 py-0.5 rounded-md">Host</span>
            </button>
          </div>

          {/* 5 Students: Sailesh, Sujitha, Isaac, Harrish, Praveen */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('SAILESH')}
              className="rounded-xl border border-blue-200 bg-blue-50 p-2 text-left hover:bg-blue-100 transition-colors shadow-xs"
            >
              <span className="block text-xs font-bold text-blue-950">🎓 Sailesh</span>
              <span className="text-[9px] text-blue-700">sailesh@edtech.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('SUJITHA')}
              className="rounded-xl border border-pink-200 bg-pink-50 p-2 text-left hover:bg-pink-100 transition-colors shadow-xs"
            >
              <span className="block text-xs font-bold text-pink-950">🎓 Sujitha</span>
              <span className="text-[9px] text-pink-700">sujitha@edtech.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ISAAC')}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-left hover:bg-emerald-100 transition-colors shadow-xs"
            >
              <span className="block text-xs font-bold text-emerald-950">🎓 Isaac</span>
              <span className="text-[9px] text-emerald-700">isaac@edtech.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('HARRISH')}
              className="rounded-xl border border-amber-200 bg-amber-50 p-2 text-left hover:bg-amber-100 transition-colors shadow-xs"
            >
              <span className="block text-xs font-bold text-amber-950">🎓 Harrish</span>
              <span className="text-[9px] text-amber-700">harrish@edtech.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('PRAVEEN')}
              className="col-span-2 rounded-xl border border-indigo-200 bg-indigo-50 p-2 text-left hover:bg-indigo-100 transition-colors shadow-xs"
            >
              <span className="block text-xs font-bold text-indigo-950">🎓 Praveen</span>
              <span className="text-[9px] text-indigo-700">praveen@edtech.com</span>
            </button>
          </div>

          <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Password for all: <strong className="text-slate-600 font-mono">Password123!</strong></span>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('SUPER_ADMIN')}
              className="text-emerald-700 font-semibold hover:underline"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
