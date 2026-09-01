import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Users, UserPlus, Trash2, Mail, CheckCircle2, X, Plus } from 'lucide-react';

export const InstitutionFaculty = () => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [staffList, setStaffList] = useState([
    {
      id: 'stf-1',
      name: 'Dr. Robert Langdon',
      email: 'mentor@edtech.com',
      role: 'Senior Industry Mentor',
      department: 'Computer Science & AI',
      status: 'Active',
    },
    {
      id: 'stf-2',
      name: 'Prof. Alan Turing',
      email: 'faculty@edtech.com',
      role: 'Faculty Advisor',
      department: 'Distributed Systems',
      status: 'Active',
    },
    {
      id: 'stf-3',
      name: 'Eleanor Vance',
      email: 'institution@edtech.com',
      role: 'Institution Coordinator',
      department: 'Academic Administration',
      status: 'Active',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Faculty Advisor',
    department: 'Computer Science & AI',
  });

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Please enter staff name and email.', 'error');
      return;
    }

    setSubmitting(true);
    const newMember = {
      id: 'stf-' + Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      status: 'Active',
    };

    setStaffList((prev) => [newMember, ...prev]);
    showToast(`Staff member "${formData.name}" added successfully!`, 'success');
    setFormData({ name: '', email: '', role: 'Faculty Advisor', department: 'Computer Science & AI' });
    setIsModalOpen(false);
    setSubmitting(false);
  };

  const handleDeleteStaff = (id, name) => {
    if (window.confirm(`Are you sure you want to remove staff member "${name}"?`)) {
      setStaffList((prev) => prev.filter((s) => s.id !== id));
      showToast(`Staff member "${name}" removed.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Faculty & Staff Management</h1>
          <p className="text-xs text-slate-500">Add, manage, and assign faculty advisors, department coordinators, and technical mentors</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 rounded-xl bg-brand-900 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-800 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          <span>+ Add Staff / Faculty</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-900 font-extrabold text-sm">
                  {item.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                  <span className="inline-block rounded-md bg-brand-50 border border-brand-200 px-2 py-0.5 text-[10px] font-bold text-brand-900 mt-0.5">
                    {item.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 space-y-1.5 border border-slate-100">
              <p><strong className="text-slate-900">Department:</strong> {item.department}</p>
              <p><strong className="text-slate-900">Email:</strong> {item.email}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> {item.status}
              </span>

              <button
                onClick={() => handleDeleteStaff(item.id, item.name)}
                className="inline-flex items-center space-x-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-900">
                  <UserPlus className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Add Staff Member</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Prof. Charles Xavier"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="staff@institution.edu"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Staff Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                >
                  <option value="Faculty Advisor">Faculty Advisor</option>
                  <option value="Senior Industry Mentor">Senior Industry Mentor</option>
                  <option value="Institution Coordinator">Institution Coordinator</option>
                  <option value="Department Head">Department Head</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Academic Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Computer Science & AI"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-1.5 rounded-xl bg-brand-900 px-5 py-2 text-xs font-bold text-white shadow hover:bg-brand-800"
                >
                  <Plus className="h-4 w-4" />
                  <span>{submitting ? 'Saving...' : 'Add Staff Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
