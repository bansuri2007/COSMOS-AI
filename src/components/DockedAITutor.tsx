import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  MessageSquare,
  Send,
  X,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  Sliders,
  Check,
  Shield,
  Layers,
  ArrowRight,
  ListTodo,
  Mic,
  MicOff,
  Flame,
  Brain,
  Coffee,
  HelpCircle,
} from 'lucide-react';
import { UserProfile, StudentProgress, CompanionType, AnimalPersonality } from '../types/pip';
import { pipAudio } from '../utils/audio';
import { pipSpeech } from '../utils/speech';

interface DockedAITutorProps {
  userProfile: UserProfile;
  progress: StudentProgress;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onAddTodoTask: (task: { title: string; time: string; priority: 'high' | 'medium' | 'low' }) => void;
  onOpenStation?: (station: 'audio' | 'visual' | 'practical') => void;
  onNavigateToTab?: (tab: string) => void;
  ttsEnabled: boolean;
  onToggleTTS: () => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

type EmotionState = 'cheering' | 'thinking' | 'celebrating' | 'coaching';

export const DockedAITutor: React.FC<DockedAITutorProps> = ({
  userProfile,
  progress,
  onUpdateProfile,
  onAddTodoTask,
  onNavigateToTab,
  ttsEnabled,
  onToggleTTS,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isUpgradesOpen, setIsUpgradesOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [emotion, setEmotion] = useState<EmotionState>('coaching');
  const [micNotice, setMicNotice] = useState<string | null>(null);

  // Multi-turn chat message history
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'tutor'; text: string; time: string; isAi?: boolean }>>([
    {
      role: 'tutor',
      text: `Hi ${userProfile.name || 'Student'}! 🦉 I'm Cosmo, your Gemini-powered academic tutor. Ask me any conceptual question or click the microphone to speak!`,
      time: 'Now',
      isAi: true,
    },
  ]);

  // Duolingo-style proactive coach speech
  const [currentSpeech, setCurrentSpeech] = useState(
    `Hi ${userProfile.name || 'Student'}! 🦉 Ask me any question or upload your syllabus to generate your personalized to-do list!`
  );
  const [followUpQuestion, setFollowUpQuestion] = useState(
    'What concept or exam question do you want to conquer right now?'
  );

  const COMPANION_IMAGES: Record<CompanionType, string> = {
    astronaut: '/assets/images/astronaut_companion_1792999965265.jpg',
    cat: '/assets/images/realistic_cat_companion_1793000018848.jpg',
    dog: '/assets/images/realistic_dog_companion_1793000049268.jpg',
    owl: '/assets/images/realistic_owl_companion_1793000067209.jpg',
    fox: '/assets/images/realistic_fox_companion_1793000090793.jpg',
  };

  // Speak welcome on mount
  useEffect(() => {
    if (ttsEnabled) {
      pipSpeech.speak(currentSpeech);
    }
  }, []);

  // Handle external prompts
  useEffect(() => {
    if (initialPrompt) {
      handleUserSubmitQuery(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const toggleListening = async () => {
    if (isListening) {
      pipSpeech.stopListening();
      setIsListening(false);
      setMicNotice(null);
      return;
    }

    pipAudio.playClick();
    setMicNotice('🎙️ Listening... Please speak your question now.');
    setIsListening(true);

    pipSpeech.startListening(
      (transcript, isFinal) => {
        setUserQuery(transcript);
        if (isFinal && transcript.trim()) {
          setIsListening(false);
          setMicNotice(null);
          handleUserSubmitQuery(transcript.trim());
        }
      },
      (error) => {
        setIsListening(false);
        setMicNotice(error);
        setTimeout(() => setMicNotice(null), 4000);
      }
    );
  };

  const handleUserSubmitQuery = async (queryText: string) => {
    if (!queryText.trim() || isThinking) return;
    const clean = queryText.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user question to history
    setChatMessages((prev) => [...prev, { role: 'user', text: clean, time: now }]);
    setIsThinking(true);
    setEmotion('thinking');
    pipAudio.playThinking();

    setCurrentSpeech(`Thinking with Gemini 3... Analyzing "${clean}"`);

    // Proactively add to To-Do List
    onAddTodoTask({
      title: `[Cosmo AI] Master concept: ${clean}`,
      time: '15 min',
      priority: 'high',
    });

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: clean,
          history: chatMessages.slice(-6).map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', text: m.text })),
          context: {
            currentSubject: clean,
            streak: progress.streakDays,
            companionName: userProfile.companionName,
            personality: userProfile.companionPersonality,
          },
        }),
      });

      const data = await res.json();
      const reply = data.reply || `Great question on ${clean}! Always ground yourself in boundary invariants first. Ready to take a diagnostic quiz?`;

      // Append tutor response to chat history
      setChatMessages((prev) => [
        ...prev,
        { role: 'tutor', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isAi: data.isAiGenerated ?? true },
      ]);

      setCurrentSpeech(reply);
      setFollowUpQuestion(`Would you like me to test you with a diagnostic check on ${clean}?`);
      setEmotion('cheering');

      if (ttsEnabled) {
        pipSpeech.speak(reply);
      }
      pipAudio.playCelebrate();
    } catch (e) {
      const fallback = `Great question on ${clean}! When analyzing this concept, first establish foundational invariants before looking at edge cases. What specific derivation can I clarify?`;
      setChatMessages((prev) => [...prev, { role: 'tutor', text: fallback, time: now, isAi: false }]);
      setCurrentSpeech(fallback);
      setEmotion('cheering');
      if (ttsEnabled) pipSpeech.speak(fallback);
    } finally {
      setIsThinking(false);
      setUserQuery('');
    }
  };

