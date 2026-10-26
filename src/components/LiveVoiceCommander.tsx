import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  X,
  Radio,
  ArrowRight,
  HelpCircle,
  Rocket,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
} from 'lucide-react';
import { pipSpeech } from '../utils/speech';
import { pipAudio } from '../utils/audio';

interface LiveVoiceCommanderProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onExecuteAction: (action: string, targetTopic?: string, speechReply?: string) => void;
  ttsEnabled: boolean;
}

export function LiveVoiceCommander({
  isOpen,
  onClose,
  currentView,
  onExecuteAction,
  ttsEnabled,
}: LiveVoiceCommanderProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastReply, setLastReply] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Click Start Listening or choose a command');
  const [audioLevel, setAudioLevel] = useState<number[]>(new Array(12).fill(12));
  const waveIntervalRef = useRef<any>(null);

  // Suggested spoken commands
  const suggestedCommands = [
    { text: 'Open the 3-Step Course Engine', action: 'NAVIGATE_3STEP' },
    { text: 'Activate 25-minute Pomodoro lock screen', action: 'START_POMODORO' },
    { text: 'Help me understand memory barrier doubt in Peterson algorithm', action: 'NAVIGATE_TUTOR' },
    { text: 'Open spaced repetition flashcards', action: 'NAVIGATE_FLASHCARDS' },
    { text: 'Analyze previous year exam questions', action: 'NAVIGATE_PYQ' },
    { text: 'Open Spotify and cognitive breaks', action: 'NAVIGATE_BREAKS' },
    { text: 'Show my weekly class timetable', action: 'NAVIGATE_TIMETABLE' },
    { text: 'Show today missions and to-do list', action: 'NAVIGATE_MISSIONS' },
    { text: 'Open student analytics and retention index', action: 'NAVIGATE_ANALYTICS' },
    { text: 'Open accessibility suite for dyslexic and blind learners', action: 'NAVIGATE_ACCESSIBILITY' },
  ];

  // Start animated visual waves when listening
  useEffect(() => {
    if (isListening) {
      waveIntervalRef.current = setInterval(() => {
        setAudioLevel(new Array(12).fill(0).map(() => Math.floor(Math.random() * 32) + 8));
      }, 100);
    } else {
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
      setAudioLevel(new Array(12).fill(10));
    }
    return () => {
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    };
  }, [isListening]);

  // Automatically start listening when opened if supported
  useEffect(() => {
    if (isOpen) {
      handleStartListening();
    } else {
      handleStopListening();
    }
  }, [isOpen]);

  const handleStartListening = async () => {
    if (typeof window === 'undefined') return;
    setTranscript('');
    setStatusMessage('Listening to your voice... Speak now');
    pipAudio.playClick();

    // Request permissions first
    await pipSpeech.requestMicrophonePermission();

    await pipSpeech.startListening(
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim()) {
          setIsListening(false);
          setStatusMessage('Voice command recognized! Processing...');
          processSpokenCommand(text.trim());
        } else {
          setStatusMessage('Listening to your voice...');
        }
      },
      (error) => {
        console.warn('Speech recognition warning:', error);
        setIsListening(false);
        setStatusMessage('Microphone idle. Tap Start Live Voice or click any quick command below.');
      }
    );
    setIsListening(true);
  };

  const handleStopListening = () => {
    pipSpeech.stopListening();
    setIsListening(false);
  };

  const processSpokenCommand = async (commandText: string) => {
    if (!commandText || !commandText.trim()) return;
    handleStopListening();
    setIsProcessing(true);
    setStatusMessage('Analyzing intent with Cosmos Voice AI...');
    pipAudio.playClick();

    try {
      const response = await fetch('/api/gemini/voice-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: commandText,
          currentView,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to dispatch voice command');
      }

      const data = await response.json();
      const result = data.result || {};
      const action = result.action || 'GENERAL_TALK';
      const speechReply = result.speechReply || `Command understood: "${commandText}"`;
      const targetTopic = result.targetTopic || '';

      setLastAction(action);
      setLastReply(speechReply);
      setStatusMessage('Command executed successfully');
      pipAudio.playCelebrate();

      // Read reply aloud if TTS is enabled
      if (ttsEnabled) {
        pipSpeech.speak(speechReply);
      }

      // Execute action
      onExecuteAction(action, targetTopic, speechReply);
    } catch (err: any) {
      console.warn('Voice commander API error, falling back to local routing:', err);
      // Client-side rule fallback
      const lower = commandText.toLowerCase();
      let act = 'NAVIGATE_3STEP';
      let rep = `Switching to 3-step course engine for "${commandText}".`;

      if (lower.includes('pomodoro') || lower.includes('focus') || lower.includes('timer')) {
        act = 'START_POMODORO';
        rep = 'Starting 25-minute Pomodoro focus session.';
      } else if (lower.includes('break') || lower.includes('spotify') || lower.includes('music')) {
        act = 'NAVIGATE_BREAKS';
        rep = 'Opening Spotify lo-fi & breaks hub.';
      } else if (lower.includes('doubt') || lower.includes('tutor') || lower.includes('explain')) {
        act = 'NAVIGATE_TUTOR';
        rep = 'Opening AI Tutor doubt clearing.';
      } else if (lower.includes('flashcard') || lower.includes('card')) {
        act = 'NAVIGATE_FLASHCARDS';
        rep = 'Opening Spaced Repetition Flashcards.';
      } else if (lower.includes('pyq') || lower.includes('exam')) {
        act = 'NAVIGATE_PYQ';
        rep = 'Opening PYQ Past Year Question Analyser.';
      } else if (lower.includes('timetable') || lower.includes('class')) {
        act = 'NAVIGATE_TIMETABLE';
        rep = 'Opening course schedule & timetable.';
      } else if (lower.includes('mission') || lower.includes('todo') || lower.includes('task')) {
        act = 'NAVIGATE_MISSIONS';
        rep = 'Opening Today missions and to-do checklist.';
      } else if (lower.includes('analytic') || lower.includes('retention')) {
        act = 'NAVIGATE_ANALYTICS';
        rep = 'Opening Student retention analytics.';
      } else if (lower.includes('accessible') || lower.includes('accessibility')) {
        act = 'NAVIGATE_ACCESSIBILITY';
        rep = 'Opening Accessibility suite.';
      }

      setLastAction(act);
      setLastReply(rep);
      setStatusMessage('Command executed (offline fallback)');
      if (ttsEnabled) pipSpeech.speak(rep);
      onExecuteAction(act, commandText, rep);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#030712] border-2 border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-500/20 p-6 sm:p-8 overflow-hidden text-slate-100">
        {/* Futuristic background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-500/20 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
              <Radio size={20} className={isListening ? 'animate-pulse text-cyan-300' : ''} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                Live Voice Commanding HUD
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  REAL-TIME GEMINI DISPATCH
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Hands-free spoken control for navigation, Pomodoro, doubt clearing, and study drills
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleStopListening();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Audio Wave Visualizer & Mic Button */}
        <div className="flex flex-col items-center justify-center py-6 px-4 bg-[#050b1d]/80 rounded-2xl border border-cyan-500/25 mb-6">
          <div className="flex items-center justify-center gap-1.5 h-12 mb-4 w-full max-w-xs">
            {audioLevel.map((height, i) => (
              <div
                key={i}
                style={{ height: `${height}px` }}
                className={`w-2 rounded-full transition-all duration-100 ${
                  isListening
                    ? 'bg-gradient-to-t from-cyan-500 to-sky-300 shadow-sm shadow-cyan-400/50'
                    : 'bg-slate-700/60'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (isListening) {
                  handleStopListening();
                } else {
                  handleStartListening();
                }
              }}
              disabled={isProcessing}
              className={`px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 transition shadow-lg ${
                isListening
                  ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/25 animate-pulse'
                  : 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-black shadow-cyan-500/25'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff size={18} />
                  <span>Stop Listening</span>
                </>
              ) : (
                <>
                  <Mic size={18} />
                  <span>{isProcessing ? 'Thinking...' : 'Start Live Voice'}</span>
                </>
              )}
            </button>

            {transcript && !isListening && (
              <button
                onClick={() => processSpokenCommand(transcript)}
                disabled={isProcessing}
                className="px-5 py-3.5 rounded-2xl bg-cyan-950 border border-cyan-500 text-cyan-300 hover:bg-cyan-900/80 font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <span>Execute Spoken Text</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 font-mono mt-3 text-center">{statusMessage}</p>
        </div>

        {/* Live Transcript Display */}
        <div className="mb-6">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 block">
            Recognized Speech Transcript
          </label>
          <div className="w-full min-h-[56px] p-3 rounded-2xl bg-slate-900/80 border border-slate-700 text-sm font-sans text-white flex items-center justify-between">
            <span className={transcript ? 'text-white' : 'text-slate-500 italic'}>
              {transcript || (isListening ? 'Speak your command clearly into the microphone...' : 'No voice captured yet.')}
            </span>
            {transcript && (
              <button
                onClick={() => setTranscript('')}
                className="text-[11px] font-mono text-slate-400 hover:text-slate-200 underline ml-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* AI Voice Feedback Reply (Spoken aloud) */}
        {lastReply && (
          <div className="mb-6 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 mt-0.5">
              <Volume2 size={16} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold text-cyan-400">
                  Cosmos Spoken Response ({lastAction})
                </span>
                <button
                  onClick={() => pipSpeech.speak(lastReply)}
                  className="text-[10px] font-mono text-cyan-300 underline hover:text-white"
                >
                  Replay Audio
                </button>
              </div>
              <p className="text-xs text-slate-200 mt-1">{lastReply}</p>
            </div>
          </div>
        )}

        {/* Quick Voice Command Chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Or Tap Any Instant Spoken Command
            </span>
            <span className="text-[10px] text-slate-500 font-mono">1-Click Fast Dispatch</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {suggestedCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(cmd.text);
                  processSpokenCommand(cmd.text);
                }}
                disabled={isProcessing}
                className="text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-200 transition flex items-center justify-between group"
              >
                <span className="truncate pr-2 font-medium">"{cmd.text}"</span>
                <ArrowRight size={12} className="text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
