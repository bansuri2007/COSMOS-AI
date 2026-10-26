import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Target,
  Brain,
  MessageSquare,
  HelpCircle,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Send,
  RefreshCw,
  Award,
  Layers,
  ChevronRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  Flame,
  Lightbulb,
} from 'lucide-react';
import { StudyPlan, StudentProgress } from '../types/pip';
import { PipCharacter } from './PipCharacter';
import { pipAudio } from '../utils/audio';
import { pipSpeech } from '../utils/speech';

interface PersonalizedAiModuleProps {
  progress: StudentProgress;
  onUpdateProgress: (updated: Partial<StudentProgress>) => void;
}

export const PersonalizedAiModule: React.FC<PersonalizedAiModuleProps> = ({
  progress,
  onUpdateProgress,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'planner' | 'doubt' | 'chat'>('chat');

  // Study Planner State
  const [goal, setGoal] = useState('Pass Semester Exam in Advanced Operating Systems & Concurrency');
  const [knowledge, setKnowledge] = useState('Comfortable with basic threads and C pointers, weak on mutex deadlocks and virtual memory paging.');
  const [dailyTime, setDailyTime] = useState(45);
  const [deadline, setDeadline] = useState('3 weeks');
  const [isPlanningLoading, setIsPlanningLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>({
    title: 'Adaptive Mastery: Operating Systems & Concurrency',
    summary: 'A short 4-phase adaptive curriculum designed to remediate virtual memory gaps and solidify mutex synchronization principles.',
    estimatedDays: 14,
    pipAdvice: 'Active retrieval beats passive re-reading every time! Draw out thread timeline races on paper before writing mutex locks.',
    milestones: [
      {
        step: 1,
        topic: 'Concurrency Foundations & Race Conditions',
        focus: 'Critical sections, atomic test-and-set, Peterson’s algorithm',
        durationDays: 3,
        recommendedAction: 'Solve 4 classic synchronization race conditions in pseudo-code',
        quizCheck: 'Diagnostic checkpoint quiz on deadlocks (Target: >80%)',
      },
      {
        step: 2,
        topic: 'Deadlocks & The Dining Philosophers',
        focus: 'Coffman conditions, Banker’s algorithm, lock ordering hierarchies',
        durationDays: 4,
        recommendedAction: 'Implement hierarchical lock ordering to prevent circular wait',
        quizCheck: 'Module application drill with timing stress tests',
      },
      {
        step: 3,
        topic: 'Virtual Memory & Multi-Level Page Tables',
        focus: 'TLB miss handlers, page faults, FIFO vs LRU clock page replacement',
        durationDays: 4,
        recommendedAction: 'Calculate effective memory access times under 95% TLB hit rate',
        quizCheck: 'Speed drill on page replacement sequence',
      },
      {
        step: 4,
        topic: 'Past Year Exam Synthesis & Timed Mock',
        focus: 'Synthesizing concurrency proofs under tight exam time pressure',
        durationDays: 3,
        recommendedAction: 'Complete full 60-minute PYQ mock sprint with Pomodoro Lock',
        quizCheck: 'Final Exam Readiness Check (Target: >85%)',
      },
    ],
  });

  // Doubt Clearing State
  const [doubtQuestion, setDoubtQuestion] = useState(
    'Why does Peterson algorithm only work on 2 processes and require memory barriers on modern multi-core CPUs?'
  );
  const [doubtSubject, setDoubtSubject] = useState('Computer Systems');
  const [isDoubtLoading, setIsDoubtLoading] = useState(false);
  const [isListeningDoubt, setIsListeningDoubt] = useState(false);
  const [doubtResponse, setDoubtResponse] = useState<string | null>(`💡 **Simple Intuition (ELI5)**:
Imagine two people walking through a narrow revolving door with a white-board outside. Each writes "I want to enter", then politely sets a "Turn" pointer to the other person. If both want to enter, the last person to write "Turn" graciously lets the other go first!

🔬 **Step-by-Step Breakdown**:
1. **Two-Process Limit**: Peterson's algorithm uses a single integer \`turn\` (which can only point to 0 or 1) and two \`flag[0]\`, \`flag[1]\` booleans. Extending it to N processes requires Lamport's Bakery Algorithm.
2. **Modern Multi-Core CPUs**: Modern x86 and ARM CPUs perform **Out-of-Order execution** and use write buffers. A CPU might write \`flag[i] = true\` into its store buffer, but execute the read of \`flag[j]\` before the store becomes visible to other cores!
3. **The Fix**: Modern hardware requires an explicit **Memory Barrier (Fence)** to guarantee sequential consistency.

⚠️ **Common Trap**:
Students often assume high-level C code executes in exact source order—compilers and CPU caches will silently reorder instructions unless you declare memory barriers!

🎯 **Quick Pip Check**:
What would happen if the assignment \`turn = j\` occurred BEFORE setting \`flag[i] = true\`?
*(Answer: Mutual exclusion would be completely broken because the other thread could overwrite the turn pointer before knowing you want to enter!)*`);

  // Interactive Live Chat State
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'tutor'; text: string; time?: string }[]>([
    {
      role: 'tutor',
      text: "Greetings! I am Cosmos AI, your university academic coach powered by Gemini 3.8. Ask me any doubt, dictate via the microphone button, or request a diagnostic question on your syllabus!",
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isListeningChat, setIsListeningChat] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);

  // Web Speech Recognition for Chat & Doubt
  const chatRecognitionRef = useRef<any>(null);
  const doubtRecognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      // Chat recognizer
      const chatRec = new SpeechRecognition();
      chatRec.continuous = false;
      chatRec.interimResults = false;
      chatRec.lang = 'en-US';

      chatRec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          setChatInput(transcript);
          setIsListeningChat(false);
          // auto-send
          handleSendSpokenQuery(transcript);
        }
      };
      chatRec.onerror = () => setIsListeningChat(false);
      chatRec.onend = () => setIsListeningChat(false);
      chatRecognitionRef.current = chatRec;

      // Doubt recognizer
      const doubtRec = new SpeechRecognition();
      doubtRec.continuous = false;
      doubtRec.interimResults = false;
      doubtRec.lang = 'en-US';

      doubtRec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          setDoubtQuestion(transcript);
          setIsListeningDoubt(false);
        }
      };
      doubtRec.onerror = () => setIsListeningDoubt(false);
      doubtRec.onend = () => setIsListeningDoubt(false);
      doubtRecognitionRef.current = doubtRec;
    }
  }, []);

  const toggleChatListening = () => {
    if (!chatRecognitionRef.current) {
      alert('Microphone speech recognition is not supported in this browser. Please type your message.');
      return;
    }
    if (isListeningChat) {
      chatRecognitionRef.current.stop();
      setIsListeningChat(false);
    } else {
      pipAudio.playClick();
      setIsListeningChat(true);
      try {
        chatRecognitionRef.current.start();
      } catch (e) {
        setIsListeningChat(false);
      }
    }
  };

  const toggleDoubtListening = () => {
    if (!doubtRecognitionRef.current) {
      alert('Microphone speech recognition is not supported in this browser. Please type your doubt.');
      return;
    }
    if (isListeningDoubt) {
      doubtRecognitionRef.current.stop();
      setIsListeningDoubt(false);
    } else {
      pipAudio.playClick();
      setIsListeningDoubt(true);
      try {
        doubtRecognitionRef.current.start();
      } catch (e) {
        setIsListeningDoubt(false);
      }
    }
  };

  // Generate Study Plan
  const handleGeneratePlan = async () => {
    setIsPlanningLoading(true);
    pipAudio.playThinking();

    try {
      const res = await fetch('/api/gemini/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          currentKnowledge: knowledge,
          dailyTimeMinutes: dailyTime,
          examDate: deadline,
        }),
      });

      const data = await res.json();
      if (data.plan) {
        setStudyPlan(data.plan);
        pipAudio.playCelebrate();
      }
    } catch (e) {
      console.error('Study plan error:', e);
    } finally {
      setIsPlanningLoading(false);
    }
  };

  // Clear Doubt
  const handleClearDoubt = async () => {
    if (!doubtQuestion.trim()) return;
    setIsDoubtLoading(true);
    pipAudio.playThinking();

    try {
      const res = await fetch('/api/gemini/doubt-clearing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: doubtQuestion,
          subject: doubtSubject,
          studentLevel: 'Undergraduate',
        }),
      });

      const data = await res.json();
      if (data.explanation) {
        setDoubtResponse(data.explanation);
        pipAudio.playGreeting();
        pipSpeech.speak('I have broken down your doubt using simple intuition, step-by-step proofs, and common traps.');
      }
    } catch (e) {
      console.error('Doubt error:', e);
    } finally {
      setIsDoubtLoading(false);
    }
  };

  // Send spoken query
  const handleSendSpokenQuery = async (queryText: string) => {
    if (!queryText.trim() || isChatLoading) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { role: 'user', text: queryText, time: now }]);
    setIsChatLoading(true);
    pipAudio.playSpeechBlip();

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          history: chatMessages.slice(-6).map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', text: m.text })),
          context: {
            currentSubject: goal,
            streak: progress.streakDays,
            recentActivity: 'Interactive Chatbot & Doubt Clearing',
          },
        }),
      });

      const data = await res.json();
      const reply = data.reply || "I'm right with you! Let's conquer this course step-by-step.";
      setChatMessages((prev) => [
        ...prev,
        { role: 'tutor', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
      pipAudio.playGreeting();
      pipSpeech.speak(reply);
    } catch (err) {
      console.error('Chat error:', err);
      const fallback = `Great question on ${queryText}! When tackling this concept, always anchor yourself with boundary invariants first. Would you like me to quiz you on this?`;
      setChatMessages((prev) => [
        ...prev,
        { role: 'tutor', text: fallback, time: now },
      ]);
      pipSpeech.speak(fallback);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Chat message send
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    await handleSendSpokenQuery(userMsg);
  };

  // Read message aloud
  const handleSpeakMessage = (text: string, index: number) => {
    if (speakingMessageIndex === index) {
      pipSpeech.stopSpeaking();
      setSpeakingMessageIndex(null);
    } else {
      setSpeakingMessageIndex(index);
      pipSpeech.speak(text);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cosmos Header with Gemini Status */}
      <div className="p-6 rounded-3xl bg-[#040816]/95 border border-sky-500/25 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold border border-cyan-500/30 flex items-center gap-1.5">
              <Sparkles size={12} />
              Powered by Gemini 3.8 Flash
            </span>
            <span className="text-xs text-slate-400">Two-Way Voice & Chat Coaching</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Brain className="text-cyan-400" size={24} />
            AI Academic Socratic Coach & Socratic Chatbot
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Speak using the microphone or type to solve conceptual doubts, synthesize custom study roadmaps, and receive Feynman mental model explanations.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-1.5 bg-[#02050e] p-1.5 rounded-2xl border border-sky-500/20 shrink-0">
          <button
            onClick={() => {
              pipAudio.playClick();
              setActiveSubTab('chat');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'chat'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare size={14} />
            <span>Gemini Chatbot</span>
          </button>

          <button
            onClick={() => {
              pipAudio.playClick();
              setActiveSubTab('doubt');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'doubt'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle size={14} />
            <span>Doubt Clearing</span>
          </button>

          <button
            onClick={() => {
              pipAudio.playClick();
              setActiveSubTab('planner');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'planner'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target size={14} />
            <span>Study Planner</span>
          </button>
        </div>
      </div>

      {/* 1. LIVE CHAT WITH GEMINI CHATBOT (DEFAULT ACTIVE TAB) */}
      {activeSubTab === 'chat' && (
        <div className="p-6 rounded-3xl bg-[#040816]/95 border border-sky-500/25 shadow-2xl flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                  <Bot size={22} />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  Cosmos AI Interactive Tutor
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                    ONLINE
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Voice recognition enabled • Natural speech synthesis • Socratic tutor
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleChatListening}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                  isListeningChat
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/30'
                    : 'bg-[#02050e] border-white/10 text-cyan-300 hover:border-cyan-400'
                }`}
              >
                {isListeningChat ? <MicOff size={14} /> : <Mic size={14} />}
                <span>{isListeningChat ? 'Listening...' : 'Voice Input'}</span>
              </button>
            </div>
          </div>

          {/* Messages scroll box */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'tutor' && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={`p-4 rounded-3xl max-w-xl text-xs md:text-sm leading-relaxed space-y-2 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-black font-semibold shadow-lg'
                      : 'bg-[#02050e] border border-sky-500/20 text-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-400">
                    <span>{msg.time || 'Just now'}</span>
                    {msg.role === 'tutor' && (
                      <button
                        type="button"
                        onClick={() => handleSpeakMessage(msg.text, i)}
                        className="text-cyan-400 hover:text-white flex items-center gap-1 transition"
                        title="Read message aloud"
                      >
                        {speakingMessageIndex === i ? <VolumeX size={12} /> : <Volume2 size={12} />}
                        <span>{speakingMessageIndex === i ? 'Stop' : 'Listen'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex gap-2.5 items-center text-xs text-cyan-300 animate-pulse pl-11">
                <RefreshCw size={14} className="animate-spin" />
                <span>Cosmos AI is analyzing and synthesizing conceptual explanation...</span>
              </div>
            )}
          </div>

          {/* Quick Academic Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto py-2 border-t border-white/10 text-xs no-scrollbar">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Quick Prompts:
            </span>
            {[
              'Explain Feynman intuition for paging 💡',
              'What are common exam traps? ⚠️',
              'Test me with a hard question 🎯',
              'Break this topic into 3 steps 🚀',
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSendSpokenQuery(chip)}
                className="px-2.5 py-1 rounded-xl bg-[#02050e] border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white whitespace-nowrap text-[11px] transition"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat input with Microphone Integration */}
          <form onSubmit={handleSendChat} className="flex gap-2 pt-3 border-t border-white/10">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything or click the microphone to speak..."
              className="flex-1 bg-[#02050e] border border-sky-500/30 rounded-2xl px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />

            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleChatListening}
              className={`p-3 rounded-2xl border transition ${
                isListeningChat
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-[#02050e] border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-400'
              }`}
              title={isListeningChat ? 'Listening... Click to stop' : 'Click to speak using microphone'}
            >
              {isListeningChat ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              type="submit"
              disabled={isChatLoading || !chatInput.trim()}
              className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Send size={15} />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* 2. DOUBT CLEARING COACH TAB */}
      {activeSubTab === 'doubt' && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-[#040816]/95 border border-sky-500/25 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <HelpCircle size={18} />
                </span>
                <h3 className="text-base font-bold text-white">Socratic Doubt Resolution Engine</h3>
              </div>

              {/* Dictate doubt button */}
              <button
                type="button"
                onClick={toggleDoubtListening}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                  isListeningDoubt
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                    : 'bg-[#02050e] border-white/10 text-cyan-300 hover:border-cyan-400'
                }`}
              >
                {isListeningDoubt ? <MicOff size={14} /> : <Mic size={14} />}
                <span>{isListeningDoubt ? 'Listening to doubt...' : '🎙️ Dictate Doubt'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Paste or speak any concept, formula derivation, or exam question you find confusing. Cosmos AI returns simple intuition, step-by-step technical proofs, and common exam traps.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Subject / Discipline
                </label>
                <input
                  type="text"
                  value={doubtSubject}
                  onChange={(e) => setDoubtSubject(e.target.value)}
                  className="w-full bg-[#02050e] border border-sky-500/30 rounded-2xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Conceptual Question or Doubt
                </label>
                <input
                  type="text"
                  value={doubtQuestion}
                  onChange={(e) => setDoubtQuestion(e.target.value)}
                  placeholder="e.g. Why does Peterson algorithm require memory barriers on multicore CPUs?"
                  className="w-full bg-[#02050e] border border-sky-500/30 rounded-2xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleClearDoubt}
                disabled={isDoubtLoading}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-black font-extrabold text-xs shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isDoubtLoading ? <RefreshCw size={14} className="animate-spin" /> : <Brain size={15} />}
                <span>{isDoubtLoading ? 'Analyzing Doubt with Gemini...' : 'Clear My Doubt with Gemini'}</span>
              </button>
            </div>
          </div>

          {/* Doubt Resolution Card */}
          {doubtResponse && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#040816]/95 border border-sky-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold">
                    <Lightbulb size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Socratic Conceptual Breakdown</h4>
                    <span className="text-[10px] text-cyan-400 font-mono">Structured Feynman Analysis</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => pipSpeech.speak(doubtResponse.replace(/[#*`]/g, ''))}
                  className="px-3 py-1.5 rounded-xl bg-[#02050e] border border-white/10 text-cyan-300 hover:text-white text-xs flex items-center gap-1.5 transition"
                >
                  <Volume2 size={13} />
                  <span>Listen Aloud</span>
                </button>
              </div>

              <div className="prose prose-invert max-w-none text-xs md:text-sm text-slate-200 leading-relaxed space-y-3 whitespace-pre-line font-sans">
                {doubtResponse}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ADAPTIVE STUDY PLANNER TAB */}
      {activeSubTab === 'planner' && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-[#040816]/95 border border-sky-500/25 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                <Target size={18} />
              </span>
              <h3 className="text-base font-bold text-white">Synthesize Adaptive Study Plan</h3>
            </div>

            <p className="text-xs text-slate-300">
              Provide your target exam or course syllabus. Cosmos AI constructs a milestone-driven roadmap customized to your available daily study time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Learning Goal / Target Exam
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-[#02050e] border border-sky-500/30 rounded-2xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-cyan-400"
                  placeholder="e.g. Master Calculus III & Multivariable Optimization"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Current Knowledge & Known Weak Spots
                </label>
                <input
                  type="text"
                  value={knowledge}
                  onChange={(e) => setKnowledge(e.target.value)}
                  className="w-full bg-[#02050e] border border-sky-500/30 rounded-2xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-cyan-400"
                  placeholder="e.g. Good at partial derivatives, struggle with Lagrange multipliers"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Daily Available Study Time (Minutes)
                </label>
                <input
                  type="number"
                  value={dailyTime}
                  onChange={(e) => setDailyTime(Number(e.target.value))}
                  className="w-full bg-[#02050e] border border-sky-500/30 rounded-2xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                  min={15}
                  max={240}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Deadline / Exam Date
                </label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-[#02050e] border border-sky-500/30 rounded-2xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-cyan-400"
                  placeholder="e.g. In 2 weeks"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGeneratePlan}
                disabled={isPlanningLoading}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-black font-extrabold text-xs shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isPlanningLoading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={15} />}
                <span>{isPlanningLoading ? 'Synthesizing Plan...' : 'Generate Adaptive Plan'}</span>
              </button>
            </div>
          </div>

          {/* Render Study Plan */}
          {studyPlan && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#040816]/95 border border-sky-500/30 shadow-2xl space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      Active Adaptive Plan
                    </span>
                    <span className="text-xs text-slate-400">~{studyPlan.estimatedDays} Days Roadmap</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mt-1">{studyPlan.title}</h3>
                  <p className="text-xs text-slate-300">{studyPlan.summary}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#02050e] border border-sky-500/20 max-w-sm">
                  <p className="text-[11px] text-cyan-300 font-medium leading-snug">
                    💬 {studyPlan.pipAdvice}
                  </p>
                </div>
              </div>

              {/* Milestones list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyPlan.milestones.map((m) => (
                  <div
                    key={m.step}
                    className="p-5 rounded-2xl bg-[#02050e] border border-white/10 space-y-2.5 hover:border-cyan-500/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                        PHASE {m.step} • {m.durationDays} DAYS
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white">{m.topic}</h5>
                    <p className="text-xs text-slate-300">
                      <strong>Focus:</strong> {m.focus}
                    </p>
                    <p className="text-xs text-slate-400">
                      <strong>Action:</strong> {m.recommendedAction}
                    </p>
                    <div className="p-2.5 rounded-xl bg-black border border-white/5 text-[11px] text-cyan-300 font-mono flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      <span>{m.quizCheck}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
