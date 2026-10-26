import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Eye,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Type,
  Ear,
  Sliders,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Keyboard,
  Glasses,
  Sun,
  Moon,
  Compass,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { PipSettings, BackgroundTheme, ColorBlindMode } from '../types/pip';
import { pipAudio } from '../utils/audio';
import { pipSpeech } from '../utils/speech';

interface AccessibilityModuleProps {
  settings: PipSettings;
  onUpdateSettings: (newSettings: Partial<PipSettings>) => void;
  onTriggerVisualAlert?: () => void;
  onVoiceCommandAction?: (action: string, targetTopic?: string, speechReply?: string) => void;
}

export const AccessibilityModule: React.FC<AccessibilityModuleProps> = ({
  settings,
  onUpdateSettings,
  onTriggerVisualAlert,
  onVoiceCommandAction,
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'blind' | 'deaf' | 'dyslexic'>('voice');

  // ==========================================
  // 1. VOICE COMMANDING & INTERACTIVE AI STATE
  // ==========================================
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiSpokenResponse, setAiSpokenResponse] = useState(
    "Hello! I am your interactive voice assistant. You can speak any command like 'Go to 3-step engine', 'Start Pomodoro', 'Explain Virtual Memory', or 'Read this page'!"
  );
  const [isExecutingVoice, setIsExecutingVoice] = useState(false);
  const [voiceHistory, setVoiceHistory] = useState<
    { speaker: 'user' | 'ai'; text: string; time: string; action?: string }[]
  >([
    {
      speaker: 'ai',
      text: "Voice commanding active. Speak your command or academic question.",
      time: 'Just now',
    },
  ]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = async (event: any) => {
        const spoken = event.results[0][0].transcript;
        setTranscript(spoken);
        setIsListening(false);
        await handleExecuteVoiceCommand(spoken);
      };

      recognition.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      pipSpeech.stopListening();
      setIsListening(false);
      return;
    }

    pipAudio.playClick();
    setTranscript('');
    setIsListening(true);

    pipSpeech.startListening(
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim()) {
          setIsListening(false);
          handleExecuteVoiceCommand(text.trim());
        }
      },
      (err) => {
        setIsListening(false);
        setTranscript(err);
      }
    );
  };

  const handleExecuteVoiceCommand = async (commandText: string) => {
    if (!commandText.trim()) return;
    setIsExecutingVoice(true);
    pipAudio.playThinking();

    const clean = commandText.trim();
    setVoiceHistory((prev) => [
      ...prev,
      { speaker: 'user', text: clean, time: new Date().toLocaleTimeString() },
    ]);

    try {
      const res = await fetch('/api/gemini/voice-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: clean,
          currentView: 'accessibility',
        }),
      });

      const data = await res.json();
      const result = data.result || {};
      const reply = result.speechReply || `Executing: ${clean}`;

      setAiSpokenResponse(reply);
      setVoiceHistory((prev) => [
        ...prev,
        {
          speaker: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString(),
          action: result.action,
        },
      ]);

      // Speak reply aloud
      if (settings.ttsEnabled) {
        pipSpeech.speak(reply);
      }
      pipAudio.playCelebrate();

      // Trigger action in parent app
      if (onVoiceCommandAction) {
        onVoiceCommandAction(result.action, result.targetTopic, reply);
      }
    } catch (e) {
      console.error('Voice command dispatch error:', e);
      const fallback = `I heard "${clean}". Routing to your academic study planner!`;
      setAiSpokenResponse(fallback);
      if (settings.ttsEnabled) pipSpeech.speak(fallback);
    } finally {
      setIsExecutingVoice(false);
    }
  };

  // Screen Reader simulation for Blind/Low-Vision users
  const [isReadingPage, setIsReadingPage] = useState(false);
  const handleReadActiveSection = (textToRead: string) => {
    if (isReadingPage) {
      pipSpeech.stopSpeaking();
      setIsReadingPage(false);
    } else {
      pipSpeech.speak(textToRead);
      setIsReadingPage(true);
    }
  };

  // Scotopic background tints for dyslexic users
  const [selectedTint, setSelectedTint] = useState<'default' | 'cream' | 'sage' | 'mist'>('default');

  const DYSLEXIA_TINTS = [
    { id: 'default', name: 'Cosmic Dark (Default)', bg: 'bg-[#02040a]' },
    { id: 'cream', name: 'Warm Cream (Irlen Comfort)', bg: 'bg-[#faf6ee] text-slate-900' },
    { id: 'sage', name: 'Calming Sage Green', bg: 'bg-[#eef4ee] text-slate-900' },
    { id: 'mist', name: 'Soft Sky Mist', bg: 'bg-[#eef3f8] text-slate-900' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#040816]/95 border border-sky-500/30 shadow-2xl backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300">
              <Glasses size={16} />
            </span>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
              Inclusive Universal Access Suite
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Accessibility Hub for Blind, Deaf & Dyslexic Learners
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Full multimodal compliance featuring interactive AI voice commanding, live speech-to-text subtitles, screen reader earcons, OpenDyslexic tracking rulers, and Irlen scotopic tinting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onTriggerVisualAlert) onTriggerVisualAlert();
              pipAudio.playClick();
            }}
            className="px-3.5 py-2 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold text-xs transition"
          >
            ⚡ Test Visual Alert Flash
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-sky-500/20 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            pipAudio.playClick();
            setActiveTab('voice');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'voice'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-[#030612] border border-white/5'
          }`}
        >
          <Mic size={15} />
          Voice AI Commanding & Talk
        </button>

        <button
          onClick={() => {
            pipAudio.playClick();
            setActiveTab('blind');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'blind'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-[#030612] border border-white/5'
          }`}
        >
          <Eye size={15} />
          Blind & Low-Vision Suite
        </button>

        <button
          onClick={() => {
            pipAudio.playClick();
            setActiveTab('deaf');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'deaf'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-[#030612] border border-white/5'
          }`}
        >
          <Ear size={15} />
          Deaf & Hard-of-Hearing Suite
        </button>

        <button
          onClick={() => {
            pipAudio.playClick();
            setActiveTab('dyslexic');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'dyslexic'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-[#030612] border border-white/5'
          }`}
        >
          <Type size={15} />
          Dyslexia & Reading Ruler Suite
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. INTERACTIVE VOICE COMMANDING & TALK STATION                            */}
      {/* ========================================================================= */}
      {activeTab === 'voice' && (
        <div className="space-y-6 animate-bubble-pop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Microphone & Waveform Command Console (lg:col-span-7) */}
            <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-[#040816]/95 border border-sky-500/30 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">
                    Two-Way Spoken AI Assistant
                  </span>
                  <h3 className="text-lg font-bold text-white">Live Voice Commanding</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      isListening ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                    }`}
                  />
                  <span className="text-xs font-mono text-slate-400">
                    {isListening ? 'Listening to Mic...' : 'Ready to Speak'}
                  </span>
                </div>
              </div>

              {/* Big Interactive Mic Button */}
              <div className="p-8 rounded-3xl bg-[#02050f] border border-sky-500/20 text-center space-y-4">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-300 shadow-2xl ${
                    isListening
                      ? 'bg-rose-600 text-white ring-8 ring-rose-500/30 scale-110 animate-pulse'
                      : 'bg-gradient-to-tr from-sky-500 via-cyan-400 to-blue-600 hover:scale-105 text-black'
                  }`}
                  title={isListening ? 'Click to stop listening' : 'Click to speak a voice command'}
                >
                  {isListening ? <MicOff size={36} /> : <Mic size={36} />}
                </button>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">
                    {isListening ? 'Listening to your voice...' : 'Click the microphone & speak your command'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Cosmos AI hears you, executes your intent, and speaks back immediately.
                  </p>
                </div>

                {/* Animated Waveform Simulation */}
                {isListening && (
                  <div className="flex items-center justify-center gap-1.5 h-10 pt-2">
                    {[40, 75, 100, 60, 90, 45, 80, 95, 50, 70].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-cyan-400 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Typed command fallback input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleExecuteVoiceCommand(transcript);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Or type a voice command e.g. 'Go to 3-step engine' or 'Start quiz'..."
                  className="flex-1 bg-[#02050e] border border-sky-500/30 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={isExecutingVoice || !transcript.trim()}
                  className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md transition disabled:opacity-50"
                >
                  Execute
                </button>
              </form>

              {/* AI Spoken Speech Bubble */}
              <div className="p-4 rounded-2xl bg-[#02050e] border border-cyan-400/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Volume2 size={14} />
                    AI Spoken Response:
                  </span>
                  <button
                    onClick={() => pipSpeech.speak(aiSpokenResponse)}
                    className="text-[11px] text-slate-400 hover:text-white underline"
                  >
                    Replay Audio
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{aiSpokenResponse}</p>
              </div>
            </div>

            {/* Right: Quick Voice Command Triggers & Dialogue History (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-[#040816]/95 border border-sky-500/20 shadow-xl space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
                  Supported Spoken Audio Commands:
                </h4>

                <div className="space-y-2">
                  {[
                    { cmd: '🚀 "Go to 3-step engine"', desc: 'Upload syllabus & read topic notes' },
                    { cmd: '🧠 "Explain Virtual Memory"', desc: 'Launches Socratic AI tutor explanation' },
                    { cmd: '⏱️ "Start 25-minute Pomodoro"', desc: 'Activates focus lock screen' },
                    { cmd: '☕ "Open study breaks & Spotify"', desc: 'Launches music & language sprints' },
                    { cmd: '📑 "Check my weak topics"', desc: 'Opens PYQ Analyser & remedial items' },
                    { cmd: '📢 "Read this page aloud"', desc: 'Activates screen reader text audio' },
                  ].map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleExecuteVoiceCommand(c.cmd.replace(/["\p{Emoji}]/gu, '').trim())}
                      className="w-full p-3 rounded-2xl bg-[#02050e] border border-white/5 hover:border-cyan-400/50 text-left transition space-y-0.5 group"
                    >
                      <p className="text-xs font-bold text-cyan-300 group-hover:text-white">{c.cmd}</p>
                      <p className="text-[10px] text-slate-400">{c.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dialogue Transcript Log */}
              <div className="p-5 rounded-3xl bg-[#02050e] border border-white/5 space-y-3 max-h-56 overflow-y-auto">
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">
                  Recent Voice Logs:
                </span>
                <div className="space-y-2">
                  {voiceHistory.slice(-4).map((h, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl text-xs ${
                        h.speaker === 'user'
                          ? 'bg-cyan-950/30 border border-cyan-500/30 text-cyan-200'
                          : 'bg-slate-900 border border-white/10 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-0.5">
                        <span>{h.speaker === 'user' ? '👤 Student Spoke' : '🦉 Cosmos AI'}</span>
                        <span>{h.time}</span>
                      </div>
                      <p className="leading-snug">{h.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BLIND & LOW-VISION ACCESSIBILITY SUITE                                 */}
      {/* ========================================================================= */}
      {activeTab === 'blind' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#040816]/95 border border-sky-500/30 shadow-2xl space-y-6 animate-bubble-pop">
          <div className="pb-3 border-b border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">
              Sensory Audio Modality
            </span>
            <h3 className="text-lg font-bold text-white">Blind & Low-Vision Optimization Tools</h3>
            <p className="text-xs text-slate-400">
              High-contrast earcons, full keyboard accessibility, screen reader audio descriptions, and font magnifiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Screen Reader Control Card */}
            <div className="p-6 rounded-3xl bg-[#02050f] border border-sky-500/20 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Volume2 size={16} className="text-cyan-400" />
                Integrated Screen Reader & Earcons
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reads highlighted text and interface cards aloud using natural human-sounding synthetic speech.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleReadActiveSection(
                      "Cosmos AI University Platform. Active view: Accessibility Hub. Screen reader is reading this text aloud. All interactive elements have aria labels and audio earcons attached."
                    )
                  }
                  className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition flex items-center justify-center gap-2"
                >
                  {isReadingPage ? <Pause size={15} /> : <Play size={15} />}
                  <span>{isReadingPage ? 'Pause Screen Reader' : 'Test Screen Reader Aloud'}</span>
                </button>
              </div>
            </div>

            {/* Keyboard Shortcuts Cheatsheet Card */}
            <div className="p-6 rounded-3xl bg-[#02050f] border border-sky-500/20 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Keyboard size={16} className="text-cyan-400" />
                Keyboard Navigation Shortcuts
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-[#040816] border border-white/10 text-slate-300">
                  <span className="font-bold text-cyan-400">Alt + 1:</span> 3-Step Engine
                </div>
                <div className="p-2 rounded-xl bg-[#040816] border border-white/10 text-slate-300">
                  <span className="font-bold text-cyan-400">Alt + 2:</span> AI Tutor
                </div>
                <div className="p-2 rounded-xl bg-[#040816] border border-white/10 text-slate-300">
                  <span className="font-bold text-cyan-400">Alt + 3:</span> Flashcards
                </div>
                <div className="p-2 rounded-xl bg-[#040816] border border-white/10 text-slate-300">
                  <span className="font-bold text-cyan-400">Alt + 4:</span> PYQ Analyser
                </div>
                <div className="p-2 rounded-xl bg-[#040816] border border-white/10 text-slate-300">
                  <span className="font-bold text-cyan-400">Alt + 5:</span> Breaks & Games
                </div>
                <div className="p-2 rounded-xl bg-[#040816] border border-white/10 text-slate-300">
                  <span className="font-bold text-cyan-400">Alt + M:</span> Mic Command
                </div>
              </div>
            </div>
          </div>

          {/* High Contrast & Font Magnifier Settings */}
          <div className="p-6 rounded-3xl bg-[#02050f] border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white">Visual Contrast & Font Magnifier</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="p-4 rounded-2xl bg-[#040816] border border-white/10 flex items-center justify-between cursor-pointer hover:border-cyan-400 transition">
                <div>
                  <span className="text-xs font-bold text-white block">Ultra High Contrast Mode</span>
                  <span className="text-[10px] text-slate-400">Increases border definition and contrast ratios</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => onUpdateSettings({ highContrast: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400"
                />
              </label>

              <label className="p-4 rounded-2xl bg-[#040816] border border-white/10 flex items-center justify-between cursor-pointer hover:border-cyan-400 transition">
                <div>
                  <span className="text-xs font-bold text-white block">Audio UI Sound Earcons</span>
                  <span className="text-[10px] text-slate-400">Plays distinct audio chimes on clicks and actions</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) => onUpdateSettings({ soundEffects: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DEAF & HARD-OF-HEARING ACCESSIBILITY SUITE                             */}
      {/* ========================================================================= */}
      {activeTab === 'deaf' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#040816]/95 border border-sky-500/30 shadow-2xl space-y-6 animate-bubble-pop">
          <div className="pb-3 border-b border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">
              Visual Auditory Substitutions
            </span>
            <h3 className="text-lg font-bold text-white">Deaf & Hard-of-Hearing Accessibility Tools</h3>
            <p className="text-xs text-slate-400">
              Live subtitles ribbon, visual alert strobes for timers and quiz scores, and full text transcripts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Live Captions Toggle Card */}
            <div className="p-6 rounded-3xl bg-[#02050f] border border-sky-500/20 space-y-3">
              <span className="text-2xl">💬</span>
              <h4 className="text-sm font-bold text-white">Persistent Live Subtitles Bar</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Renders real-time text captions at the bottom of the screen for any audio explanation, tutor speech, or video.
              </p>
              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.liveCaptions}
                  onChange={(e) => onUpdateSettings({ liveCaptions: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400"
                />
                <span className="text-xs font-bold text-cyan-300">Enable Live Captions Ribbon</span>
              </label>
            </div>

            {/* Visual Screen Flash Indicator Card */}
            <div className="p-6 rounded-3xl bg-[#02050f] border border-sky-500/20 space-y-3">
              <span className="text-2xl">⚡</span>
              <h4 className="text-sm font-bold text-white">Visual Alert Flash Strobe</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Replaces audio bells and buzzers with a glowing cyan screen border flash when Pomodoro finishes or quiz scores record.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onTriggerVisualAlert) onTriggerVisualAlert();
                  pipAudio.playClick();
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold text-xs hover:bg-cyan-500 hover:text-black transition"
              >
                Trigger Sample Visual Flash
              </button>
            </div>

            {/* Full Audio Transcripts Card */}
            <div className="p-6 rounded-3xl bg-[#02050f] border border-sky-500/20 space-y-3">
              <span className="text-2xl">📜</span>
              <h4 className="text-sm font-bold text-white">Synchronized Text Transcripts</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All lectures, shorts, and podcast bites provide downloadable, readable transcripts with key takeaways highlighted.
              </p>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold inline-block">
                ✓ Full Transcripts Enabled
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DYSLEXIA & READING RULER ACCESSIBILITY SUITE                           */}
      {/* ========================================================================= */}
      {activeTab === 'dyslexic' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#040816]/95 border border-sky-500/30 shadow-2xl space-y-6 animate-bubble-pop">
          <div className="pb-3 border-b border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">
              Cognitive & Reading Ergonomics
            </span>
            <h3 className="text-lg font-bold text-white">Dyslexia, Reading Ruler & Irlen Tinting</h3>
            <p className="text-xs text-slate-400">
              OpenDyslexic typography, tracking guide ruler, bionic word focus, and scotopic background tints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OpenDyslexic Font Toggle */}
            <div className="p-6 rounded-3xl bg-[#02050f] border border-sky-500/20 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Type size={16} className="text-cyan-400" />
                OpenDyslexic High-Readability Typography
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Uses weighted letter bottoms and generous spacing to prevent letter flipping and optical rotation.
              </p>

              <label className="p-4 rounded-2xl bg-[#040816] border border-white/10 flex items-center justify-between cursor-pointer hover:border-cyan-400 transition">
                <span className="text-xs font-bold text-white">Activate Dyslexic Font Across App</span>
                <input
                  type="checkbox"
                  checked={settings.dyslexicFont}
                  onChange={(e) => onUpdateSettings({ dyslexicFont: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400"
                />
              </label>
            </div>

            {/* Reading Ruler Toggle */}
            <div className="p-6 rounded-3xl bg-[#02050f] border border-sky-500/20 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Glasses size={16} className="text-cyan-400" />
                Interactive Line Reading Ruler
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Displays a cursor-following translucent ruler to isolate one line of text at a time and prevent accidental line skipping.
              </p>

              <label className="p-4 rounded-2xl bg-[#040816] border border-white/10 flex items-center justify-between cursor-pointer hover:border-cyan-400 transition">
                <span className="text-xs font-bold text-white">Enable Mouse Tracking Reading Ruler</span>
                <input
                  type="checkbox"
                  checked={settings.readingRuler}
                  onChange={(e) => onUpdateSettings({ readingRuler: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400"
                />
              </label>
            </div>
          </div>

          {/* Colorblind Filters */}
          <div className="p-6 rounded-3xl bg-[#02050f] border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white">Color Vision Calibration</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['none', 'protanopia', 'deuteranopia', 'tritanopia', 'monochrome'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    pipAudio.playClick();
                    onUpdateSettings({ colorBlindMode: mode });
                  }}
                  className={`p-3 rounded-2xl border text-xs font-bold capitalize transition ${
                    settings.colorBlindMode === mode
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-[#040816] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
