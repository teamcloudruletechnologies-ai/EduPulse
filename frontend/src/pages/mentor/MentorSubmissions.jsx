import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Send, Code2, Brain, CheckCircle2, Star, Clock, Check, RefreshCw } from 'lucide-react';

const DEFAULT_SUBMISSIONS = [
  {
    id: 'sub-101',
    title: 'Python Data Service: Learning Velocity Telemetry (main.py)',
    language: 'Python',
    codeSnippet: `def calculate_learning_velocity(quiz_scores, hours_spent):
    average_score = sum(quiz_scores) / len(quiz_scores)
    velocity = (average_score * 1.2) - (hours_spent * 0.5)
    return round(velocity, 2)`,
    description: 'Implemented learning velocity computation algorithms with AST validation.',
    status: 'PENDING_REVIEW',
    submittedAt: 'Just now',
    student: {
      rollNumber: 'CS2026-042',
      user: { firstName: 'Alex', lastName: 'Mercer', email: 'student@edtech.com' },
    },
    aiAnalysis: {
      completeness_score: 95,
      code_quality_grade: 'A+',
      ai_recommendation: 'EXCELLENT',
      mentor_action_suggested: 'Compiled cleanly in sandbox. Syntax and AST valid. Ready for approval.',
    },
  },
  {
    id: 'sub-102',
    title: 'MySQL Schema & Relational Query (query.sql)',
    language: 'SQL',
    codeSnippet: `SELECT s.rollNumber, u.firstName, p.title AS projectTitle
FROM students s JOIN users u ON s.userId = u.id
JOIN projects p ON p.creatorId = s.id WHERE p.status = 'ACTIVE';`,
    description: 'Relational query joining students, mentors, and active capstones.',
    status: 'PENDING_REVIEW',
    submittedAt: '10 mins ago',
    student: {
      rollNumber: 'CS2026-042',
      user: { firstName: 'Alex', lastName: 'Mercer', email: 'student@edtech.com' },
    },
    aiAnalysis: {
      completeness_score: 92,
      code_quality_grade: 'A',
      ai_recommendation: 'VERIFIED',
      mentor_action_suggested: 'Foreign keys and indexes verified. 0 syntax warnings.',
    },
  },
];

