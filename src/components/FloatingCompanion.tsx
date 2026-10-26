import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Sparkles,
  Compass,
  BookOpen,
  Timer,
  Coffee,
  HelpCircle,
  BarChart3,
  Settings as SettingsIcon,
  EyeOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  X,
  Maximize2,
  ExternalLink,
  ChevronRight,
  Flame,
  Zap,
  Mic,
  MicOff,
  Palette,
  Eye,
  Radio,
} from 'lucide-react';
import { RealisticAnimalCompanion, AnimalType, AnimalPersonality, AnimalBehaviorState } from './RealisticAnimalCompanion';
import { PipState, PipSettings, StudentProgress, BackgroundTheme } from '../types/pip';
import { pipAudio } from '../utils/audio';
import { pipSpeech } from '../utils/speech';

interface FloatingCompanionProps {
  settings: PipSettings;
  progress: StudentProgress;
  onOpenHub: (tab?: string) => void;
  onOpenPathPilot: () => void;
  onStartTour: () => void;
  onStartPomodoro: () => void;
  onUpdateSettings: (newSettings: Partial<PipSettings>) => void;
  currentSpeech?: string;
  externalPipState?: PipState;
  onVoiceInputReceived?: (text: string) => void;
}

export const FloatingCompanion: React.FC<FloatingCompanionProps> = ({
  settings,
  progress,
  onOpenHub,
  onOpenPathPilot,
  onStartTour,
  onStartPomodoro,
  onUpdateSettings,
  currentSpeech,
  externalPipState,
  onVoiceInputReceived,
}) => {
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      return {
        x: Math.max(20, window.innerWidth - 260),
        y: Math.max(40, window.innerHeight - 340),
      };
    }
    return { x: 800, y: 500 };
  });

  const [pipState, setPipState] = useState<PipState>('welcome');
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [speechText, setSpeechText] = useState(
    currentSpeech || "Neural Link established! I'm Pip, your AI study sentinel. What concept shall we conquer today?"
  );
  const [isSpeechVisible, setIsSpeechVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isRoamingPaused, setIsRoamingPaused] = useState(!settings.roamingEnabled);
  const [isMicActive, setIsMicActive] = useState(false);
  const [micInterimText, setMicInterimText] = useState('');

  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);
  const roamTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync external pip state
  useEffect(() => {
    if (externalPipState) {
      setPipState(externalPipState);
    }
  }, [externalPipState]);

  // AUTO-SPEAK AS SOON AS OPENED (User requirement: "THE AI ASSISTANT SHOULD TALK AS SOONAS I OPEN IT")
  useEffect(() => {
    pipAudio.enabled = settings.soundEffects;
    pipAudio.playGreeting();

    const welcomeGreeting =
      "Neural link established. I'm Pip, your AI learning coach. Let's master today's study goals!";

    // Speak aloud automatically
    if (settings.ttsEnabled || settings.autoVoiceOnOpen) {
      pipSpeech.speak(welcomeGreeting);
    }

    const t = setTimeout(() => {
      setPipState('idle');
    }, 4500);
    return () => clearTimeout(t);
  }, []);

  // Update speech text and vocalize
  useEffect(() => {
    if (currentSpeech) {
      setSpeechText(currentSpeech);
      setIsSpeechVisible(true);
      pipAudio.playSpeechBlip();
      if (settings.ttsEnabled) {
        pipSpeech.speak(currentSpeech);
      }
    }
  }, [currentSpeech, settings.ttsEnabled]);

  // Desktop Roaming Logic
  useEffect(() => {
    if (!settings.roamingEnabled || isRoamingPaused || isDragging || isMenuOpen) {
      if (roamTimeoutRef.current) clearTimeout(roamTimeoutRef.current);
      return;
    }

    const intervalMs = Math.max(15, settings.roamingFrequencySeconds) * 1000;

    const scheduleNextRoam = () => {
      roamTimeoutRef.current = setTimeout(() => {
        if (typeof window === 'undefined') return;

        const safeWidth = window.innerWidth - 280;
        const safeHeight = window.innerHeight - 300;

        const targetX = Math.floor(Math.random() * (safeWidth - 40) + 40);
        const targetY = Math.floor(Math.random() * (safeHeight - 120) + 70);

        setFacing(targetX < position.x ? 'left' : 'right');
        setPipState('walking');
        setPosition({ x: targetX, y: targetY });

        setTimeout(() => {
          setPipState(Math.random() > 0.6 ? 'studying' : 'idle');
          scheduleNextRoam();
        }, 1400);
      }, intervalMs);
    };

    scheduleNextRoam();

    return () => {
      if (roamTimeoutRef.current) clearTimeout(roamTimeoutRef.current);
    };
  }, [settings.roamingEnabled, isRoamingPaused, isDragging, isMenuOpen, position]);

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;

    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    };
    pipAudio.playClick();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;

      const newX = Math.max(10, Math.min(window.innerWidth - 240, dragStartRef.current.startX + deltaX));
      const newY = Math.max(10, Math.min(window.innerHeight - 260, dragStartRef.current.startY + deltaY));

      setFacing(deltaX < 0 ? 'left' : 'right');
      setPipState('walking');
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        dragStartRef.current = null;
        setPipState('idle');
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // TOGGLE MICROPHONE HEARING
  const toggleMicrophone = () => {
    pipAudio.playClick();
    if (isMicActive) {
      pipSpeech.stopListening();
      setIsMicActive(false);
      setMicInterimText('');
    } else {
      setIsMicActive(true);
      setPipState('thinking');
      setSpeechText('🎤 Listening to you... Speak your doubt or goal!');
      setIsSpeechVisible(true);

      pipSpeech.startListening(
        (transcript, isFinal) => {
          setMicInterimText(transcript);
          if (isFinal) {
            setIsMicActive(false);
            setSpeechText(`You asked: "${transcript}". Pip is synthesizing answer...`);
            setPipState('explaining');
            if (onVoiceInputReceived) {
              onVoiceInputReceived(transcript);
            }
          }
        },
        (error) => {
          setIsMicActive(false);
          setSpeechText(`Microphone error: ${error}. Click mic to retry.`);
        }
      );
    }
  };

  const handleExplainNext = () => {
    setPipState('explaining');
    const advice =
      "Priority Alert: Based on your recent 84% Calculus score, your optimal next action is 15 minutes reviewing 'Integration by Parts with Boundary Conditions' flashcards!";
    setSpeechText(advice);
    setIsSpeechVisible(true);
    pipAudio.playSpeechBlip();
    if (settings.ttsEnabled) {
      pipSpeech.speak(advice);
    }
    setIsMenuOpen(false);
  };

  return (
    <div
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isDragging ? 'none' : 'transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        zIndex: 9999,
      }}
      className="fixed top-0 left-0 pointer-events-auto"
    >
      {/* SPEECH BUBBLE */}
      {isSpeechVisible && (
        <div
          className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-80 max-w-[85vw] glass-panel-glow rounded-2xl p-4 shadow-2xl text-slate-100 z-50 animate-bubble-pop border border-cyan-500/40 ${
            settings.dyslexicFont ? 'font-dyslexic' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 font-mono">
                Pip Neural Sentinel
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  pipSpeech.speak(speechText);
                }}
                className="text-slate-400 hover:text-cyan-300 p-0.5 rounded transition"
                title="Speak message aloud"
              >
                <Volume2 size={13} />
              </button>
              <button
                onClick={() => setIsSpeechVisible(false)}
                className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-800 transition"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-100">{speechText}</p>

          {micInterimText && (
            <div className="mt-2 p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-200 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span>Transcribing: "{micInterimText}"</span>
            </div>
          )}

          <div className="mt-3 pt-2.5 border-t border-purple-500/20 flex items-center justify-between gap-2">
            <button
              onClick={handleExplainNext}
              className="text-[11px] font-medium text-purple-300 hover:text-cyan-200 flex items-center gap-1 hover:underline"
            >
              <Sparkles size={12} className="text-purple-400" />
              What's next?
            </button>

            <button
              onClick={toggleMicrophone}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 shadow-sm ${
                isMicActive ? 'bg-red-600 text-white animate-pulse' : 'bg-cyan-600/60 hover:bg-cyan-600 text-white'
              }`}
            >
              {isMicActive ? <MicOff size={12} /> : <Mic size={12} />}
              {isMicActive ? 'Listening...' : 'Voice Talk'}
            </button>
          </div>

          {/* Speech bubble pointer */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-solid border-t-slate-900/95 border-t-8 border-x-transparent border-x-8 border-b-0 filter drop-shadow-sm" />
        </div>
      )}

      {/* PIP CHARACTER CONTAINER */}
      <div
        onMouseDown={handleMouseDown}
        className="relative group cursor-grab active:cursor-grabbing select-none"
      >
        {/* Futuristic Quantum Aura */}
        <div className="absolute -inset-3 bg-gradient-to-r from-purple-600/35 via-cyan-500/25 to-indigo-600/30 rounded-full blur-2xl opacity-80 group-hover:opacity-100 transition duration-500 pointer-events-none" />

        <div className="flex flex-col items-center">
          <RealisticAnimalCompanion
            animal={(settings.companionAnimal === 'astronaut' ? 'cat' : settings.companionAnimal) as any || 'cat'}
            personality={(settings.companionPersonality as any) || 'Calm & Intelligent'}
            state={pipState === 'sleeping' ? 'sleep' : pipState === 'walking' ? 'walk' : (pipState === 'celebrating' || pipState === 'thinking') ? 'action' : 'idle'}
            scale={settings.characterScale * 0.75}
            interactive={true}
            onClick={() => {
              pipAudio.playClick();
              setIsMenuOpen(!isMenuOpen);
            }}
          />
        </div>

        {/* Floating Quick Mini-HUD */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-950/90 border border-cyan-500/40 rounded-full px-3 py-1 shadow-2xl backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMicrophone();
            }}
            className={`p-1 rounded-full transition ${
              isMicActive ? 'text-red-400 bg-red-950/60 animate-pulse' : 'text-slate-300 hover:text-cyan-300'
            }`}
            title={isMicActive ? 'Stop listening' : 'Talk with Pip (Voice Input)'}
          >
            {isMicActive ? <MicOff size={12} /> : <Mic size={12} />}
          </button>

          <span className="w-px h-3 bg-slate-700" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRoamingPaused(!isRoamingPaused);
              pipAudio.playClick();
            }}
            className="p-1 rounded-full text-slate-300 hover:text-purple-300 transition"
            title={isRoamingPaused ? 'Resume desktop roaming' : 'Pause desktop roaming'}
          >
            {isRoamingPaused ? <Play size={12} /> : <Pause size={12} />}
          </button>

          <span className="w-px h-3 bg-slate-700" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              const nextTTS = !settings.ttsEnabled;
              onUpdateSettings({ ttsEnabled: nextTTS });
              pipAudio.playClick();
              if (nextTTS) pipSpeech.speak('Voice output activated.');
            }}
            className={`p-1 rounded-full transition ${settings.ttsEnabled ? 'text-cyan-300' : 'text-slate-500'}`}
            title={settings.ttsEnabled ? 'Mute Pip Voice' : 'Unmute Pip Voice'}
          >
            {settings.ttsEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
          </button>

          <span className="w-px h-3 bg-slate-700" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenHub('desktop');
            }}
            className="p-1 rounded-full text-purple-300 hover:text-white transition"
            title="Open Full Workspace Hub"
          >
            <Maximize2 size={12} />
          </button>
        </div>
      </div>

      {/* COMPACT FLOATING MENU */}
      {isMenuOpen && (
        <div
          className={`absolute top-0 right-full mr-4 w-80 glass-panel-glow rounded-3xl p-4 shadow-2xl z-50 text-slate-100 border border-purple-500/40 animate-bubble-pop ${
            settings.dyslexicFont ? 'font-dyslexic' : ''
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                <Sparkles size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Pip AI Coach
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                    ONLINE
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">Desktop Learning Sentinel</p>
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Voice Talk Banner */}
          <div className="my-3 p-2.5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-cyan-950/60 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                <Mic size={15} />
              </div>
              <div>
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
                  Live Voice Assistant
                </span>
                <p className="text-xs font-bold text-white">Speak your question</p>
              </div>
            </div>

            <button
              onClick={toggleMicrophone}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                isMicActive ? 'bg-red-600 text-white animate-pulse' : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {isMicActive ? 'Stop Mic' : 'Start Mic'}
            </button>
          </div>

          {/* Menu Action Items */}
          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            <button
              onClick={() => {
                onOpenHub('chat');
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-600/20 text-left transition text-slate-200 hover:text-white group border border-transparent hover:border-purple-500/30"
            >
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 group-hover:scale-110 transition">
                <MessageSquare size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-white">Chat & Ask Doubts</p>
                <p className="text-[11px] text-slate-400">Socratic conceptual breakdown</p>
              </div>
            </button>

            <button
              onClick={handleExplainNext}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-600/20 text-left transition text-slate-200 hover:text-white group border border-transparent hover:border-purple-500/30"
            >
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 group-hover:scale-110 transition">
                <Sparkles size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-white">Explain What I Should Do Next</p>
                <p className="text-[11px] text-slate-400">Adaptive next recommendation</p>
              </div>
            </button>

            <button
              onClick={() => {
                onOpenPathPilot();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/30 text-left transition text-slate-200 hover:text-white group border border-purple-500/30"
            >
              <div className="p-2 rounded-lg bg-purple-500 text-white shadow group-hover:scale-110 transition">
                <ExternalLink size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white">Open PathPilot AI</p>
                <p className="text-[11px] text-slate-400">Launch learning classroom</p>
              </div>
            </button>

            <button
              onClick={() => {
                onStartPomodoro();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-600/20 text-left transition text-slate-200 hover:text-white group border border-transparent hover:border-purple-500/30"
            >
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 group-hover:scale-110 transition">
                <Timer size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-white">Start Lock Screen Focus</p>
                <p className="text-[11px] text-slate-400">Pomodoro sprint with binaural audio</p>
              </div>
            </button>

            <button
              onClick={() => {
                onOpenHub('accessibility');
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-600/20 text-left transition text-slate-200 hover:text-white group border border-transparent hover:border-purple-500/30"
            >
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition">
                <Eye size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-white">Accessibility Suite</p>
                <p className="text-[11px] text-slate-400">Blind, Deaf, Dyslexic & Colorblind tools</p>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <button
              onClick={() => {
                setIsSpeechVisible(false);
                setIsMenuOpen(false);
              }}
              className="hover:text-white flex items-center gap-1"
            >
              <EyeOff size={13} />
              Hide Pip
            </button>

            <button
              onClick={() => {
                onOpenHub('desktop');
                setIsMenuOpen(false);
              }}
              className="text-cyan-300 hover:text-cyan-100 font-semibold flex items-center gap-1"
            >
              Open Full Hub
              <Maximize2 size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
