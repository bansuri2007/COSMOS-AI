import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Flame,
  Zap,
  Rocket,
  Headphones,
  BookOpen,
  ListTodo,
  Volume2,
  VolumeX,
  Compass,
  Sliders,
  Palette,
  LogOut,
  Radio,
  Layers,
  ChevronRight,
  Target,
  Brain,
  Coffee,
  Calendar,
  BarChart3,
  Trophy,
  Timer,
  Clock,
  HelpCircle,
  Glasses,
  Award,
  Ear,
  Type,
  Mic,
} from 'lucide-react';

import { LoginPortal } from './components/LoginPortal';
import { ThreeStepLearningEngine } from './components/ThreeStepLearningEngine';
import { PersonalizedAiModule } from './components/PersonalizedAiModule';
import { FlashcardsModule } from './components/FlashcardsModule';
import { PyqAnalyser } from './components/PyqAnalyser';
import { BreaksHub } from './components/BreaksHub';
import { TimetableModule } from './components/TimetableModule';
import { PomodoroLockScreen } from './components/PomodoroLockScreen';
import { StudentAnalytics } from './components/StudentAnalytics';
import { TodayMissionsView, MissionTask } from './components/TodayMissionsView';
import { BadgesAndLeaderboard } from './components/BadgesAndLeaderboard';
import { AccessibilityModule } from './components/AccessibilityModule';
import { DockedAITutor } from './components/DockedAITutor';
import { FuturisticBackground } from './components/FuturisticBackground';
import { AccessibilityOverlay } from './components/AccessibilityOverlay';
import { LiveVoiceCommander } from './components/LiveVoiceCommander';

import {
  UserProfile,
  StudentProgress,
  PipSettings,
  CompanionType,
  AnimalPersonality,
} from './types/pip';
import { pipAudio } from './utils/audio';
import { pipSpeech } from './utils/speech';

export type AppView =
  | '3step'
  | 'tutor'
  | 'flashcards'
  | 'pyq'
  | 'breaks'
  | 'missions'
  | 'timetable'
  | 'analytics'
  | 'badges'
  | 'accessibility';

