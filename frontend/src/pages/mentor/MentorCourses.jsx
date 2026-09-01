import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { BookOpen, Plus, Play, HelpCircle, CheckCircle, X, Layers, PlusCircle, Trash2, CheckCircle2 } from 'lucide-react';

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

export const MentorCourses = () => {
  const { showToast } = useToast();
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
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const [courseForm, setCourseForm] = useState({
    title: '',
    code: '',
    category: 'Software Engineering',
    description: '',
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    duration: 45,
  });

  const [quizForm, setQuizForm] = useState({
    title: '',
    passMarks: 70,
    q1_text: '',
    q1_opt1: '',
    q1_opt2: '',
    q1_opt3: '',
    q1_opt4: '',
    q1_correct: 0,
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'edtech_shared_courses') {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setCourses(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!courseForm.title || !courseForm.code) {
      showToast('Please fill all course fields.', 'error');
      return;
    }

    const newCourse = {
      id: 'crs-' + Date.now(),
      title: courseForm.title,
      code: courseForm.code,
      category: courseForm.category,
      description: courseForm.description,
      modules: [
        {
          id: 'mod-1',
          title: 'Module 1: Fundamentals & Core Architecture',
          lessons: [
            { id: 'l1', title: 'Introduction & Core Concepts', duration: 45 },
          ],
          quizzes: [
            {
              id: 'q1',
              title: `${courseForm.title} - Fundamentals Quiz`,
              passMarks: 60,
              questions: [
                {
                  id: 1,
                  question: `What is the primary objective of studying ${courseForm.title}?`,
                  options: ['Theoretical understanding only', 'Industry standard practical implementation & architecture', 'Memorizing syntax', 'Passing exams only'],
                  correctAnswer: 1,
                },
              ],
            },
          ],
        },
      ],
    };

    const updated = [newCourse, ...courses];
    setCourses(updated);
    setSelectedCourse(newCourse);
    localStorage.setItem('edtech_shared_courses', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    showToast(`Course "${courseForm.title}" published and synced to Student Portal!`, 'success');
    setCourseForm({ title: '', code: '', category: 'Software Engineering', description: '' });
    setIsCourseModalOpen(false);
  };

  const handleAddLesson = (e) => {
    e.preventDefault();
    if (!lessonForm.title || !selectedCourse) {
      showToast('Please enter lesson title.', 'error');
      return;
    }

    const newLesson = {
      id: 'les-' + Date.now(),
      title: lessonForm.title,
      duration: Number(lessonForm.duration) || 30,
    };

    const updatedCourse = { ...selectedCourse };
    if (!updatedCourse.modules || updatedCourse.modules.length === 0) {
      updatedCourse.modules = [{ id: 'mod-1', title: 'Module 1: Main Topics', lessons: [newLesson], quizzes: [] }];
    } else {
      updatedCourse.modules[0].lessons = [...(updatedCourse.modules[0].lessons || []), newLesson];
    }

    const updatedCourses = courses.map((c) => (c.id === selectedCourse.id ? updatedCourse : c));
    setCourses(updatedCourses);
    setSelectedCourse(updatedCourse);
    localStorage.setItem('edtech_shared_courses', JSON.stringify(updatedCourses));
    window.dispatchEvent(new Event('storage'));

    showToast(`Lesson "${lessonForm.title}" added and synced to students!`, 'success');
    setLessonForm({ title: '', duration: 45 });
    setIsLessonModalOpen(false);
  };

  const handleAddQuiz = (e) => {
    e.preventDefault();
    if (!quizForm.title || !quizForm.q1_text) {
      showToast('Please enter quiz title and question.', 'error');
      return;
    }

    const newQuiz = {
      id: 'qz-' + Date.now(),
      title: quizForm.title,
      passMarks: Number(quizForm.passMarks) || 70,
      questions: [
        {
          id: 1,
          question: quizForm.q1_text,
          options: [
            quizForm.q1_opt1 || 'Option A',
            quizForm.q1_opt2 || 'Option B',
            quizForm.q1_opt3 || 'Option C',
            quizForm.q1_opt4 || 'Option D',
          ],
          correctAnswer: Number(quizForm.q1_correct) || 0,
        },
      ],
    };

    const updatedCourse = { ...selectedCourse };
    if (!updatedCourse.modules || updatedCourse.modules.length === 0) {
      updatedCourse.modules = [{ id: 'mod-1', title: 'Module 1: Main Topics', lessons: [], quizzes: [newQuiz] }];
    } else {
      updatedCourse.modules[0].quizzes = [...(updatedCourse.modules[0].quizzes || []), newQuiz];
    }

    const updatedCourses = courses.map((c) => (c.id === selectedCourse.id ? updatedCourse : c));
    setCourses(updatedCourses);
    setSelectedCourse(updatedCourse);
    localStorage.setItem('edtech_shared_courses', JSON.stringify(updatedCourses));
    window.dispatchEvent(new Event('storage'));

    showToast(`Quiz Test "${quizForm.title}" added and synced to students!`, 'success');
    setQuizForm({
      title: '',
      passMarks: 70,
      q1_text: '',
      q1_opt1: '',
      q1_opt2: '',
      q1_opt3: '',
      q1_opt4: '',
      q1_correct: 0,
    });
    setIsQuizModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Curriculum, Courses & Quiz Test Builder</h1>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
              Live Sync with Student Learning
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish courses, organize modules, add lessons, and create interactive MCQ assessment tests for students
          </p>
        </div>
        <button
          onClick={() => setIsCourseModalOpen(true)}
          className="flex items-center space-x-1.5 rounded-xl bg-brand-900 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-800 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Create New Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Select List */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Published Courses ({courses.length})</h2>
          {courses.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCourse(c)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                selectedCourse?.id === c.id
                  ? 'border-brand-900 bg-brand-50/50 shadow-md ring-1 ring-brand-900'
                  : 'border-slate-200 bg-white hover:border-brand-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-900">{c.code}</span>
                <span className="text-[10px] font-semibold text-slate-500">{c.category}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">{c.title}</h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.description}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>{c.modules?.length || 1} Modules</span>
                <span className="text-brand-900 font-bold">Active Curriculum</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Course Curriculum Editor */}
        <div className="lg:col-span-2 space-y-4">
          {selectedCourse ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                <div>
                  <span className="rounded-md bg-brand-100 px-2.5 py-0.5 text-[11px] font-bold text-brand-900">
                    {selectedCourse.code}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 mt-1.5">{selectedCourse.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedCourse.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsLessonModalOpen(true)}
                    className="flex items-center space-x-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>+ Add Lesson</span>
                  </button>
                  <button
                    onClick={() => setIsQuizModalOpen(true)}
                    className="flex items-center space-x-1 rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-500 transition-colors cursor-pointer"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>+ Add Quiz Test</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Curriculum Modules, Lessons & Tests</h3>
                {selectedCourse.modules?.map((mod, idx) => (
                  <div key={mod.id || idx} className="rounded-xl border border-slate-200 p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>Module {idx + 1}: {mod.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({mod.lessons?.length || 0} Lessons • {mod.quizzes?.length || 0} Tests)</span>
                    </h4>

                    {/* Lessons */}
                    <div className="space-y-2">
                      {mod.lessons?.map((les) => (
                        <div key={les.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 text-xs border border-slate-100">
                          <div className="flex items-center space-x-2">
                            <Play className="h-4 w-4 text-brand-900" />
                            <span className="font-semibold text-slate-800">{les.title}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-500">
                            <span>{les.duration} mins</span>
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          </div>
                        </div>
                      ))}

                      {/* Quizzes */}
                      {mod.quizzes?.map((qz) => (
                        <div key={qz.id} className="flex items-center justify-between rounded-lg bg-purple-50 p-2.5 text-xs text-purple-950 border border-purple-200">
                          <div className="flex items-center space-x-2">
                            <HelpCircle className="h-4 w-4 text-purple-700" />
                            <span className="font-bold">{qz.title} (Pass Marks: {qz.passMarks || 70}%)</span>
                          </div>
                          <span className="rounded bg-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-900">
                            {qz.questions?.length || 1} Questions Ready
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">Select a course to edit curriculum.</div>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Publish New Course</h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Course Code *</label>
                <input
                  type="text"
                  value={courseForm.code}
                  onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                  placeholder="e.g. CS-602"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Course Title *</label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Advanced Microservice Architectures & Cloud Deployments"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Description *</label>
                <textarea
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Course curriculum summary and prerequisites..."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-900 px-5 py-2 text-xs font-bold text-white shadow hover:bg-brand-800"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Lesson to Module</h3>
              <button onClick={() => setIsLessonModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddLesson} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Lesson Title *</label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="e.g. Message Brokers, Kafka & Event-Driven Flows"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Duration (Minutes)</label>
                <input
                  type="number"
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-900 px-5 py-2 text-xs font-bold text-white shadow hover:bg-brand-800"
                >
                  Add Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Quiz Modal */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add MCQ Assessment Quiz / Test</h3>
              <button onClick={() => setIsQuizModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddQuiz} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Test / Quiz Title *</label>
                <input
                  type="text"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="e.g. Microservices & API Architecture Quiz"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Passing Marks (%)</label>
                  <input
                    type="number"
                    value={quizForm.passMarks}
                    onChange={(e) => setQuizForm({ ...quizForm, passMarks: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Correct Option</label>
                  <select
                    value={quizForm.q1_correct}
                    onChange={(e) => setQuizForm({ ...quizForm, q1_correct: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none bg-white"
                  >
                    <option value={0}>Option 1 (First)</option>
                    <option value={1}>Option 2 (Second)</option>
                    <option value={2}>Option 3 (Third)</option>
                    <option value={3}>Option 4 (Fourth)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Question Text *</label>
                <input
                  type="text"
                  value={quizForm.q1_text}
                  onChange={(e) => setQuizForm({ ...quizForm, q1_text: e.target.value })}
                  placeholder="e.g. What is the main advantage of asynchronous message queues?"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500">Option 1</label>
                  <input
                    type="text"
                    value={quizForm.q1_opt1}
                    onChange={(e) => setQuizForm({ ...quizForm, q1_opt1: e.target.value })}
                    placeholder="e.g. Decouples service dependencies"
                    className="mt-0.5 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500">Option 2</label>
                  <input
                    type="text"
                    value={quizForm.q1_opt2}
                    onChange={(e) => setQuizForm({ ...quizForm, q1_opt2: e.target.value })}
                    placeholder="e.g. Increases memory footprint"
                    className="mt-0.5 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500">Option 3</label>
                  <input
                    type="text"
                    value={quizForm.q1_opt3}
                    onChange={(e) => setQuizForm({ ...quizForm, q1_opt3: e.target.value })}
                    placeholder="e.g. Locks database tables"
                    className="mt-0.5 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500">Option 4</label>
                  <input
                    type="text"
                    value={quizForm.q1_opt4}
                    onChange={(e) => setQuizForm({ ...quizForm, q1_opt4: e.target.value })}
                    placeholder="e.g. Eliminates all caching"
                    className="mt-0.5 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-purple-500"
                >
                  Publish Quiz Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