  const handleCelebrateCheer = () => {
    setEmotion('celebrating');
    pipAudio.playCelebrate();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8, x: 0.9 },
      colors: ['#38bdf8', '#0ea5e9', '#3b82f6', '#10b981', '#fbbf24'],
    });
    const cheers = [
      `You're on a ${progress.streakDays}-day learning streak! 🔥 Never stop the momentum!`,
      `Over ${progress.totalXp} XP accumulated! Your university mastery rank is climbing! 🚀`,
      `Upload your syllabus right now and I'll generate your personalized study to-do list! ✨`,
    ];
    const cheer = cheers[Math.floor(Math.random() * cheers.length)];
    setCurrentSpeech(cheer);
    if (ttsEnabled) pipSpeech.speak(cheer);
  };

  const UPGRADES = [
    {
      id: 'u1',
      title: 'Neural Socratic Co-Pilot',
      levelReq: 2,
      desc: 'Active retrieval questioning and Feynman simplifications.',
      unlocked: progress.level >= 2,
    },
    {
      id: 'u2',
      title: 'Quantum Focus Aura',
      levelReq: 4,
      desc: 'Binaural audio calibration for 45-minute deep focus sprints.',
      unlocked: progress.level >= 4,
    },
    {
      id: 'u3',
      title: 'Diamond Mastery Crown',
      levelReq: 8,
      desc: 'Top 1% university leaderboard badge and XP multiplier.',
      unlocked: progress.level >= 8,
    },
  ];

  return (
    <aside
      aria-label="Personalized AI Tutor"
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end select-none max-w-sm sm:max-w-md"
    >
      {/* 1. EXPANDABLE DIALOGUE BUBBLE & COACHING DECK */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-[#040816]/95 border border-sky-400/30 p-5 shadow-2xl backdrop-blur-2xl text-slate-100 space-y-4 animate-bubble-pop">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-cyan-400 bg-slate-900">
                  <img
                    src={COMPANION_IMAGES[userProfile.companionType || 'cat']}
                    alt={userProfile.companionName || 'AI Tutor'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-pulse" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {userProfile.companionName || 'Cosmo'}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                    LVL {progress.level}
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                  <Flame size={11} className="text-amber-400" />
                  {progress.streakDays}d Streak • {userProfile.companionPersonality || 'Calm & Intelligent'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Audio speech toggle */}
              <button
                onClick={onToggleTTS}
                className={`p-1.5 rounded-xl border transition ${
                  ttsEnabled
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-[#030612] border-white/10 text-slate-400'
                }`}
                title={ttsEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
              >
                {ttsEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>

              {/* Upgrades drawer toggle */}
              <button
                onClick={() => setIsUpgradesOpen(!isUpgradesOpen)}
                className="p-1.5 rounded-xl bg-[#030612] border border-white/10 text-slate-400 hover:text-cyan-300 transition"
                title="Companion Customization & Upgrades"
              >
                <Sliders size={14} />
              </button>

              {/* Minimize */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-[#030612] border border-white/10 text-slate-400 hover:text-white transition"
                title="Minimize Companion"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* UPGRADATIONS & CUSTOMIZATION DRAWER */}
          {isUpgradesOpen && (
            <div className="p-3.5 rounded-2xl bg-[#02050f] border border-sky-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wider font-mono text-[10px]">
                  Switch Companion & Upgrades
                </span>
                <span className="text-cyan-400 font-mono font-bold">{progress.totalXp} XP</span>
              </div>

              {/* Character selection icons */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Choose Photorealistic Companion:</label>
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  {(['cat', 'dog', 'owl', 'fox', 'astronaut'] as const).map((comp) => (
                    <button
                      key={comp}
                      onClick={() => {
                        pipAudio.playClick();
                        onUpdateProfile({ companionType: comp });
                      }}
                      className={`p-1 rounded-xl border transition ${
                        userProfile.companionType === comp
                          ? 'border-cyan-400 bg-cyan-500/20'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                      title={comp}
                    >
                      <img
                        src={COMPANION_IMAGES[comp]}
                        alt={comp}
                        className="w-8 h-8 rounded-lg object-cover mx-auto"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Personality Selector */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Personality Setting:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Smart & Playful', 'Calm & Intelligent', 'Funny & Energetic', 'Mysterious & Futuristic'] as const).map((pers) => (
                    <button
                      key={pers}
                      onClick={() => {
                        pipAudio.playClick();
                        onUpdateProfile({ companionPersonality: pers });
                      }}
                      className={`p-1.5 rounded-xl border text-[10px] font-bold text-left transition ${
                        userProfile.companionPersonality === pers
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : 'bg-[#030612] border-white/5 text-slate-400'
                      }`}
                    >
                      {pers}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature upgrades list */}
              <div className="space-y-1.5 pt-1">
                {UPGRADES.map((u) => (
                  <div
                    key={u.id}
                    className={`p-2 rounded-xl border flex items-center justify-between ${
                      u.unlocked
                        ? 'bg-sky-500/10 border-cyan-400/30 text-white'
                        : 'bg-[#010309] border-white/5 text-slate-500'
                    }`}
                  >
                    <div>
                      <p className="text-[11px] font-bold">{u.title}</p>
                      <p className="text-[9px] text-slate-400">{u.desc}</p>
                    </div>
                    {u.unlocked ? (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold font-mono">
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 font-mono">LVL {u.levelReq}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Toggle Conversation View vs Single Speech Bubble */}
          <div className="flex items-center justify-between text-[11px] px-1">
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition"
            >
              <MessageSquare size={13} />
              <span>{showHistory ? 'Show Coach Bubble' : `View Full Chat (${chatMessages.length})`}</span>
            </button>
            <span className="text-[10px] text-slate-500 font-mono">Gemini 3.1 Pro / Lite</span>
          </div>

          {/* Full Conversation Thread OR Duolingo-style Speech Bubble */}
          {showHistory ? (
            <div className="max-h-56 overflow-y-auto space-y-2 p-3 rounded-2xl bg-[#02050e] border border-sky-400/20 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`p-2.5 rounded-2xl max-w-[90%] text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-black font-semibold'
                        : 'bg-[#050b1d] border border-sky-500/20 text-slate-200'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 px-1 font-mono">{msg.time}</span>
                </div>
              ))}
              {isThinking && (
                <div className="text-[11px] text-cyan-300 animate-pulse flex items-center gap-1.5 p-1">
                  <Sparkles size={12} className="animate-spin" />
                  <span>Cosmo is writing an answer...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="relative p-3.5 rounded-2xl bg-[#02050e] border border-sky-400/20 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-lg">
                  {emotion === 'cheering' ? '🌟' : emotion === 'thinking' ? '💡' : emotion === 'celebrating' ? '🎉' : '🦉'}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">{currentSpeech}</p>
              </div>
              {followUpQuestion && (
                <p className="text-xs text-cyan-300 font-bold pl-7">{followUpQuestion}</p>
              )}
            </div>
          )}

          {/* Live Microphone Recording Banner */}
          {isListening && (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <Mic size={14} className="animate-bounce" />
                <span className="font-bold">Listening to your voice... Speak your doubt!</span>
              </div>
              <button
                type="button"
                onClick={toggleListening}
                className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-md font-bold"
              >
                Stop
              </button>
            </div>
          )}

          {micNotice && !isListening && (
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] leading-tight">
              {micNotice}
            </div>
          )}

          {/* Proactive Quick Action Buttons (Jump straight to 3-Step Engine, Doubt Clearing, Breaks) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                pipAudio.playClick();
                if (onNavigateToTab) onNavigateToTab('3step');
              }}
              className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/40 hover:bg-cyan-500 hover:text-black text-cyan-300 font-bold text-[11px] transition flex items-center justify-center gap-1.5"
            >
              <span>🚀 3-Step Engine</span>
            </button>

            <button
              type="button"
              onClick={() => {
                pipAudio.playClick();
                if (onNavigateToTab) onNavigateToTab('tutor');
              }}
              className="p-2 rounded-xl bg-[#02050f] border border-white/10 hover:border-cyan-400 text-slate-300 font-bold text-[11px] transition flex items-center justify-center gap-1.5"
            >
              <span>🧠 Clear Doubts</span>
            </button>

            <button
              type="button"
              onClick={() => {
                pipAudio.playClick();
                if (onNavigateToTab) onNavigateToTab('breaks');
              }}
              className="p-2 rounded-xl bg-[#02050f] border border-white/10 hover:border-cyan-400 text-slate-300 font-bold text-[11px] transition flex items-center justify-center gap-1.5"
            >
              <Coffee size={13} className="text-amber-400" />
              <span>Spotify & Breaks</span>
            </button>

            <button
              type="button"
              onClick={handleCelebrateCheer}
              className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500 hover:text-black text-amber-300 font-bold text-[11px] transition flex items-center justify-center gap-1.5"
            >
              <Flame size={13} />
              <span>Cheer Me Up!</span>
            </button>
          </div>

          {/* Quick Study Prompt Input with Voice Input Option */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserSubmitQuery(userQuery);
            }}
            className="space-y-2 pt-1"
          >
            <div className="flex gap-1.5">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask Cosmo any university question or doubt..."
                disabled={isThinking}
                className="flex-1 bg-[#02050e] border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />

              {/* Voice recognition mic button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl border transition ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                    : 'bg-[#02050e] border-white/10 text-slate-400 hover:text-cyan-300'
                }`}
                title={isListening ? 'Listening... Click to stop' : 'Click to talk using microphone'}
              >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
              </button>

              <button
                type="submit"
                disabled={isThinking || !userQuery.trim()}
                className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-extrabold text-xs shadow-md transition active:scale-95"
              >
                <Send size={13} />
              </button>
            </div>

            {/* Quick Topic Presets */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] no-scrollbar">
              {[
                'Explain Binary Search O(log n)',
                'What is Peterson Algorithm?',
                '4 Deadlock Conditions',
                'Master Theorem Case 2',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleUserSubmitQuery(preset)}
                  className="px-2 py-0.5 rounded-lg bg-[#02050e] border border-white/10 text-slate-400 hover:text-white hover:border-cyan-400 whitespace-nowrap transition"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </form>
        </div>
      )}

      {/* 2. DOCKED STATIONARY CHARACTER (Fixed in corner, no erratic leg walking) */}
      <div
        onClick={() => {
          pipAudio.playClick();
          setIsOpen(!isOpen);
        }}
        className="relative group cursor-pointer"
        title="Duolingo-style AI Tutor (Click to open coach dialogue)"
      >
        {/* Celestial aura */}
        <div className="absolute -inset-2 bg-gradient-to-r from-sky-500/20 via-cyan-400/25 to-blue-600/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition pointer-events-none" />

        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#040816] border-2 border-sky-400/40 p-1 shadow-2xl group-hover:border-cyan-400 transition-all duration-300 group-hover:scale-105 overflow-hidden">
          <img
            src={COMPANION_IMAGES[userProfile.companionType || 'cat']}
            alt={userProfile.companionName || 'AI Tutor'}
            className="w-full h-full object-cover rounded-xl"
          />

          {/* Active online pulse ring */}
          <div className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full bg-cyan-400 border-2 border-black animate-pulse" />
        </div>

        {/* Floating Mini Prompt Tag when minimized */}
        {!isOpen && (
          <div className="absolute -top-3 right-0 px-2.5 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-black shadow-lg font-mono animate-bounce">
            AI TUTOR
          </div>
        )}
      </div>
    </aside>
  );
};
