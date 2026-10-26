import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ListTodo,
  TrendingUp,
  BrainCircuit,
  BookOpen,
  ArrowRight,
  Flame,
  CheckSquare,
  Square,
  RefreshCw,
} from 'lucide-react';
import { PipCharacter } from './PipCharacter';
import { QuizQuestion, RemedialTopic } from '../types/pip';
import { pipAudio } from '../utils/audio';

interface PyqAnalyserProps {
  onQuizScoreRecorded: (score: number, total: number, topic: string) => void;
  onAddTodoToPlan: (task: string) => void;
}

export const PyqAnalyser: React.FC<PyqAnalyserProps> = ({
  onQuizScoreRecorded,
  onAddTodoToPlan,
}) => {
  const [selectedExam, setSelectedExam] = useState('Computer Science & Data Structures (Gate / Semester Final)');
  const [pyqInput, setPyqInput] = useState(
    'Include questions on Binary Search Trees, Time Complexity & Master Theorem, Dynamic Programming (0/1 Knapsack), and Graph Traversal algorithms.'
  );
  const [isLoading, setIsLoading] = useState(false);

  // Analysis result state
  const [analysisData, setAnalysisData] = useState<any>({
    examName: 'Computer Science & Data Structures Final Exam',
    highWeightageTopics: [
      {
        topic: 'Time & Space Complexity (Master Theorem)',
        importance: 'Critical',
        frequencyPercentage: 38,
        tip: 'Appears in every paper across short-answer and long derivation sections.',
      },
      {
        topic: 'Dynamic Programming & Memoization',
        importance: 'High',
        frequencyPercentage: 29,
        tip: 'Knapsack, Longest Common Subsequence, and Matrix Chain Multiplication.',
      },
      {
        topic: 'Graph Traversal (BFS / DFS & Shortest Path)',
        importance: 'High',
        frequencyPercentage: 22,
        tip: 'Cycle detection, Dijkstra, and Topological Sort proofs.',
      },
      {
        topic: 'Balanced Trees (AVL & Red-Black Rotations)',
        importance: 'Medium',
        frequencyPercentage: 16,
        tip: 'Rotation algorithms and maximum height bounds.',
      },
    ],
    diagnosticQuiz: [
      {
        id: 'q1',
        question: 'Under the Master Theorem, what is the time complexity of T(n) = 2T(n/2) + O(n)?',
        options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
        correctIndex: 1,
        explanation: 'Here a=2, b=2, so log_b(a) = log_2(2) = 1. Since f(n) = O(n^1), this matches Master Theorem Case 2: T(n) = Θ(n log n).',
        relatedTopic: 'Time & Space Complexity (Master Theorem)',
      },
      {
        id: 'q2',
        question: 'Which algorithmic technique is mandatory when optimal substructure contains overlapping subproblems?',
        options: ['Divide and Conquer', 'Dynamic Programming', 'Greedy Method', 'Branch and Bound'],
        correctIndex: 1,
        explanation: 'Dynamic Programming caches solutions to overlapping subproblems via memoization or tabulation to avoid redundant exponential recalculation.',
        relatedTopic: 'Dynamic Programming & Memoization',
      },
      {
        id: 'q3',
        question: 'What is the maximum height difference allowed between left and right subtrees for any node in an AVL tree?',
        options: ['0', '1', '2', 'log N'],
        correctIndex: 1,
        explanation: 'The balance factor of an AVL tree is defined as height(left) - height(right) and must always belong to {-1, 0, 1}.',
        relatedTopic: 'Balanced Trees (AVL & Red-Black Rotations)',
      },
    ],
    remedialTopics: [
      {
        topic: 'Master Theorem Non-Polynomial Gaps',
        whyStudentsStruggle: 'Confusing logarithmic factor differences with polynomial epsilon boundaries.',
        quickMnemonic: 'Check n^(log_b a) vs f(n): if tied, append log n!',
        recommendedTodo: 'Solve 3 recurrence relations with non-polynomial bounds.',
      },
      {
        topic: '0/1 Knapsack vs Fractional Knapsack Trap',
        whyStudentsStruggle: 'Attempting to use greedy density sort on discrete 0/1 knapsack.',
        quickMnemonic: 'Fractional = Cut the gold bar (Greedy); 0/1 = All or nothing (DP table).',
        recommendedTodo: 'Draw out DP matrix for capacity 8 with 4 items.',
      },
    ],
    autoTodoList: [
      { id: 't1', task: 'Revise Master Theorem Case 2 proof and formulas', priority: 'high', topic: 'Complexity', done: false },
      { id: 't2', task: 'Draw 0/1 Knapsack recurrence matrix on paper', priority: 'high', topic: 'Dynamic Programming', done: false },
      { id: 't3', task: 'Practice BFS vs DFS queue/stack trace for cyclic graphs', priority: 'medium', topic: 'Graphs', done: false },
    ],
  });

  // Quiz interactive state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Todo list interactive state
  const [todos, setTodos] = useState<any[]>(analysisData.autoTodoList);

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    pipAudio.playThinking();

    try {
      const res = await fetch('/api/gemini/pyq-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examName: selectedExam,
          pyqText: pyqInput,
          subject: 'Computer Science / Engineering',
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysisData(data.analysis);
        setTodos(data.analysis.autoTodoList || []);
        setUserAnswers({});
        setIsQuizSubmitted(false);
        setQuizScore(null);
        pipAudio.playGreeting();
      }
    } catch (err) {
      console.error('Failed to run PYQ analysis:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (isQuizSubmitted) return;
    pipAudio.playClick();
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    const questions: QuizQuestion[] = analysisData.diagnosticQuiz || [];

    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });

    setIsQuizSubmitted(true);
    setQuizScore(correct);

    const percent = Math.round((correct / questions.length) * 100);
    if (percent >= 80) {
      pipAudio.playCelebrate();
    } else {
      pipAudio.playGreeting();
    }

    onQuizScoreRecorded(correct, questions.length, analysisData.examName);
  };

  const toggleTodo = (id: string) => {
    pipAudio.playClick();
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <BrainCircuit size={13} />
              AI Exam Intelligence
            </span>
            <span className="text-xs text-slate-400">Past Year Question Analytics</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            PYQ Analyser & Adaptive Remedial Engine
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Upload or paste past year exam questions. Pip extracts topic weightage, creates a diagnostic auto-quiz, generates remedial explanations for weak spots, and builds your priority todo list.
          </p>
        </div>

        <div className="flex flex-col items-center p-3 bg-slate-900/80 rounded-2xl border border-purple-500/20">
          <PipCharacter
            state={isQuizSubmitted && quizScore && quizScore > 2 ? 'celebrating' : isLoading ? 'thinking' : 'studying'}
            scale={0.75}
            interactive={false}
          />
          <span className="text-[11px] font-semibold text-purple-300 mt-1">
            {isLoading ? 'Analyzing PYQ patterns...' : 'Pip Exam Coach'}
          </span>
        </div>
      </div>

      {/* Input / Config Box */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Exam / Paper Pattern
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option>Computer Science & Data Structures (Gate / Semester Final)</option>
              <option>Calculus & Engineering Mathematics</option>
              <option>Physics & Mechanics Advanced</option>
              <option>Artificial Intelligence & Machine Learning</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Paste PYQ Questions or Syllabus Topics
            </label>
            <input
              type="text"
              value={pyqInput}
              onChange={(e) => setPyqInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="e.g. Master theorem, knapsack, BFS, AVL trees..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {isLoading ? 'Analyzing Patterns...' : 'Run PYQ Intelligence Analysis'}
          </button>
        </div>
      </div>

      {/* Main Grid: High Weightage Topics + Auto Todo List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Weightage Topics Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-purple-400" />
              High Frequency & Weightage Topics
            </h3>
            <span className="text-[11px] text-slate-400">Calculated from past papers</span>
          </div>

          <div className="space-y-3">
            {analysisData.highWeightageTopics?.map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    {item.topic}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.importance === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300'
                        : item.importance === 'High'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {item.importance} • {item.frequencyPercentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
                    style={{ width: `${item.frequencyPercentage}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-Todo List Based on Weak Topics Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ListTodo size={16} className="text-indigo-400" />
              Auto-Todo List (Weak Topics & Follow-ups)
            </h3>
            <span className="text-[11px] text-slate-400">
              {todos.filter((t) => t.done).length} / {todos.length} Done
            </span>
          </div>

          <div className="space-y-2.5">
            {todos.map((todo) => (
              <div
                key={todo.id}
                onClick={() => toggleTodo(todo.id)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  todo.done
                    ? 'bg-purple-950/20 border-purple-500/30 text-slate-400 line-through'
                    : 'bg-slate-950/70 border-slate-800 hover:border-purple-500/40 text-slate-200'
                }`}
              >
                <div className="mt-0.5 text-purple-400">
                  {todo.done ? <CheckSquare size={16} /> : <Square size={16} />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold">{todo.task}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {todo.topic}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        todo.priority === 'high' ? 'text-amber-400' : 'text-blue-400'
                      }`}
                    >
                      {todo.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 italic">
            💡 Recommended order follows completed foundational topics and prioritizes recurring exam stumbling blocks.
          </p>
        </div>
      </div>

      {/* AUTO-QUIZ SECTION */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-purple-400" />
              Auto-Generated Diagnostic PYQ Quiz
            </h3>
            <p className="text-xs text-slate-400">
              Test your understanding of high-frequency question patterns
            </p>
          </div>

          {isQuizSubmitted && quizScore !== null && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-bold">
              <span>Score:</span>
              <span className="text-sm font-extrabold text-white">
                {quizScore} / {analysisData.diagnosticQuiz.length}
              </span>
              <span>({Math.round((quizScore / analysisData.diagnosticQuiz.length) * 100)}%)</span>
            </div>
          )}
        </div>

        {/* Questions list */}
        <div className="space-y-6">
          {analysisData.diagnosticQuiz?.map((q: QuizQuestion, qIdx: number) => {
            const selectedOpt = userAnswers[q.id];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white">
                    <span className="text-purple-400 mr-1.5">Q{qIdx + 1}.</span>
                    {q.question}
                  </h4>
                  {q.relatedTopic && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 shrink-0">
                      {q.relatedTopic}
                    </span>
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = 'bg-slate-900 border-slate-800 hover:border-purple-500/40 text-slate-200';

                    if (selectedOpt === optIdx) {
                      btnStyle = 'bg-purple-600/30 border-purple-500 text-white font-bold';
                    }

                    if (isQuizSubmitted) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
                      } else if (selectedOpt === optIdx && !isCorrect) {
                        btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isQuizSubmitted}
                        onClick={() => handleAnswerSelect(q.id, optIdx)}
                        className={`p-3 rounded-xl border text-xs text-left transition flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isQuizSubmitted && optIdx === q.correctIndex && (
                          <CheckCircle2 size={14} className="text-emerald-400" />
                        )}
                        {isQuizSubmitted && selectedOpt === optIdx && !isCorrect && (
                          <XCircle size={14} className="text-rose-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submit */}
                {isQuizSubmitted && (
                  <div
                    className={`p-3 rounded-xl text-xs space-y-1 ${
                      isCorrect ? 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-200' : 'bg-rose-950/40 border border-rose-500/20 text-rose-200'
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1.5">
                      {isCorrect ? '✓ Correct Solution' : '✗ Concept Breakdown'}
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Quiz Button */}
        <div className="flex justify-end pt-3">
          {!isQuizSubmitted ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(userAnswers).length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              Submit Quiz & Generate Remedials
            </button>
          ) : (
            <button
              onClick={() => {
                setUserAnswers({});
                setIsQuizSubmitted(false);
                setQuizScore(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
            >
              Retake Quiz
            </button>
          )}
        </div>
      </div>

      {/* REMEDIAL TOPIC GENERATOR CARD */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <BrainCircuit size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Auto Remedial Topic Generator</h3>
              <p className="text-xs text-slate-400">
                Targeted memory aids and recovery strategies for concepts with frequent mistakes
              </p>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
            Adaptive Remediation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisData.remedialTopics?.map((rem: RemedialTopic, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/20 space-y-2.5 hover:border-amber-500/40 transition"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-200">{rem.topic}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Stumbling Block
                </span>
              </div>

              <div className="text-[11px] text-slate-300">
                <span className="text-slate-400 font-medium">Why learners struggle: </span>
                {rem.whyStudentsStruggle}
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-[11px] text-amber-200">
                💡 <strong>Quick Mnemonic:</strong> {rem.quickMnemonic}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-purple-300 font-semibold">
                  Action: {rem.recommendedTodo}
                </span>
                <button
                  onClick={() => {
                    onAddTodoToPlan(rem.recommendedTodo);
                    pipAudio.playClick();
                  }}
                  className="text-[10px] px-2 py-1 rounded bg-purple-600/30 hover:bg-purple-600 text-white font-bold transition flex items-center gap-1"
                >
                  Add to My Plan
                  <ArrowRight size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
