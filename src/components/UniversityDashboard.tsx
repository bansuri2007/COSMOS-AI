import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Timer,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Target,
  Sliders,
  ChevronRight,
  Upload,
  BrainCircuit,
  MessageSquare,
  Search,
  Bell,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  RealisticAnimalCompanion,
  AnimalType,
  AnimalPersonality,
  AnimalBehaviorState,
} from './RealisticAnimalCompanion';
import { UploadAndChapterNotesModule } from './UploadAndChapterNotesModule';
import { StudentProgress } from '../types/pip';
import { pipAudio } from '../utils/audio';

interface UniversityDashboardProps {
  progress: StudentProgress;
  onNavigateTab: (tabId: string) => void;
  onOpenCoach: () => void;
  selectedAnimal: AnimalType;
  animalPersonality: AnimalPersonality;
  animalName: string;
  onUpdateAnimalConfig: (config: {
    animal?: AnimalType;
    personality?: AnimalPersonality;
    name?: string;
  }) => void;
}

export const UniversityDashboard: React.FC<UniversityDashboardProps> = ({
  progress,
  onNavigateTab,
  onOpenCoach,
  selectedAnimal,
  animalPersonality,
  animalName,
  onUpdateAnimalConfig,
}) => {
  const [isEditingAnimal, setIsEditingAnimal] = useState(false);
  const [tempAnimalName, setTempAnimalName] = useState(animalName);
  const [activeCourseFilter, setActiveCourseFilter] = useState<'All' | 'CS' | 'Math' | 'AI'>('All');

  // University active courses
  const ACTIVE_COURSES = [
    {
      id: 'c1',
      title: 'Advanced Operating Systems & Concurrency',
      code: 'CS 401',
      progress: 65,
      currentTopic: 'Chapter 2: Virtual Memory & Page Replacement',
      nextTask: 'Review Amortized Paging Cost & Mutex Locks',
      category: 'CS',
      lastStudied: 'Today, 2:30 PM',
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
    },
    {
      id: 'c2',
      title: 'Multivariable Calculus & Optimization',
      code: 'MATH 302',
      progress: 84,
      currentTopic: 'Chapter 3: Lagrange Multipliers & Constrained Extrema',
      nextTask: 'Complete 5 Diagnostic Practice Problems',
      category: 'Math',
      lastStudied: 'Yesterday',
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30',
    },
    {
      id: 'c3',
      title: 'Deep Learning & Neural Architectures',
      code: 'AI 504',
      progress: 92,
      currentTopic: 'Chapter 1: Residual Connections & Gradient Propagation',
      nextTask: 'Prepare for Semester Midterm Sprint',
      category: 'AI',
      lastStudied: '3 days ago',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    },
  ];

  const filteredCourses =
    activeCourseFilter === 'All'
      ? ACTIVE_COURSES
      : ACTIVE_COURSES.filter((c) => c.category === activeCourseFilter);

  // Today's prioritized tasks
  const TODAY_TASKS = [
    {
      id: 't1',
      title: 'Upload lecture notes for Distributed Systems consensus algorithms',
      time: '20 min',
      deadline: 'Today, 6:00 PM',
      priority: 'high',
      done: false,
    },
    {
      id: 't2',
      title: 'Attempt 5-question diagnostic quiz on AVL balance rotations',
      time: '15 min',
      deadline: 'Today, 9:00 PM',
      priority: 'medium',
      done: true,
    },
    {
      id: 't3',
      title: 'Pomodoro Focus Sprint: Operating Systems Mutex Lock proofs',
      time: '25 min',
      deadline: 'Tomorrow morning',
      priority: 'high',
      done: false,
    },
  ];

  const ANIMAL_PERSONALITY_CUES: Record<AnimalPersonality, string> = {
    'Smart & Playful': 'Alert and observing your focus. Ready for active practice drills!',
    'Calm & Intelligent': 'Maintaining steady cognitive pacing. Reviewing lecture notes thoroughly.',
    'Funny & Energetic': 'High energy! Let’s crush this chapter in a 25-minute sprint!',
    'Mysterious & Futuristic': 'Scanning conceptual boundary conditions. Deep focus engaged.',
  };

  return (
    <div className="space-y-8">
      {/* 1. WELCOME SECTION (Clean, mature, university student greeting) */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#101728]/95 via-[#0b101e]/95 to-[#060a14] border border-cyan-500/20 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                Academic Term 2026 • University Portal
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-xs text-slate-400 font-mono">Status: Active</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Good morning, Alex. Ready to make progress today?
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your primary objective today is completing the <strong>Virtual Memory & Concurrency module</strong>. You have 2 assessments upcoming in 10 days.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-[#090e1c] border border-white/10 flex items-center gap-3 shadow-inner">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Flame size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Streak
                </span>
                <p className="text-sm font-extrabold text-white font-mono">{progress.streakDays} Days</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#090e1c] border border-white/10 flex items-center gap-3 shadow-inner">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Today's Time
                </span>
                <p className="text-sm font-extrabold text-white font-mono">
                  {progress.todayMinutes}m / {progress.dailyGoalMinutes}m
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#090e1c] border border-white/10 flex items-center gap-3 shadow-inner">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Target size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Mastery Index
                </span>
                <p className="text-sm font-extrabold text-white font-mono">{progress.averageScore}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: CENTRAL LEARNING CONTENT + REALISTIC COMPANION PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT / CENTER: MAIN WORKSPACE (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* UPLOAD MATERIAL FIRST -> 3 CHAPTERS & QUIZ (User's Core Requirement) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                  <BookOpen size={16} />
                </span>
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                  Module Intelligence Engine
                </h3>
              </div>
              <span className="text-xs text-slate-400">Upload-First Curriculum Pipeline</span>
            </div>

            {/* The Dedicated Upload & 3-Chapter Notes & Quiz System */}
            <UploadAndChapterNotesModule
              onQuizCompleted={(score, total) => {
                pipAudio.playCelebrate();
              }}
              onMasteryAchieved={() => {
                pipAudio.playCelebrate();
              }}
            />
          </div>

          {/* ACTIVE COURSES & CONTINUE LEARNING */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Continue Learning (Enrolled Subjects)
                </h3>
              </div>

              {/* Course filter pills matching image reference */}
              <div className="flex items-center gap-1.5">
                {(['All', 'CS', 'Math', 'AI'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveCourseFilter(f)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      activeCourseFilter === f
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white bg-slate-900 border border-white/5'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((c) => (
                <div
                  key={c.id}
                  className={`p-5 rounded-3xl bg-gradient-to-b from-[#111728]/90 to-[#0b101e]/90 border border-white/10 shadow-xl space-y-3 flex flex-col justify-between hover:border-cyan-500/40 transition`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        {c.code}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">{c.progress}%</span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">{c.title}</h4>
                    <p className="text-xs text-slate-400">{c.currentTopic}</p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#080c18] h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 truncate max-w-[160px]">
                      {c.nextTask}
                    </span>
                    <button
                      onClick={() => onNavigateTab('planner')}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0"
                    >
                      Resume
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TODAY'S LEARNING TASKS */}
          <div className="p-6 rounded-3xl bg-[#0b101e]/90 border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Today's Learning Tasks & Deadlines
              </h3>
              <span className="text-xs text-slate-400">3 Tasks Scheduled</span>
            </div>

            <div className="space-y-2.5">
              {TODAY_TASKS.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl bg-[#070b16] border border-white/5 hover:border-white/15 transition flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        task.done
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                          : 'border-slate-700'
                      }`}
                    >
                      {task.done && <CheckCircle2 size={12} />}
                    </div>
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          task.done ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {task.title}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {task.time} • Due: {task.deadline}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      task.priority === 'high'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: REALISTIC ANIMAL COMPANION PANEL */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24 p-6 rounded-3xl bg-gradient-to-b from-[#111728]/95 via-[#0b101e]/95 to-[#070b14] border border-cyan-500/30 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
                  Wildlife AI Companion
                </span>
                <h4 className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                  {animalName}
                  <span className="text-xs text-slate-400 capitalize">({selectedAnimal})</span>
                </h4>
              </div>

              <button
                onClick={() => setIsEditingAnimal(!isEditingAnimal)}
                className="text-xs font-semibold text-cyan-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                title="Configure companion animal and personality"
              >
                <Sliders size={16} />
              </button>
            </div>

            {/* Animal Selection / Configuration Drawer */}
            {isEditingAnimal && (
              <div className="p-4 rounded-2xl bg-[#070b16] border border-cyan-500/30 space-y-3.5 animate-bubble-pop">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Select Realistic Wildlife Companion:
                  </label>
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {(['cat', 'dog', 'owl', 'fox', 'dolphin'] as const).map((a) => (
                      <button
                        key={a}
                        onClick={() => {
                          pipAudio.playClick();
                          onUpdateAnimalConfig({ animal: a });
                        }}
                        className={`p-2 rounded-xl text-xs font-bold capitalize transition border ${
                          selectedAnimal === a
                            ? 'bg-cyan-600/30 border-cyan-400 text-white'
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Companion Personality:
                  </label>
                  <select
                    value={animalPersonality}
                    onChange={(e: any) => {
                      pipAudio.playClick();
                      onUpdateAnimalConfig({ personality: e.target.value });
                    }}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option>Smart & Playful</option>
                    <option>Calm & Intelligent</option>
                    <option>Funny & Energetic</option>
                    <option>Mysterious & Futuristic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Companion Name:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempAnimalName}
                      onChange={(e) => setTempAnimalName(e.target.value)}
                      className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={() => {
                        pipAudio.playClick();
                        onUpdateAnimalConfig({ name: tempAnimalName });
                        setIsEditingAnimal(false);
                      }}
                      className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-xs font-bold text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* REALISTIC PHOTOREALISTIC ANIMAL VIEW */}
            <div className="relative py-4 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-[#090e1c] to-[#060912] border border-white/5">
              <RealisticAnimalCompanion
                animal={selectedAnimal}
                personality={animalPersonality}
                scale={0.95}
                interactive={true}
              />
              <span className="text-[11px] font-mono text-cyan-400 mt-2">
                Click animal to interact
              </span>
            </div>

            {/* Contextual Species-Appropriate Status */}
            <div className="p-3.5 rounded-2xl bg-[#090e1c] border border-white/10 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Companion Insight
              </span>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{ANIMAL_PERSONALITY_CUES[animalPersonality]}"
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={onOpenCoach}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-95"
              >
                <MessageSquare size={14} />
                Open AI Study Coach
              </button>

              <button
                onClick={() => onNavigateTab('pyq')}
                className="w-full py-2.5 rounded-2xl bg-slate-900 border border-white/10 hover:border-cyan-400/40 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-2"
              >
                <BrainCircuit size={14} className="text-cyan-400" />
                Analyze Exam Past Papers (PYQ)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
