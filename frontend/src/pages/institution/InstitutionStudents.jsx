import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { GraduationCap, Search, UserPlus, Trash2, Mail, CheckCircle, X, Plus } from 'lucide-react';

export const InstitutionStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    rollNumber: '',
    program: 'B.Tech Computer Science & AI',
    batch: 'Batch 2026-Alpha',
  });

  const loadStudents = () => {
    api.get('/students/all')
      .then((res) => {
        if (res.data?.success) setStudents(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.rollNumber) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const newStudent = {
        id: 'std-' + Date.now(),
        rollNumber: formData.rollNumber,
        user: {
          id: 'usr-' + Date.now(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        },
        program: { name: formData.program },
        batch: { name: formData.batch },
      };

      setStudents((prev) => [newStudent, ...prev]);
      showToast(`Student ${formData.firstName} ${formData.lastName} enrolled successfully!`, 'success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        rollNumber: '',
        program: 'B.Tech Computer Science & AI',
        batch: 'Batch 2026-Alpha',
      });
      setIsModalOpen(false);
    } catch (err) {
      showToast('Error adding student: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStudent = (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to remove student "${studentName}" from the institution?`)) {
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      showToast(`Student ${studentName} removed successfully.`, 'info');
    }
  };

  const filtered = students.filter((s) => {
    const name = `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.toLowerCase();
    const email = (s.user?.email || '').toLowerCase();
    const roll = (s.rollNumber || '').toLowerCase();
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase()) || roll.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Enrollment & Management</h1>
          <p className="text-xs text-slate-500">Manage enrolled students, assign roll numbers, cohorts, and remove student profiles</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 rounded-xl bg-brand-900 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-800 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          <span>+ Enroll New Student</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-xs">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name, email address, or roll number..."
          className="w-full focus:outline-none text-xs"
        />
      </div>

      {/* Student Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-4">Student Name</th>
                <th className="p-4">Roll Number</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Program & Batch</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      {s.user?.firstName} {s.user?.lastName}
                    </td>
                    <td className="p-4 font-mono text-brand-900 font-bold">{s.rollNumber || 'CS2026-042'}</td>
                    <td className="p-4 text-slate-600">{s.user?.email}</td>
                    <td className="p-4 text-slate-600">{s.program?.name || 'B.Tech CS & AI'} ({s.batch?.name || '2026-Alpha'})</td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle className="h-3 w-3 mr-1" /> Active
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteStudent(s.id, `${s.user?.firstName} ${s.user?.lastName}`)}
                        className="inline-flex items-center space-x-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-slate-400">
                    {loading ? 'Loading students...' : 'No students found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Interactive Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-900">
                  <UserPlus className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Enroll New Student</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Alex"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Mercer"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Student Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@institution.edu"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Roll Number / Student ID *</label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  placeholder="e.g. CS2026-105"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Academic Program</label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  >
                    <option value="B.Tech Computer Science & AI">B.Tech Computer Science & AI</option>
                    <option value="B.Tech Data Science">B.Tech Data Science</option>
                    <option value="B.Tech Cloud Architecture">B.Tech Cloud Architecture</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Batch Cohort</label>
                  <select
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  >
                    <option value="Batch 2026-Alpha">Batch 2026-Alpha</option>
                    <option value="Batch 2026-Beta">Batch 2026-Beta</option>
                  </select>
                </div>
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
                  <span>{submitting ? 'Enrolling...' : 'Confirm Enrollment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