export default function App() {
  // Authentication & User Profile state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cosmos_auth_v1') === 'true';
    }
    return false;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('cosmos_user_profile_v1') : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: 'Alex Rivera',
      callsign: 'Alex Rivera',
      companionType: 'cat',
      companionName: 'Luna',
      companionPersonality: 'Calm & Intelligent',
      level: 4,
      xp: 1420,
      currentSuitSkin: 'Stellar Obsidian' as any,
      unlockedUpgrades: ['u1'],
    };
  });

  // Settings
  const [settings, setSettings] = useState<PipSettings>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('cosmos_settings_v3') : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      roamingEnabled: false,
      roamingFrequencySeconds: 60,
      roamingSpeed: 'normal',
      characterScale: 1.0,
      speechPosition: 'top',
      soundEffects: true,
      animationsEnabled: true,
      reducedMotion: false,
      startWithWindows: false,
      rememberPosition: true,
      highContrast: false,
      dyslexicFont: false,
      ttsEnabled: true,
      autoVoiceOnOpen: true,
      backgroundTheme: 'galaxy',
      colorBlindMode: 'none',
      readingRuler: false,
      liveCaptions: true,
      fontSizeMultiplier: 1.0,
      companionAnimal: 'cat',
      companionPersonality: 'Calm & Intelligent',
      companionName: 'Luna',
    };
  });

  // Student Progress
  const [progress, setProgress] = useState<StudentProgress>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('cosmos_progress_v3') : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      streakDays: 8,
      lastActiveDate: new Date().toISOString(),
      totalXp: 1850,
      level: 4,
      todayMinutes: 45,
      dailyGoalMinutes: 60,
      totalQuizzesTaken: 12,
      averageScore: 92,
      weakTopics: ['Virtual Memory Paging', 'Raft Leader Elections'],
      masteredTopics: ['Master Theorem', 'Chemiosmotic ATP Synthase'],
    };
  });

  // Today's Missions & To-Do List state
  const [tasks, setTasks] = useState<MissionTask[]>([
    {
      id: 'm1',
      title: 'Step 1: Review Virtual Memory & Multi-Level Page Tables Subtopics',
      time: '15 min',
      priority: 'high',
      done: false,
      stationType: 'practical',
    },
    {
      id: 'm2',
      title: 'Step 2: Attempt PYQ Diagnostic Quiz on Concurrency Deadlocks',
      time: '15 min',
      priority: 'high',
      done: false,
      stationType: 'practical',
    },
    {
      id: 'm3',
      title: 'Study Break: 60-Second Spanish Language Sprint & Spotify Lo-Fi',
      time: '10 min',
      priority: 'medium',
      done: true,
      stationType: 'audio',
    },
  ]);

  // Main navigation view: '3step' is the PRIMARY / MAIN default view!
  const [currentView, setCurrentView] = useState<AppView>('3step');
  const [visualAlertActive, setVisualAlertActive] = useState(false);
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | undefined>(undefined);
  const [pomodoroOpen, setPomodoroOpen] = useState(false);
  const [voiceCommanderOpen, setVoiceCommanderOpen] = useState(false);

  // Global voice shortcut (Alt+V or when pressing microphone)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.altKey &&
        (e.key === 'v' || e.key === 'V') &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setVoiceCommanderOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync settings & audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cosmos_settings_v3', JSON.stringify(settings));
      localStorage.setItem('cosmos_user_profile_v1', JSON.stringify(userProfile));
      localStorage.setItem('cosmos_progress_v3', JSON.stringify(progress));
      localStorage.setItem('cosmos_auth_v1', isAuthenticated ? 'true' : 'false');
    }
    pipAudio.enabled = settings.soundEffects;
    pipSpeech.enabled = settings.ttsEnabled;
  }, [settings, userProfile, progress, isAuthenticated]);

  const triggerVisualAlert = () => {
    setVisualAlertActive(true);
    setTimeout(() => setVisualAlertActive(false), 500);
  };

  const handleLogin = (profileData: {
    name: string;
    companionType: CompanionType;
    companionName: string;
    companionPersonality: AnimalPersonality;
  }) => {
    setUserProfile((prev) => ({
      ...prev,
      name: profileData.name,
      callsign: profileData.name,
      companionType: profileData.companionType,
      companionName: profileData.companionName,
      companionPersonality: profileData.companionPersonality,
    }));
    setSettings((prev) => ({
      ...prev,
      companionAnimal: profileData.companionType,
      companionPersonality: profileData.companionPersonality,
      companionName: profileData.companionName,
    }));
    setIsAuthenticated(true);
    setCurrentView('3step');
    pipAudio.playCelebrate();
  };

  const handleLogout = () => {
    pipAudio.playClick();
    setIsAuthenticated(false);
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 110,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#0ea5e9', '#0284c7', '#ffffff', '#fbbf24'],
    });
    pipAudio.playCelebrate();
    triggerVisualAlert();
  };

  const handleAddXp = (amount: number) => {
    setProgress((prev) => {
      const nextXp = prev.totalXp + amount;
      const nextLevel = Math.max(prev.level, Math.floor(nextXp / 450) + 1);
      return {
        ...prev,
        totalXp: nextXp,
        level: nextLevel,
      };
    });
  };

  const handleQuizScoreRecorded = (score: number, total: number, topic: string) => {
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    setProgress((prev) => {
      const nextXp = prev.totalXp + score * 60;
      const nextLevel = Math.max(prev.level, Math.floor(nextXp / 450) + 1);
      return {
        ...prev,
        totalXp: nextXp,
        level: nextLevel,
        totalQuizzesTaken: prev.totalQuizzesTaken + 1,
        averageScore: Math.round(
          (prev.averageScore * prev.totalQuizzesTaken + percent) / (prev.totalQuizzesTaken + 1)
        ),
      };
    });

    if (percent >= 80) {
      handleCelebrate();
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextDone = !t.done;
          if (nextDone) {
            pipAudio.playCelebrate();
            handleAddXp(35);
          }
          return { ...t, done: nextDone };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: { title: string; time: string; priority: 'high' | 'medium' | 'low' }) => {
    const item: MissionTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newTask.title,
      time: newTask.time || '15 min',
      priority: newTask.priority,
      done: false,
    };
    setTasks((prev) => [item, ...prev]);
  };

  const handleAddMultipleTasks = (newTasks: { title: string; time: string; priority: 'high' | 'medium' | 'low' }[]) => {
    const items: MissionTask[] = newTasks.map((nt) => ({
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: nt.title,
      time: nt.time || '15 min',
      priority: nt.priority,
      done: false,
    }));
    setTasks((prev) => [...items, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handlePomodoroComplete = (minutes: number) => {
    setProgress((p) => ({
      ...p,
      todayMinutes: p.todayMinutes + minutes,
      totalXp: p.totalXp + minutes * 5,
    }));
    handleCelebrate();
  };

  // Voice command dispatcher across the entire application
  const handleVoiceCommandAction = (action: string, targetTopic?: string, speechReply?: string) => {
    pipAudio.playCelebrate();
    switch (action) {
      case 'NAVIGATE_3STEP':
        setCurrentView('3step');
        break;
      case 'NAVIGATE_TUTOR':
        setCurrentView('tutor');
        if (targetTopic) setTutorInitialPrompt(targetTopic);
        break;
      case 'NAVIGATE_FLASHCARDS':
        setCurrentView('flashcards');
        break;
      case 'NAVIGATE_PYQ':
        setCurrentView('pyq');
        break;
      case 'NAVIGATE_BREAKS':
        setCurrentView('breaks');
        break;
      case 'NAVIGATE_TIMETABLE':
        setCurrentView('timetable');
        break;
      case 'NAVIGATE_ACCESSIBILITY':
        setCurrentView('accessibility');
        break;
      case 'NAVIGATE_MISSIONS':
        setCurrentView('missions');
        break;
      case 'NAVIGATE_ANALYTICS':
        setCurrentView('analytics');
        break;
      case 'START_POMODORO':
        setPomodoroOpen(true);
        break;
      case 'EXPLAIN_CONCEPT':
        setCurrentView('tutor');
        if (targetTopic) setTutorInitialPrompt(targetTopic);
        break;
      case 'READ_PAGE':
        pipSpeech.speak('Cosmos AI screen reader active. Viewing current university study module.');
        break;
      case 'GENERAL_TALK':
        if (speechReply) pipSpeech.speak(speechReply);
        break;
      default:
        break;
    }
  };

  const getColorBlindFilterStyle = () => {
    switch (settings.colorBlindMode) {
      case 'protanopia':
        return { filter: 'url(#protanopia-filter)' };
      case 'deuteranopia':
        return { filter: 'url(#deuteranopia-filter)' };
      case 'tritanopia':
        return { filter: 'url(#tritanopia-filter)' };
      case 'monochrome':
        return { filter: 'url(#monochrome-filter)' };
      default:
        return {};
    }
  };

  // IF NOT AUTHENTICATED: DISPLAY THE LOGIN PORTAL
  if (!isAuthenticated) {
    return (
      <div style={getColorBlindFilterStyle()} className={settings.dyslexicFont ? 'font-dyslexic' : ''}>
        <FuturisticBackground theme="galaxy" reducedMotion={settings.reducedMotion} />
        <AccessibilityOverlay
          colorBlindMode={settings.colorBlindMode}
          readingRulerActive={settings.readingRuler}
          liveCaptionsEnabled={settings.liveCaptions}
          visualAlertActive={visualAlertActive}
          highContrast={settings.highContrast}
          fontSizeMultiplier={settings.fontSizeMultiplier}
        />
        <LoginPortal onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div
      style={getColorBlindFilterStyle()}
      className={`min-h-screen w-full relative bg-[#02040a] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white ${
        settings.dyslexicFont ? 'font-dyslexic' : ''
      } ${settings.highContrast ? 'contrast-125' : ''}`}
    >
      {/* 1. DEEP BLACK COSMOS CANVAS BACKGROUND (Zero purple slop) */}
      <FuturisticBackground theme={settings.backgroundTheme} reducedMotion={settings.reducedMotion} />

      {/* 2. ACCESSIBILITY OVERLAY */}
      <AccessibilityOverlay
        colorBlindMode={settings.colorBlindMode}
        readingRulerActive={settings.readingRuler}
        liveCaptionsEnabled={settings.liveCaptions}
        visualAlertActive={visualAlertActive}
        highContrast={settings.highContrast}
        fontSizeMultiplier={settings.fontSizeMultiplier}
      />

      {/* 3. DOCKED STATIONARY AI TUTOR (Stands stably in bottom-right corner, no erratic leg walking) */}
      <DockedAITutor
        userProfile={userProfile}
        progress={progress}
        onUpdateProfile={(updated) => setUserProfile((p) => ({ ...p, ...updated }))}
        onAddTodoTask={handleAddTask}
        onNavigateToTab={(tab) => {
          pipAudio.playClick();
          setCurrentView(tab as AppView);
        }}
        ttsEnabled={settings.ttsEnabled}
        onToggleTTS={() => {
          const next = !settings.ttsEnabled;
          setSettings((s) => ({ ...s, ttsEnabled: next }));
          if (next) pipSpeech.speak('Voice assistant audio activated.');
        }}
        initialPrompt={tutorInitialPrompt}
        onClearInitialPrompt={() => setTutorInitialPrompt(undefined)}
      />

      {/* 4. POMODORO LOCK SCREEN MODAL */}
      <PomodoroLockScreen
        isOpen={pomodoroOpen}
        onClose={() => setPomodoroOpen(false)}
        onSessionComplete={handlePomodoroComplete}
        targetTask={tasks.find((t) => !t.done)?.title || 'Mastering Course Concepts'}
      />

      {/* 4.1 LIVE VOICE COMMANDER HUD */}
      <LiveVoiceCommander
        isOpen={voiceCommanderOpen}
        onClose={() => setVoiceCommanderOpen(false)}
        currentView={currentView}
        onExecuteAction={handleVoiceCommandAction}
        ttsEnabled={settings.ttsEnabled}
      />

      {/* 5. MAIN APPBAR */}
      <header className="sticky top-0 z-30 bg-[#040816]/90 backdrop-blur-2xl border-b border-sky-500/20 px-4 md:px-8 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Explorer Callsign */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                pipAudio.playClick();
                setCurrentView('3step');
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-400 to-blue-600 flex items-center justify-center text-black font-extrabold shadow-lg shadow-sky-500/25 group-hover:scale-105 transition">
                <Rocket size={20} />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5 font-sans">
                  Cosmos AI
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold uppercase tracking-wider">
                    UNIVERSITY
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 font-mono">
                  {userProfile.name} • {progress.streakDays}d Streak • {progress.totalXp} XP
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs (The 3-Step Engine is Primary!) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-[#030612] border border-sky-500/25 text-xs font-semibold overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                pipAudio.playClick();
                setCurrentView('3step');
              }}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentView === '3step'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Rocket size={14} />
              <span>3-Step Engine</span>
            </button>

            <button
              onClick={() => {
                pipAudio.playClick();
                setCurrentView('tutor');
              }}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'tutor'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain size={14} />
              <span>AI Doubt & Plan</span>
            </button>

            <button
              onClick={() => {
                pipAudio.playClick();
                setCurrentView('flashcards');
              }}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'flashcards'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen size={14} />
              <span>Flashcards</span>
            </button>

            <button
              onClick={() => {
                pipAudio.playClick();
                setCurrentView('pyq');
              }}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'pyq'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target size={14} />
              <span>PYQ Analyser</span>
            </button>

            <button
              onClick={() => {
                pipAudio.playClick();
                setCurrentView('breaks');
              }}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'breaks'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coffee size={14} />
              <span>Breaks & Games</span>
            </button>

            <button
              onClick={() => {
                pipAudio.playClick();
                setCurrentView('timetable');
              }}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'timetable'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar size={14} />
              <span>Timetable</span>
            </button>

            <button
              onClick={() => {
                pipAudio.playClick();
                setCurrentView('accessibility');
              }}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'accessibility'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Glasses size={14} />
              <span>Accessibility</span>
            </button>

            <button
              onClick={() => {
                pipAudio.playClick();
                setCurrentView('badges');
              }}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'badges'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy size={14} />
              <span>Badges & Ranks</span>
            </button>

            <button
              onClick={() => {
                pipAudio.playClick();
                setCurrentView('missions');
              }}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap relative ${
                currentView === 'missions'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListTodo size={14} />
              <span>Missions</span>
              {tasks.filter((t) => !t.done).length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-mono font-bold">
                  {tasks.filter((t) => !t.done).length}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Voice Command Quick Button */}
            <button
              onClick={() => {
                pipAudio.playClick();
                setVoiceCommanderOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black transition flex items-center gap-1.5 shadow-sm shadow-cyan-500/20 group"
              title="Live Voice Commanding HUD (Alt+V)"
            >
              <Mic size={15} className="group-hover:scale-110 transition text-cyan-400 group-hover:text-black" />
              <span className="text-[11px] font-mono font-bold uppercase hidden sm:inline">Voice</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </button>

            {/* Pomodoro Focus Lock Button */}
            <button
              onClick={() => {
                pipAudio.playClick();
                setPomodoroOpen(true);
              }}
              className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-black transition"
              title="Activate Pomodoro Lock Screen"
            >
              <Timer size={16} />
            </button>

            {/* Audio Voice Toggle */}
            <button
              onClick={() => {
                const next = !settings.ttsEnabled;
                setSettings((s) => ({ ...s, ttsEnabled: next }));
                pipAudio.playClick();
                if (next) pipSpeech.speak('Voice assistant audio activated.');
              }}
              className={`p-2 rounded-xl border transition ${
                settings.ttsEnabled
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-[#030612] border-white/10 text-slate-400 hover:text-white'
              }`}
              title={settings.ttsEnabled ? 'Mute AI Voice' : 'Unmute AI Voice'}
            >
              {settings.ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-[#030612] border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition"
              title="Switch Student Profile"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* 6. MOBILE SECONDARY NAVIGATION BAR (Visible on small & medium screens) */}
      <div className="lg:hidden bg-[#040816]/95 border-b border-sky-500/20 px-3 py-2 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => setCurrentView('3step')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold ${
            currentView === '3step' ? 'bg-cyan-500 text-black' : 'text-slate-400'
          }`}
        >
          🚀 3-Step Engine
        </button>
        <button
          onClick={() => setCurrentView('accessibility')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold ${
            currentView === 'accessibility' ? 'bg-cyan-500 text-black' : 'text-slate-400'
          }`}
        >
          👓 Access & Voice
        </button>
        <button
          onClick={() => setCurrentView('badges')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold ${
            currentView === 'badges' ? 'bg-cyan-500 text-black' : 'text-slate-400'
          }`}
        >
          🏆 Badges & Ranks
        </button>
        <button
          onClick={() => setCurrentView('tutor')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold ${
            currentView === 'tutor' ? 'bg-cyan-500 text-black' : 'text-slate-400'
          }`}
        >
          🧠 AI Doubt
        </button>
        <button
          onClick={() => setCurrentView('flashcards')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold ${
            currentView === 'flashcards' ? 'bg-cyan-500 text-black' : 'text-slate-400'
          }`}
        >
          🃏 Flashcards
        </button>
        <button
          onClick={() => setCurrentView('pyq')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold ${
            currentView === 'pyq' ? 'bg-cyan-500 text-black' : 'text-slate-400'
          }`}
        >
          📑 PYQ
        </button>
        <button
          onClick={() => setCurrentView('breaks')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold ${
            currentView === 'breaks' ? 'bg-cyan-500 text-black' : 'text-slate-400'
          }`}
        >
          ☕ Breaks & Games
        </button>
        <button
          onClick={() => setCurrentView('timetable')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold ${
            currentView === 'timetable' ? 'bg-cyan-500 text-black' : 'text-slate-400'
          }`}
        >
          📅 Timetable
        </button>
        <button
          onClick={() => setCurrentView('missions')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold ${
            currentView === 'missions' ? 'bg-cyan-500 text-black' : 'text-slate-400'
          }`}
        >
          📝 Missions
        </button>
        <button
          onClick={() => setCurrentView('analytics')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold ${
            currentView === 'analytics' ? 'bg-cyan-500 text-black' : 'text-slate-400'
          }`}
        >
          📊 Analytics
        </button>
      </div>

      {/* 7. MAIN VIEW ROUTER */}
      <main className="relative z-20 flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8 pb-24 md:pb-16">
        {/* VIEW 1: 3-STEP COURSE ENGINE (PRIMARY CENTERPIECE) */}
        {currentView === '3step' && (
          <ThreeStepLearningEngine
            onQuizCompleted={handleQuizScoreRecorded}
            onAddTodoTasks={handleAddMultipleTasks}
            onXpEarned={handleAddXp}
            onOpenAiTutor={(prompt) => setTutorInitialPrompt(prompt)}
          />
        )}

        {/* VIEW 2: AI TUTOR & DOUBT CLEARING / STUDY PLANNER */}
        {currentView === 'tutor' && (
          <PersonalizedAiModule
            progress={progress}
            onUpdateProgress={(updated) => setProgress((p) => ({ ...p, ...updated }))}
          />
        )}

        {/* VIEW 3: SPACED REPETITION FLASHCARDS */}
        {currentView === 'flashcards' && (
          <FlashcardsModule
            onCardReviewed={(difficulty) => {
              const xpGain = difficulty === 'hard' ? 20 : difficulty === 'medium' ? 15 : 10;
              handleAddXp(xpGain);
              pipAudio.playCelebrate();
            }}
          />
        )}

        {/* VIEW 4: PYQ ANALYSER */}
        {currentView === 'pyq' && (
          <PyqAnalyser
            onQuizScoreRecorded={handleQuizScoreRecorded}
            onAddTodoToPlan={(task) => handleAddTask({ title: task, time: '20 min', priority: 'high' })}
          />
        )}

        {/* VIEW 5: BREAKS & GAMES (SPOTIFY + FOREIGN LANGUAGES + GK TRIVIA) */}
        {currentView === 'breaks' && <BreaksHub onXpEarned={handleAddXp} />}

        {/* VIEW 6: TIMETABLE & CLASS TOPICS INTEGRATION */}
        {currentView === 'timetable' && (
          <TimetableModule
            onStudyTopicInEngine={(topic) => {
              setTutorInitialPrompt(topic);
              setCurrentView('3step');
            }}
          />
        )}

        {/* VIEW 7: ACCESSIBILITY SUITE (BLIND, DEAF, DYSLEXIC & VOICE AI) */}
        {currentView === 'accessibility' && (
          <AccessibilityModule
            settings={settings}
            onUpdateSettings={(updated) => setSettings((s) => ({ ...s, ...updated }))}
            onTriggerVisualAlert={triggerVisualAlert}
            onVoiceCommandAction={handleVoiceCommandAction}
          />
        )}

        {/* VIEW 8: BADGES & LEADERBOARD SHOWCASE */}
        {currentView === 'badges' && (
          <BadgesAndLeaderboard
            progress={progress}
            onClaimBadgeReward={handleAddXp}
            settings={settings}
            onUpdateSettings={(updated) => setSettings((s) => ({ ...s, ...updated }))}
          />
        )}

        {/* VIEW 9: TODAY'S MISSIONS & TO-DO LIST */}
        {currentView === 'missions' && (
          <TodayMissionsView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onOpenStation={() => setCurrentView('3step')}
          />
        )}

        {/* VIEW 10: STUDENT RETENTION & MASTERY ANALYTICS */}
        {currentView === 'analytics' && <StudentAnalytics progress={progress} />}
      </main>

      {/* 8. FOOTER */}
      <footer className="relative z-10 bg-[#030612]/90 border-t border-sky-500/15 py-4 px-6 text-center text-xs text-slate-500 backdrop-blur-xl">
        <p>Cosmos AI — University Student Learning & Productivity Platform • 3-Step Course Engine • Voice AI • Universal Accessibility</p>
      </footer>

      {/* 9. DOCKED AI COMPANION & VOICE TUTOR (Always accessible in corner) */}
      <DockedAITutor
        userProfile={userProfile}
        progress={progress}
        onUpdateProfile={(updated) => setUserProfile((p) => ({ ...p, ...updated }))}
        onAddTodoTask={handleAddTask}
        onNavigateToTab={(tab) => setCurrentView(tab as any)}
        ttsEnabled={settings.ttsEnabled}
        onToggleTTS={() => {
          const next = !settings.ttsEnabled;
          setSettings((s) => ({ ...s, ttsEnabled: next }));
          if (next) pipSpeech.speak('Voice assistant audio activated.');
        }}
        initialPrompt={tutorInitialPrompt}
        onClearInitialPrompt={() => setTutorInitialPrompt(undefined)}
      />
    </div>
  );
}
