import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Building2, GraduationCap, Shield, Save } from 'lucide-react';

export const StudentProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">User Profile & Account Settings</h1>
        <p className="text-xs text-slate-500">Manage your profile details, contact preferences, and academic identity</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-900 text-white text-xl font-extrabold shadow-md">
            {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'M'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user?.firstName} {user?.lastName || 'User'}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="mt-1 inline-block rounded-full bg-brand-50 border border-brand-200 px-2.5 py-0.5 text-[10px] font-bold text-brand-900">
              Role: {user?.role || 'STUDENT'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700">First Name</label>
            <input
              type="text"
              defaultValue={user?.firstName || 'Alex'}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700">Last Name</label>
            <input
              type="text"
              defaultValue={user?.lastName || 'Mercer'}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              disabled
              defaultValue={user?.email || 'student@edtech.com'}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700">Affiliated Institution</label>
            <input
              type="text"
              disabled
              defaultValue="Apex Institute of Technology & Engineering"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => alert('Profile settings updated successfully!')}
            className="flex items-center space-x-1.5 rounded-lg bg-brand-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-800"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
