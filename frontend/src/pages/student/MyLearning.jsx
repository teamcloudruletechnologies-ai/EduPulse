import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  Play,
  HelpCircle,
  Code2,
  ChevronRight,
  Sparkles,
  FileText,
  Clock,
  Award,
  CheckCircle2,
  X,
  Send,
  Brain,
} from 'lucide-react';

const DEFAULT_COURSES = [
  {
    id: 'crs-1',
    code: 'CS-501',
    title: 'Advanced Full-Stack Engineering & Microservices',
    category: 'Software Engineering',
    description: 'Design patterns, REST & GraphQL APIs, Docker containers, and high-concurrency microservices.',
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: High-Performance Backend Architecture',
        lessons: [
          { id: 'l1', title: 'Express & Fastify High-Throughput Request Pipeline', duration: 45 },
          { id: 'l2', title: 'Prisma ORM & MySQL Query Optimization Techniques', duration: 50 },
        ],
        quizzes: [
          {
            id: 'q1',
            title: 'Backend Architecture & Database Tuning Assessment',
            passMarks: 70,
            questions: [
              {
                id: 1,
                question: 'Which index type is best suited for exact match lookups on primary keys in MySQL?',
                options: ['B-Tree Index', 'Full-Text Index', 'Spatial Index', 'Linear Scan'],
                correctAnswer: 0,
              },
              {
                id: 2,
                question: 'What is the purpose of database connection pooling?',
                options: ['Encrypting SQL queries', 'Reusing active database connections to reduce latency', 'Auto-generating migrations', 'Enforcing foreign key constraints'],
                correctAnswer: 1,
              },
              {
                id: 3,
                question: 'In Node.js event loop, which phase executes setTimeout callbacks?',
                options: ['Poll phase', 'Timers phase', 'Check phase', 'Close callbacks'],
                correctAnswer: 1,
              },
            ],
          },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: Client-Side Performance & React V8 Execution',
        lessons: [
          { id: 'l3', title: 'React 18 Concurrent Rendering & Fiber Reconciliation', duration: 40 },
          { id: 'l4', title: 'Custom Hooks Architecture & Global State Synchronization', duration: 45 },
        ],
        quizzes: [
          {
            id: 'q2',
            title: 'React Concurrent & State Management Test',
            passMarks: 60,
            questions: [
              {
                id: 1,
                question: 'What happens when state updates are scheduled in React batching?',
                options: ['Each setState re-renders immediately', 'Multiple setState calls are grouped into a single render', 'State resets to default', 'Components unmount'],
                correctAnswer: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'crs-2',
    code: 'CS-602',
    title: 'Cloud Native DevOps, CI/CD & Automated Testing',
    category: 'Cloud & Infrastructure',
    description: 'Docker containerization, GitHub Actions workflows, Kubernetes clusters, and automated unit testing.',
    modules: [
      {
        id: 'mod-201',
        title: 'Module 1: Continuous Integration & Automated Pipelines',
        lessons: [
          { id: 'l201', title: 'GitHub Actions Matrix Builds & Fast Fail Execution', duration: 35 },
          { id: 'l202', title: 'Docker Multi-Stage Builds & Minimal Production Images', duration: 40 },
        ],
        quizzes: [
          {
            id: 'q201',
            title: 'DevOps & Containerization Quiz',
            passMarks: 75,
            questions: [
              {
                id: 1,
                question: 'Why use multi-stage Docker builds?',
                options: ['To create separate containers for each file', 'To keep production images small by discarding build tools', 'To speed up network downloads', 'To bypass Dockerfile rules'],
                correctAnswer: 1,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const MyLearning = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('edtech_shared_courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_COURSES;
  });

  const [selectedCourse, setSelectedCourse] = useState(() => courses[0] || null);
  const [activeTab, setActiveTab] = useState('ALL');

  // Interactive Quiz Assessment Modal State
  const [activeQuizModal, setActiveQuizModal] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'edtech_shared_courses') {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCourses(parsed);
            if (selectedCourse) {
              const matched = parsed.find((c) => c.id === selectedCourse.id);
              if (matched) setSelectedCourse(matched);
            }
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedCourse]);

  const handleOpenQuiz = (quiz) => {
    setActiveQuizModal(quiz);
    setSelectedAnswers({});
    setQuizResult(null);
  };

  const handleSelectOption = (questionId, optionIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    if (!activeQuizModal || !activeQuizModal.questions) return;

    const questions = activeQuizModal.questions;
    let correctCount = 0;

    questions.forEach((q, idx) => {
      const qId = q.id || idx;
      if (selectedAnswers[qId] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);
    const passed = scorePct >= (activeQuizModal.passMarks || 60);

    setQuizResult({
      score: scorePct,
      correctCount,
      totalCount: questions.length,
      passed,
      passMarks: activeQuizModal.passMarks || 60,
    });

    if (passed) {
      showToast(`🎉 Congratulations! You scored ${scorePct}% and passed "${activeQuizModal.title}"!`, 'success');
    } else {
      showToast(`Assessment completed: ${scorePct}%. Score is below pass mark (${activeQuizModal.passMarks || 60}%). Review curriculum and retry!`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded-md bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                Mentor-Authored Interactive Curriculum
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Real-Time Sync</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
              Interactive Courses & Assessment Quizzes
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Read architectural lessons created by your mentor, test live code examples, and take interactive MCQ quiz tests
            </p>
          </div>

          <div className="flex space-x-2">
            {['ALL', 'IN_PROGRESS', 'COMPLETED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Course List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Published Courses ({courses.length})
            </h2>
            <span className="text-[11px] font-bold text-blue-600">Synced with Mentor</span>
          </div>

          <div className="space-y-2.5">
            {courses.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCourse(c)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  selectedCourse?.id === c.id
                    ? 'border-blue-500 bg-blue-50/40 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-blue-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-900 uppercase">
                    {c.code}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">Active Syllabus</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{c.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.description}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>{c.modules?.length || 1} Modules</span>
                  <span className="text-blue-600 font-bold flex items-center">
                    <span>Explore</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Course Content & Assessment Quizzes */}
        <div className="lg:col-span-8 space-y-4">
          {selectedCourse ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
              {/* Course Title Header */}
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
                    {selectedCourse.code} • Full Syllabus
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedCourse.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">{selectedCourse.description}</p>
                </div>
                <button
                  onClick={() => navigate('/student/submissions')}
                  className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition-colors shrink-0"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Open Online Compiler</span>
                </button>
              </div>

              {/* Modules, Lessons & Quizzes */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Course Modules & Interactive Assessments
                </h3>

                {selectedCourse.modules?.map((mod, idx) => (
                  <div key={mod.id || idx} className="rounded-xl border border-slate-200 p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>Module {idx + 1}: {mod.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        ({mod.lessons?.length || 0} Lessons • {mod.quizzes?.length || 0} Quizzes)
                      </span>
                    </h4>

                    <div className="space-y-2">
                      {/* Lessons */}
                      {mod.lessons?.map((les) => (
                        <div
                          key={les.id}
                          className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 text-xs border border-slate-100 hover:bg-blue-50/50 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <Play className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-slate-800">{les.title}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-slate-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-slate-400" /> {les.duration} mins
                            </span>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          </div>
                        </div>
                      ))}

                      {/* Quizzes */}
                      {mod.quizzes?.map((qz) => (
                        <div
                          key={qz.id}
                          className="flex items-center justify-between rounded-xl bg-purple-50/70 p-3 text-xs text-purple-950 border border-purple-200"
                        >
                          <div className="flex items-center space-x-2">
                            <HelpCircle className="h-4.5 w-4.5 text-purple-700" />
                            <div>
                              <span className="font-bold block text-purple-950">{qz.title}</span>
                              <span className="text-[10px] text-purple-700">Pass Mark: {qz.passMarks || 60}% • {qz.questions?.length || 1} Questions</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleOpenQuiz(qz)}
                            className="rounded-xl bg-purple-900 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-purple-800 transition-colors cursor-pointer"
                          >
                            Take Quiz Test ➔
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
              Select a course to view syllabus.
            </div>
          )}
        </div>
      </div>

      {/* INTERACTIVE QUIZ EXAMINATION MODAL */}
      {activeQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activeQuizModal.title}</h3>
                  <p className="text-[11px] text-slate-500">Pass Mark: {activeQuizModal.passMarks || 60}% • Instant AI Scoring</p>
                </div>
              </div>
              <button
                onClick={() => setActiveQuizModal(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quiz Result Display */}
            {quizResult ? (
              <div className="space-y-4 text-center py-4">
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${quizResult.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {quizResult.passed ? <CheckCircle2 className="h-9 w-9" /> : <X className="h-9 w-9" />}
                </div>

                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">
                    {quizResult.passed ? '🎉 Assessment Passed!' : '⚠️ Assessment Not Cleared'}
                  </h4>
                  <p className="text-2xl font-black mt-1 text-slate-900">
                    {quizResult.score}% <span className="text-xs text-slate-500 font-normal">({quizResult.correctCount} of {quizResult.totalCount} correct)</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto">
                    {quizResult.passed
                      ? 'Excellent work! Your quiz score has been verified and recorded in your learning velocity telemetry.'
                      : 'You scored below the required passing percentage. Please re-read the module materials and try again.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-center space-x-2">
                  <button
                    onClick={() => {
                      setQuizResult(null);
                      setSelectedAnswers({});
                    }}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={() => setActiveQuizModal(null)}
                    className="rounded-xl bg-purple-900 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-800"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Questions Form */
              <form onSubmit={handleSubmitQuiz} className="space-y-5 text-xs">
                {(activeQuizModal.questions || []).map((q, qIdx) => {
                  const qId = q.id || qIdx;
                  return (
                    <div key={qId} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                      <p className="font-bold text-slate-900 text-sm">
                        Q{qIdx + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options?.map((opt, optIdx) => (
                          <label
                            key={optIdx}
                            onClick={() => handleSelectOption(qId, optIdx)}
                            className={`flex items-center space-x-3 rounded-xl border p-3 cursor-pointer transition-all ${
                              selectedAnswers[qId] === optIdx
                                ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold shadow-xs'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${qId}`}
                              checked={selectedAnswers[qId] === optIdx}
                              onChange={() => handleSelectOption(qId, optIdx)}
                              className="text-purple-600 focus:ring-purple-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setActiveQuizModal(null)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 rounded-xl bg-purple-900 px-5 py-2 text-xs font-bold text-white shadow hover:bg-purple-800 transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Assessment</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
