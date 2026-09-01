import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const ProjectCreate = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problemStatement: '',
    objectives: '',
    techStack: '',
    teamMembers: '',
    mentorPreference: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 8));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (status) => {
    setSubmitting(true);
    try {
      const res = await api.post('/projects', {
        ...formData,
        status,
      });
      if (res.data?.success) {
        alert(status === 'DRAFT' ? 'Project saved as DRAFT.' : 'Project proposal submitted for mentor review!');
        navigate('/student/projects');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting project.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    '1. Project Info',
    '2. Problem Statement',
    '3. Objectives',
    '4. Tech Stack',
    '5. Team Members',
    '6. Mentor Pref',
    '7. Review',
    '8. Submit',
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Create Project Proposal</h1>
        <p className="text-xs text-slate-500">Follow the 8-step project wizard to propose or draft your capstone project</p>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-[11px] font-semibold text-center">
        {stepsList.map((s, idx) => (
          <div
            key={idx}
            className={`py-1.5 rounded-md border ${
              step === idx + 1
                ? 'bg-brand-900 text-white border-brand-900'
                : step > idx + 1
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Step Form Body */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        {step === 1 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Step 1: Project Information</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Project Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AI-Driven Smart Traffic Optimization System"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Short Summary Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of the proposed project..."
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Step 2: Problem Statement</h3>
            <label className="block text-xs font-semibold text-slate-700">Detail the core problem being solved</label>
            <textarea
              rows={4}
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              placeholder="Describe real-world challenge, target users, and existing gaps..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Step 3: Objectives & Key Deliverables</h3>
            <label className="block text-xs font-semibold text-slate-700">Define major project milestones</label>
            <textarea
              rows={4}
              value={formData.objectives}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
              placeholder="Milestone 1: Database Schema. Milestone 2: Node REST API & FastAPI AI analysis..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Step 4: Technology Stack</h3>
            <label className="block text-xs font-semibold text-slate-700">Select/List Frameworks & DBs</label>
            <input
              type="text"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              placeholder="React.js, Node.js, Express, Python FastAPI, MySQL, Tailwind CSS"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Step 5: Team Members & Roles</h3>
            <input
              type="text"
              value={formData.teamMembers}
              onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
              placeholder="Alex Mercer (Leader - Full Stack), Sarah Connor (Frontend)"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
            />
          </div>
        )}

        {step === 6 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Step 6: Mentor Preference</h3>
            <select
              value={formData.mentorPreference}
              onChange={(e) => setFormData({ ...formData, mentorPreference: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
            >
              <option value="">Select Domain Expert Mentor...</option>
              <option value="Dr. Robert Langdon">Dr. Robert Langdon (Full-Stack & AI Systems)</option>
              <option value="Prof. Alan Turing">Prof. Alan Turing (Data Science & Algorithms)</option>
            </select>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Step 7: Review Proposal Summary</h3>
            <div className="rounded-lg bg-slate-50 p-4 space-y-2 border border-slate-200">
              <p><strong>Title:</strong> {formData.title || 'Untitled Project'}</p>
              <p><strong>Description:</strong> {formData.description}</p>
              <p><strong>Problem Statement:</strong> {formData.problemStatement}</p>
              <p><strong>Objectives:</strong> {formData.objectives}</p>
              <p><strong>Tech Stack:</strong> {formData.techStack}</p>
              <p><strong>Mentor Preference:</strong> {formData.mentorPreference || 'Any Available'}</p>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-4 text-center py-4">
            <h3 className="text-base font-bold text-slate-900">Step 8: Save Draft or Submit Proposal</h3>
            <p className="text-xs text-slate-500">
              Submitting proposal sends your project proposal to assigned mentors for validation and approval.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => handleSubmit('DRAFT')}
                disabled={submitting}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSubmit('PENDING_REVIEW')}
                disabled={submitting}
                className="rounded-lg bg-brand-900 px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-brand-800"
              >
                Submit Proposal to Mentor
              </button>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          {step < 8 && (
            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 rounded-lg bg-brand-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-800"
            >
              <span>Next Step</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
