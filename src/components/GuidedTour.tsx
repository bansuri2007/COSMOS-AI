import React, { useState } from 'react';
import {
  Compass,
  ChevronLeft,
  ChevronRight,
  X,
  Target,
  Route,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Trophy,
  Play,
  Pause,
} from 'lucide-react';
import { PipCharacter } from './PipCharacter';
import { pipAudio } from '../utils/audio';

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPathPilot: () => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Meet Pip — Your Desktop AI Companion',
    subtitle: 'Always by your side during study sessions',
    description:
      "I'm Pip! I live on your Windows desktop, floating above your code editor, lecture slides, and PDFs. I watch for study milestones, motivate you during tough sessions, and guide your daily progress.",
    pipState: 'welcome' as const,
    icon: Compass,
    actionText: 'Next: Goal Creation',
  },
  {
    step: 2,
    title: 'Goal Creation in PathPilot AI',
    subtitle: 'Define target exams, skills, and timelines',
    description:
      'Begin by setting your high-level objective in PathPilot AI—whether it is cracking a university exam, mastering Machine Learning, or reviewing Calculus. Define your target deadline and current knowledge foundation.',
    pipState: 'explaining' as const,
    icon: Target,
    actionText: 'Next: Learning Path',
  },
  {
    step: 3,
    title: 'Personalized Adaptive Learning Path',
    subtitle: 'Dynamic curriculum that adjusts to you',
    description:
      'PathPilot generates a sequential roadmap of bite-sized milestones. No one-size-fits-all curricula: topics you already understand are accelerated, while prerequisite gaps are automatically scaffolded.',
    pipState: 'studying' as const,
    icon: Route,
    actionText: 'Next: Study Modules',
  },
  {
    step: 4,
    title: 'Interactive Study Modules',
    subtitle: 'Deep conceptual explanations & practice',
    description:
      'Each module pairs clear theoretical breakdowns with hands-on exercises, flashcard sets, and past-year question analyses. Pip summarizes key takeaways so you never suffer from cognitive overload.',
    pipState: 'studying' as const,
    icon: BookOpen,
    actionText: 'Next: Practice Quiz',
  },
  {
    step: 5,
    title: 'Diagnostic Practice Quizzes',
    subtitle: 'Active recall and instant feedback',
    description:
      'Quizzes are generated to test conceptual boundaries, not just memorization. As you answer, Pip stays with you, celebrating solid reasoning and analyzing common traps.',
    pipState: 'thinking' as const,
    icon: CheckCircle2,
    actionText: 'Next: Adaptive Revision',
  },
  {
    step: 6,
    title: 'Adaptive Revision & Remedial Generation',
    subtitle: 'Targeted reinforcement for weak spots',
    description:
      'Score under 80% on a topic? PathPilot and Pip instantly generate a personalized remedial card with quick mnemonics and targeted practice problems to patch the concept before moving on.',
    pipState: 'encouraging' as const,
    icon: RefreshCw,
    actionText: 'Next: Progress & Mastery',
  },
  {
    step: 7,
    title: 'Progress Tracking, Streaks & Mastery',
    subtitle: 'Celebrate verified competence',
    description:
      'Watch your mastery radar expand, maintain your daily study streak, and level up on the student leaderboard. When you achieve verified mastery, Pip triggers a desktop celebration!',
    pipState: 'celebrating' as const,
    icon: Trophy,
    actionText: 'Launch PathPilot AI Platform',
  },
];

export const GuidedTour: React.FC<GuidedTourProps> = ({ isOpen, onClose, onOpenPathPilot }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  if (!isOpen) return null;

  const current = TOUR_STEPS[currentStepIdx];
  const StepIcon = current.icon;

  const handleNext = () => {
    pipAudio.playClick();
    if (currentStepIdx < TOUR_STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      pipAudio.playCelebrate();
      onOpenPathPilot();
      onClose();
    }
  };

  const handlePrev = () => {
    pipAudio.playClick();
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-panel-glow rounded-3xl p-6 md:p-8 shadow-2xl border border-purple-500/30 text-white animate-bubble-pop">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/30 text-purple-300">
              <Compass size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Interactive Guided Tour • Step {current.step} of {TOUR_STEPS.length}
              </span>
              <h3 className="text-lg font-bold text-white">{current.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title={isPaused ? 'Resume tour' : 'Pause tour'}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Close tour"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tour Progress Indicators */}
        <div className="grid grid-cols-7 gap-1.5 my-4">
          {TOUR_STEPS.map((s, idx) => (
            <div
              key={s.step}
              onClick={() => setCurrentStepIdx(idx)}
              className={`h-1.5 rounded-full cursor-pointer transition-all ${
                idx === currentStepIdx
                  ? 'bg-purple-500 shadow-sm shadow-purple-500/50'
                  : idx < currentStepIdx
                  ? 'bg-purple-800'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center my-6">
          <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-purple-500/10">
            <PipCharacter state={current.pipState} scale={0.9} interactive={false} />
            <span className="mt-2 text-xs font-semibold text-purple-300 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 capitalize">
              Pip: {current.pipState}
            </span>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-purple-300">
              <StepIcon size={18} />
              <h4 className="text-base font-semibold text-white">{current.subtitle}</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{current.description}</p>

            <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/20 text-xs text-purple-200">
              💡 <strong>Pip Tip:</strong> In desktop mode, I float above all your programs. You can drag me anywhere or pause roaming anytime!
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition border border-slate-700 ${
                currentStepIdx === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-500'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ChevronLeft size={14} />
              Back
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              {current.actionText}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