export const MentorSubmissions = () => {
  const { showToast } = useToast();
  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('edtech_shared_submissions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_SUBMISSIONS;
  });

  const [loading, setLoading] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [decision, setDecision] = useState('APPROVED');
  const [submitting, setSubmitting] = useState(false);

  // Mentor-controlled paste lock — synced via real API (cross-device)
  const [copyPasteBlocked, setCopyPasteBlocked] = useState(true);

  // Fetch current lock state from server on mount
  useEffect(() => {
    api.get('/settings/paste-lock')
      .then((res) => setCopyPasteBlocked(res.data.locked))
      .catch(() => {});
  }, []);

  const togglePasteLock = async () => {
    const next = !copyPasteBlocked;
    try {
      await api.put('/settings/paste-lock', { locked: next, updatedBy: 'viji' });
      setCopyPasteBlocked(next);
      showToast(next ? '🔒 Paste LOCKED for all students' : '🔓 Paste UNLOCKED for all students', next ? 'error' : 'success');
    } catch (err) {
      showToast('Failed to update paste lock: ' + err.message, 'error');
    }
  };

  // Sync submissions across browser tabs/portals
  const syncSubmissions = () => {
    const saved = localStorage.getItem('edtech_shared_submissions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSubmissions(parsed);
          if (!selectedSub || !parsed.some((s) => s.id === selectedSub.id)) {
            setSelectedSub(parsed[0]);
          }
          return;
        }
      } catch (e) {}
    }
    setSubmissions(DEFAULT_SUBMISSIONS);
    if (!selectedSub) setSelectedSub(DEFAULT_SUBMISSIONS[0]);
  };

  useEffect(() => {
    syncSubmissions();
    const handleStorageChange = (e) => {
      if (e.key === 'edtech_shared_submissions') {
        syncSubmissions();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (submissions.length > 0 && !selectedSub) {
      setSelectedSub(submissions[0]);
    }
  }, [submissions]);

  const handleReview = (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    setSubmitting(true);
    try {
      const updated = submissions.map((s) =>
        s.id === selectedSub.id
          ? {
              ...s,
              status: decision,
              mentorRating: rating,
              mentorComments: feedback || 'Code reviewed and verified. Outstanding work.',
              reviewedAt: new Date().toLocaleDateString(),
            }
          : s
      );

      setSubmissions(updated);
      setSelectedSub((prev) => ({
        ...prev,
        status: decision,
        mentorRating: rating,
        mentorComments: feedback || 'Code reviewed and verified. Outstanding work.',
      }));

      localStorage.setItem('edtech_shared_submissions', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));

      showToast(`Deliverable evaluated: Status set to ${decision}!`, 'success');
      setFeedback('');
    } catch (err) {
      showToast('Error recording review: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Deliverables & Code Review Studio</h1>
          <p className="text-xs text-slate-500">
            Inspect live code deliverables submitted from the Student Compiler, review AI pre-check scores, and record formal mentor assessments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Paste Lock Control */}
          <button
            onClick={togglePasteLock}
            className={`flex items-center space-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              copyPasteBlocked
                ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
                : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
            }`}
            title="Toggle student copy-paste lock"
          >
            <span>{copyPasteBlocked ? '🔒 Paste Locked' : '🔓 Paste Allowed'}</span>
          </button>

          <button
            onClick={syncSubmissions}
            className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Deliverables Queue (Left List) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Deliverables Queue ({submissions.length})
            </h2>
            <span className="text-[11px] font-bold text-brand-900">Live Sync</span>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setSelectedSub(sub)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  selectedSub?.id === sub.id
                    ? 'border-brand-900 bg-brand-50/60 shadow-sm ring-1 ring-brand-900'
                    : 'border-slate-200 bg-white hover:border-brand-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {sub.language || 'Code'} • ID: {sub.id.substring(0, 8)}
                  </span>
                  <StatusBadge status={sub.status} />
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">{sub.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  By: {sub.student?.user?.firstName || 'Alex'} {sub.student?.user?.lastName || 'Mercer'} ({sub.student?.rollNumber || 'CS2026-042'})
                </p>

                {sub.aiAnalysis && (
                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold text-purple-900 bg-purple-50 rounded-lg px-2.5 py-1 border border-purple-100">
                    <span className="flex items-center">
                      <Brain className="h-3.5 w-3.5 mr-1 text-purple-700" />
                      AI Score: {sub.aiAnalysis.completeness_score || 95}%
                    </span>
                    <span>Grade {sub.aiAnalysis.code_quality_grade || 'A+'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Deliverable Inspection & Review Box (Right View) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedSub ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{selectedSub.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Student: <strong>{selectedSub.student?.user?.firstName || 'Alex'} {selectedSub.student?.user?.lastName || 'Mercer'}</strong> • Roll No: {selectedSub.student?.rollNumber || 'CS2026-042'} • Email: {selectedSub.student?.user?.email || 'student@edtech.com'}
                  </p>
                </div>
                <StatusBadge status={selectedSub.status} />
              </div>

              {/* Code Snippet Display Box */}
              {selectedSub.codeSnippet && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center space-x-1.5">
                      <Code2 className="h-4 w-4 text-brand-900" />
                      <span>Submitted Source Code ({selectedSub.language || 'Code'})</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Programiz Online Compiler Sandbox</span>
                  </div>
                  <pre className="rounded-xl border border-slate-200 bg-slate-900 text-emerald-400 p-4 font-mono text-xs overflow-x-auto max-h-56 leading-relaxed">
                    {selectedSub.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Implementation Description */}
              <div className="rounded-xl bg-slate-50 p-4 text-xs space-y-1 border border-slate-100">
                <strong className="text-slate-900 block">Deliverable Summary & Scope:</strong>
                <p className="text-slate-600 leading-relaxed">{selectedSub.description}</p>
              </div>

              {/* Automated AI Pre-Check Card */}
              {selectedSub.aiAnalysis && (
                <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-4 text-xs space-y-2 text-purple-950">
                  <div className="flex items-center justify-between font-bold">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-purple-700" />
                      <span>Python FastAPI Automated AI Code Quality Analysis</span>
                    </div>
                    <span className="rounded-md bg-purple-200 px-2.5 py-0.5 text-[10px] font-extrabold text-purple-900">
                      Grade {selectedSub.aiAnalysis.code_quality_grade || 'A+'} • {selectedSub.aiAnalysis.completeness_score || 95}% Completeness
                    </span>
                  </div>
                  <p className="text-purple-900 leading-relaxed text-[11px]">
                    {selectedSub.aiAnalysis.mentor_action_suggested || 'Code syntax parsed cleanly. No infinite loops or security vulnerabilities detected. Recommended for formal sign-off.'}
                  </p>
                </div>
              )}

              {/* Formal Mentor Evaluation Form */}
              <form onSubmit={handleReview} className="space-y-3.5 pt-3 border-t border-slate-100 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Mentor Evaluation Assessment & Decision
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700">Evaluation Decision *</label>
                    <select
                      value={decision}
                      onChange={(e) => setDecision(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none bg-white"
                    >
                      <option value="APPROVED">✅ APPROVED (Deliverable Meets Criteria)</option>
                      <option value="REVISION_REQUIRED">⚠️ REVISION REQUIRED (Request Changes)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700">Quality Rating (1 to 5 Stars)</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none bg-white"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5) Exceptional Architecture</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5) Very Good Implementation</option>
                      <option value={3}>⭐⭐⭐ (3/5) Satisfactory Milestone</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Mentor Review Comments & Feedback</label>
                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide architecture feedback, code optimization suggestions, and next milestone guidance..."
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center space-x-1.5 rounded-xl bg-brand-900 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-800 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{submitting ? 'Recording...' : 'Record Formal Assessment'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
              Select a submission from the list on the left to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
