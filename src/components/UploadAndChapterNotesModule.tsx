import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  BookOpen,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ListTodo,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  ArrowRight,
  RefreshCw,
  Award,
  CheckSquare,
  Square,
  ExternalLink,
} from 'lucide-react';
import { pipAudio } from '../utils/audio';

interface Chapter {
  id: string;
  number: number;
  title: string;
  summary: string;
  keyConcepts: string[];
  detailedExplanation: string;
  keyTakeaways: string[];
  studyTimeMinutes: number;
}

interface QuizQuestion {
  id: string;
  chapterId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  testedConcept: string;
}

interface AutoTodoItem {
  id: string;
  task: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedMinutes: number;
  chapter: string;
  done: boolean;
}

interface ModuleData {
  moduleTitle: string;
  overview: string;
  totalEstimatedStudyMinutes: number;
  chapters: Chapter[];
  quiz: QuizQuestion[];
  autoTodoList: AutoTodoItem[];
}

interface UploadAndChapterNotesModuleProps {
  onQuizCompleted?: (score: number, total: number) => void;
  onMasteryAchieved?: () => void;
}

export const UploadAndChapterNotesModule: React.FC<UploadAndChapterNotesModuleProps> = ({
  onQuizCompleted,
  onMasteryAchieved,
}) => {
  // Input state
  const [materialTitle, setMaterialTitle] = useState('Operating Systems: Virtual Memory & Concurrency');
  const [materialContent, setMaterialContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Module state (null initially so the user is asked to upload first!)
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);

  // Selected chapter for detailed explanation view
  const [activeChapterId, setActiveChapterId] = useState<string>('ch1');

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<any | null>(null);
  const [isAnalyzingMistakes, setIsAnalyzingMistakes] = useState(false);

  // To-do list state (driven strictly by user material and mistakes)
  const [todoList, setTodoList] = useState<AutoTodoItem[]>([]);

  // Sample material quick filler for convenience
  const loadSampleMaterial = () => {
    setMaterialTitle('Data Structures: Balanced Search Trees & Amortized Analysis');
    setMaterialContent(`Course: Advanced Algorithms & Data Structures (CS 301)
Topics Covered:
1. Balanced Binary Search Trees (AVL Trees & Red-Black Trees). Height invariants: AVL guarantees balance factor |h_left - h_right| <= 1, strictly bounding height to 1.44 log2(N). Rotations: Single (LL, RR) and Double (LR, RL) restore invariants in O(1) time after insertions and deletions.
2. Dynamic Arrays & Amortized Complexity Analysis. When doubling array capacity from N to 2N upon overflow, copying requires O(N) operations. However, using the Accounting Method or Potential Function Phi = 2k - N, the amortized cost per append is O(1).
3. Common Examination Pitfalls: Conflating worst-case single operation cost O(N) with amortized sequence cost O(1). Failing to update height variables during bottom-up rebalancing. Boundary conditions when deleting root with two children.`);
  };

  const handleProcessMaterial = async () => {
    let contentToProcess = materialContent;
    if (!contentToProcess.trim()) {
      loadSampleMaterial();
      contentToProcess = `Course: Advanced Algorithms & Data Structures (CS 301)
Topics Covered:
1. Balanced Binary Search Trees (AVL Trees & Red-Black Trees). Height invariants: AVL guarantees balance factor |h_left - h_right| <= 1, strictly bounding height to 1.44 log2(N). Rotations: Single (LL, RR) and Double (LR, RL) restore invariants in O(1) time after insertions and deletions.
2. Dynamic Arrays & Amortized Complexity Analysis. When doubling array capacity from N to 2N upon overflow, copying requires O(N) operations. However, using the Accounting Method or Potential Function Phi = 2k - N, the amortized cost per append is O(1).
3. Common Examination Pitfalls: Conflating worst-case single operation cost O(N) with amortized sequence cost O(1). Failing to update height variables during bottom-up rebalancing. Boundary conditions when deleting root with two children.`;
    }

    setIsProcessing(true);
    pipAudio.playThinking();

    try {
      const res = await fetch('/api/gemini/process-study-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: materialTitle || 'Data Structures: Balanced Search Trees & Amortized Analysis',
          content: contentToProcess,
          subject: 'University Academic Curriculum',
        }),
      });

      const data = await res.json();
      if (data.module) {
        setModuleData(data.module);
        setActiveChapterId(data.module.chapters[0]?.id || 'ch1');
        setTodoList(data.module.autoTodoList || []);
        setUserAnswers({});
        setIsQuizSubmitted(false);
        setAnalysisReport(null);
        pipAudio.playCelebrate();
      }
    } catch (e) {
      console.error('Failed to process material:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptionSelect = (qId: string, optIdx: number) => {
    if (isQuizSubmitted) return;
    pipAudio.playClick();
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (!moduleData) return;
    setIsAnalyzingMistakes(true);
    pipAudio.playThinking();

    try {
      const res = await fetch('/api/gemini/analyze-quiz-mistakes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleData,
          userAnswers,
        }),
      });

      const data = await res.json();
      if (data.report) {
        setAnalysisReport(data.report);
        setIsQuizSubmitted(true);
        if (data.report.updatedTodoList) {
          setTodoList(data.report.updatedTodoList);
        }
        if (data.report.percentage >= 80) {
          pipAudio.playCelebrate();
          if (onMasteryAchieved) onMasteryAchieved();
        } else {
          pipAudio.playGreeting();
        }
        if (onQuizCompleted) {
          onQuizCompleted(data.report.score, data.report.total);
        }
      }
    } catch (e) {
      console.error('Quiz analysis error:', e);
    } finally {
      setIsAnalyzingMistakes(false);
    }
  };

  const toggleTodo = (id: string) => {
    pipAudio.playClick();
    setTodoList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="space-y-8">
      {/* 1. UPLOAD MATERIAL SECTION (FIRST STEP) */}
      {!moduleData ? (
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-[#111728]/90 via-[#0d1222]/95 to-[#070b14] border border-cyan-500/30 shadow-2xl space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono flex items-center gap-2">
              <Upload size={14} />
              Step 1 • Ingest Course Material
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Upload Your Syllabus or Lecture Notes
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Cosmos AI structures your uploaded material into <strong>3 rigorous academic chapters</strong>, generates an active recall quiz, pinpoints conceptual mistakes, and provides an updated weekly mastery analysis.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Module / Course Title
              </label>
              <input
                type="text"
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                className="w-full bg-[#0a0f1d] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                placeholder="e.g. Advanced Operating Systems: Memory Management & Mutex Deadlocks"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Paste Study Material, Lecture Transcript, or Syllabus Content
                </label>
                <button
                  type="button"
                  onClick={loadSampleMaterial}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline"
                >
                  Load College Sample Material
                </button>
              </div>
              <textarea
                value={materialContent}
                onChange={(e) => setMaterialContent(e.target.value)}
                rows={7}
                className="w-full bg-[#0a0f1d] border border-white/10 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition font-mono leading-relaxed"
                placeholder="Paste course text, textbook sections, syllabus units, or lecture transcript..."
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <span className="text-xs text-slate-400">
              ⚡ Analyzed without pre-assumed fake data: Notes & quizzes are derived strictly from your upload.
            </span>

            <button
              onClick={handleProcessMaterial}
              disabled={isProcessing || !materialContent.trim()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-2 transition hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {isProcessing ? 'Analyzing & Structuring...' : 'Generate 3 Chapters & Quiz'}
            </button>
          </div>
        </div>
      ) : (
        /* 2. THREE-CHAPTER BREAKDOWN & DETAILED EXPLANATION VIEW */
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#111728]/95 via-[#0d1222] to-[#0a0e1c] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  Active Study Module
                </span>
                <span className="text-xs text-slate-400">
                  Est. {moduleData.totalEstimatedStudyMinutes} Minutes
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {moduleData.moduleTitle}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">{moduleData.overview}</p>
            </div>

            <button
              onClick={() => {
                setModuleData(null);
                setMaterialContent('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              Upload Different Material
            </button>
          </div>

          {/* 3 MAIN CHAPTERS SELECTOR (User Requirement: 3 SECTIONS MAIN CHAPTERS) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest font-mono">
              Module Chapters (Click to View Detailed Explanation):
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {moduleData.chapters.map((ch) => {
                const isSelected = activeChapterId === ch.id;
                return (
                  <div
                    key={ch.id}
                    onClick={() => {
                      pipAudio.playClick();
                      setActiveChapterId(ch.id);
                    }}
                    className={`p-5 rounded-3xl border cursor-pointer transition flex flex-col justify-between space-y-3 hover:scale-[1.01] ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#18223d] to-[#0f1526] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl'
                        : 'bg-[#0c1120]/90 border-white/10 hover:border-cyan-500/40 text-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                          CHAPTER {ch.number}
                        </span>
                        <span className="text-xs text-slate-400">{ch.studyTimeMinutes}m</span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">{ch.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{ch.summary}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-cyan-400">
                      <span>{isSelected ? 'Viewing Detailed Explanation' : 'Click to View'}</span>
                      <ChevronRight size={14} className={isSelected ? 'rotate-90' : ''} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DETAILED EXPLANATION PANEL FOR SELECTED CHAPTER */}
          {(() => {
            const currentChapter = moduleData.chapters.find((c) => c.id === activeChapterId) || moduleData.chapters[0];
            return (
              <div className="p-8 rounded-3xl bg-[#0c101d]/95 border border-cyan-500/30 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
                      Detailed Academic Explanation • Chapter {currentChapter.number}
                    </span>
                    <h3 className="text-xl font-bold text-white">{currentChapter.title}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
                    {currentChapter.studyTimeMinutes} Min Read
                  </span>
                </div>

                {/* Key Concepts Pills */}
                <div className="flex flex-wrap gap-2">
                  {currentChapter.keyConcepts.map((kc, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-medium text-slate-300"
                    >
                      💡 {kc}
                    </span>
                  ))}
                </div>

                {/* Detailed Explanation Text */}
                <div className="p-6 rounded-2xl bg-[#080c18] border border-white/10 text-sm text-slate-200 leading-relaxed space-y-4 whitespace-pre-line font-sans">
                  {currentChapter.detailedExplanation}
                </div>

                {/* Key Takeaways */}
                <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
                    Core Chapter Takeaways:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {currentChapter.keyTakeaways.map((kt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span>{kt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}

          {/* 3. GENERATE & ATTEMPT QUIZ FROM NOTES SECTION */}
          <div className="p-8 rounded-3xl bg-[#0c101d]/95 border border-purple-500/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest font-mono">
                  Active Recall Evaluation
                </span>
                <h3 className="text-xl font-bold text-white">Diagnostic Quiz Derived From Notes</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Answer the questions derived directly from Chapters 1, 2, and 3. After submission, Cosmos AI analyzes your errors.
                </p>
              </div>

              {isQuizSubmitted && analysisReport && (
                <div className="px-4 py-2 rounded-2xl bg-cyan-600/25 border border-cyan-400 text-cyan-200 text-xs font-bold font-mono">
                  Accuracy: {analysisReport.score} / {analysisReport.total} ({analysisReport.percentage}%)
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {moduleData.quiz.map((q, idx) => {
                const userSelected = userAnswers[q.id];
                const isCorrect = userSelected === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-[#080c18] border border-white/10 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-bold text-white">
                        <span className="text-cyan-400 font-mono mr-2">Q{idx + 1}.</span>
                        {q.question}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 shrink-0">
                        {q.testedConcept}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle =
                          'bg-[#0c1120] border-white/10 hover:border-cyan-500/40 text-slate-300';

                        if (userSelected === optIdx) {
                          btnStyle =
                            'bg-cyan-600/30 border-cyan-400 text-white font-bold ring-1 ring-cyan-400';
                        }

                        if (isQuizSubmitted) {
                          if (optIdx === q.correctIndex) {
                            btnStyle =
                              'bg-emerald-600/30 border-emerald-400 text-emerald-200 font-bold';
                          } else if (userSelected === optIdx && !isCorrect) {
                            btnStyle =
                              'bg-rose-600/30 border-rose-400 text-rose-200 font-semibold';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isQuizSubmitted}
                            onClick={() => handleOptionSelect(q.id, optIdx)}
                            className={`p-3.5 rounded-xl border text-xs text-left transition flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isQuizSubmitted && optIdx === q.correctIndex && (
                              <CheckCircle2 size={15} className="text-emerald-400" />
                            )}
                            {isQuizSubmitted && userSelected === optIdx && !isCorrect && (
                              <XCircle size={15} className="text-rose-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quiz Submit Button */}
            <div className="flex justify-end pt-2">
              {!isQuizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isAnalyzingMistakes || Object.keys(userAnswers).length === 0}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-cyan-600/30 flex items-center gap-2 transition hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isAnalyzingMistakes ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Award size={14} />
                  )}
                  {isAnalyzingMistakes
                    ? 'Analyzing Errors...'
                    : 'Submit Quiz & Generate Mistake Report'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setUserAnswers({});
                    setIsQuizSubmitted(false);
                    setAnalysisReport(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  Retake Diagnostic Quiz
                </button>
              )}
            </div>
          </div>

          {/* 4. IDENTIFY MISTAKES & COMPREHENSIVE ANALYSIS REPORT */}
          {isQuizSubmitted && analysisReport && (
            <div className="space-y-6">
              {/* Mistakes Breakdown Card */}
              <div className="p-8 rounded-3xl bg-[#0c101d]/95 border border-rose-500/30 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-widest font-mono">
                      Error Analysis & Root-Cause Remediation
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      Identified Mistakes ({analysisReport.identifiedMistakes.length} Errors Found)
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono">
                    Targeted Revision
                  </span>
                </div>

                {analysisReport.identifiedMistakes.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 text-xs space-y-1">
                    <div className="font-bold text-sm">🎉 Zero Mistakes Recorded!</div>
                    <p>
                      You demonstrated complete conceptual accuracy across all 3 chapters of this module.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analysisReport.identifiedMistakes.map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#080c18] border border-rose-500/20 space-y-2.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">
                            Mistake #{idx + 1}: {m.testedConcept}
                          </span>
                          <span className="text-slate-400">{m.chapterId?.toUpperCase()}</span>
                        </div>

                        <p className="text-xs text-slate-300 italic">"{m.question}"</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-200">
                            <strong>Your Answer:</strong> {m.userSelectedOption}
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-200">
                            <strong>Correct Solution:</strong> {m.correctOption}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                          <strong>Conceptual Derivation:</strong> {m.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Weekly Analysis Report & Auto-Generated To-Do List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Analysis Report Card */}
                <div className="p-6 rounded-3xl bg-[#0c101d]/95 border border-cyan-500/30 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
                        Weekly Progression Metric
                      </span>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <TrendingUp size={16} className="text-cyan-400" />
                        Weekly Analysis & Retention Report
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold">
                      Week {analysisReport.weeklyAnalysis.weekNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10">
                      <span className="text-xs text-slate-400">Retention Index</span>
                      <p className="text-xl font-extrabold text-cyan-300 font-mono mt-1">
                        {analysisReport.weeklyAnalysis.retentionIndex}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10">
                      <span className="text-xs text-slate-400">Readiness</span>
                      <p className="text-xl font-extrabold text-white font-mono mt-1">
                        {analysisReport.weeklyAnalysis.cognitiveReadiness}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysisReport.weeklyAnalysis.weeklySummary}
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Mastered In This Session:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisReport.weeklyAnalysis.strongConcepts.map((sc: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs"
                        >
                          ✓ {sc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Auto-Generated To-Do List Based Strictly on User Material & Mistakes */}
                <div className="p-6 rounded-3xl bg-[#0c101d]/95 border border-purple-500/30 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest font-mono">
                        Generated Strictly from Uploaded Material
                      </span>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <ListTodo size={16} className="text-purple-400" />
                        Targeted Recovery To-Do List
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {todoList.filter((t) => t.done).length} / {todoList.length} Completed
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {todoList.map((todo) => (
                      <div
                        key={todo.id}
                        onClick={() => toggleTodo(todo.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                          todo.done
                            ? 'bg-purple-950/20 border-purple-500/20 text-slate-500 line-through'
                            : 'bg-[#080c18] border-white/10 hover:border-cyan-400/50 text-slate-200'
                        }`}
                      >
                        <div className="mt-0.5 text-cyan-400">
                          {todo.done ? <CheckSquare size={16} /> : <Square size={16} />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs font-semibold">{todo.task}</p>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300 font-mono">
                              {todo.chapter}
                            </span>
                            <span
                              className={`font-bold uppercase ${
                                todo.priority === 'critical'
                                  ? 'text-rose-400'
                                  : todo.priority === 'high'
                                  ? 'text-amber-400'
                                  : 'text-cyan-400'
                              }`}
                            >
                              {todo.priority}
                            </span>
                            <span className="text-slate-500">• {todo.estimatedMinutes}m</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
