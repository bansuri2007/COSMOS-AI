import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  Flame,
  Award,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { PipCharacter } from './PipCharacter';
import { pipAudio } from '../utils/audio';

interface PomodoroLockScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete: (minutes: number) => void;
  targetTask?: string;
}

export const PomodoroLockScreen: React.FC<PomodoroLockScreenProps> = ({
  isOpen,
  onClose,
  onSessionComplete,
  targetTask = 'Mastering Integration by Parts & Recurrence Relations',
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25); // minutes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // seconds
  const [isActive, setIsActive] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<'off' | 'binaural' | 'rain' | 'whitenoise'>('off');
  const [ambientAudioActive, setAmbientAudioActive] = useState(false);
  const [currentTaskInput, setCurrentTaskInput] = useState(targetTask);
  const [isCompleted, setIsCompleted] = useState(false);

  // Web Audio Synth for ambient sound generator
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<any>(null);

  useEffect(() => {
    setTimeLeft(selectedDuration * 60);
  }, [selectedDuration]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setIsCompleted(true);
      pipAudio.playCelebrate();
      onSessionComplete(selectedDuration);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, selectedDuration]);

  // Ambient sound synth
  const toggleAmbientSound = (type: 'off' | 'binaural' | 'rain' | 'whitenoise') => {
    pipAudio.playClick();
    if (ambientSound === type) {
      stopAmbient();
      setAmbientSound('off');
      return;
    }

    stopAmbient();
    setAmbientSound(type);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (type === 'binaural') {
        // 40Hz Gamma wave binaural beat for deep focus
        const oscLeft = ctx.createOscillator();
        const oscRight = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);
        const gain = ctx.createGain();

        oscLeft.frequency.value = 200;
        oscRight.frequency.value = 240; // 40Hz difference

        gain.gain.value = 0.04;

        oscLeft.connect(merger, 0, 0);
        oscRight.connect(merger, 0, 1);
        merger.connect(gain);
        gain.connect(ctx.destination);

        oscLeft.start();
        oscRight.start();
        noiseNodeRef.current = [oscLeft, oscRight];
      } else if (type === 'rain' || type === 'whitenoise') {
        // White / Pink Noise generator buffer
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Pink/Rain filter
          lastOut = (lastOut * 0.95 + white * 0.05);
          data[i] = type === 'rain' ? lastOut * 1.5 : white * 0.03;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.value = type === 'rain' ? 800 : 1200;

        const gain = ctx.createGain();
        gain.gain.value = 0.05;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        noiseNodeRef.current = [noise];
      }
    } catch (e) {
      console.error('Failed to init ambient synth:', e);
    }
  };

  const stopAmbient = () => {
    if (noiseNodeRef.current) {
      if (Array.isArray(noiseNodeRef.current)) {
        noiseNodeRef.current.forEach((n: any) => {
          try {
            n.stop();
          } catch (e) {}
        });
      }
      noiseNodeRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, []);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100;

  return (
    <div className="fixed inset-0 z-[10001] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-between p-6 md:p-12 text-white select-none animate-bubble-pop">
      {/* Top Header Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-500/30">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Pomodoro Focus Lock
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Distraction-Free Mode
              </span>
            </h2>
            <p className="text-xs text-slate-400">Pip is maintaining your flow state</p>
          </div>
        </div>

        {/* Unlock / Exit Button */}
        <button
          onClick={() => {
            stopAmbient();
            onClose();
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500/50 text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          <Unlock size={14} />
          Exit Lock Screen
        </button>
      </div>

      {/* Main Focus Centerpiece */}
      <div className="flex flex-col items-center max-w-2xl text-center space-y-6 my-auto">
        {/* Pinned Goal Input */}
        <div className="w-full max-w-md bg-slate-900/80 border border-purple-500/20 rounded-2xl p-3 shadow-inner">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1">
            Target Focus Task
          </label>
          <input
            type="text"
            value={currentTaskInput}
            onChange={(e) => setCurrentTaskInput(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-white text-center focus:outline-none"
            placeholder="What are you mastering in this sprint?"
          />
        </div>

        {/* Circular Countdown Progress Ring */}
        <div className="relative flex items-center justify-center">
          <svg className="w-72 h-72 md:w-80 md:h-80 -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="120"
              className="stroke-slate-900 stroke-[12] fill-transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="120"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              className="stroke-purple-500 stroke-[12] fill-transparent transition-all duration-1000 ease-linear shadow-lg"
              style={{
                filter: 'drop-shadow(0 0 16px rgba(168, 85, 247, 0.4))',
              }}
            />
          </svg>

          {/* Center Digital Display & Pip */}
          <div className="absolute flex flex-col items-center justify-center">
            <div className="scale-75 -my-4">
              <PipCharacter
                state={isCompleted ? 'celebrating' : isActive ? 'studying' : 'encouraging'}
                scale={0.8}
                interactive={false}
              />
            </div>
            <div className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white font-mono drop-shadow-md">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <p className="text-xs font-semibold text-purple-300 mt-1 uppercase tracking-widest">
              {isCompleted ? '🎉 Sprint Mastered!' : isActive ? 'Deep Focus Sprint' : 'Ready to Start'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              pipAudio.playClick();
              setIsActive(!isActive);
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition"
          >
            {isActive ? <Pause size={18} /> : <Play size={18} />}
            {isActive ? 'Pause Focus' : 'Start Focus Sprint'}
          </button>

          <button
            onClick={() => {
              pipAudio.playClick();
              setIsActive(false);
              setTimeLeft(selectedDuration * 60);
              setIsCompleted(false);
            }}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
            title="Reset timer"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Duration Quick Toggles */}
        <div className="flex items-center gap-2">
          {[15, 25, 45, 60].map((dur) => (
            <button
              key={dur}
              onClick={() => {
                pipAudio.playClick();
                setSelectedDuration(dur);
                setIsActive(false);
                setIsCompleted(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedDuration === dur
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {dur} Min
            </button>
          ))}
        </div>
      </div>

      {/* Ambient Audio Bar */}
      <div className="w-full max-w-xl bg-slate-900/90 border border-purple-500/20 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Volume2 size={16} className="text-purple-400" />
          <span>Ambient Focus Audio:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleAmbientSound('binaural')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              ambientSound === 'binaural'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            🧠 40Hz Gamma Beat
          </button>
          <button
            onClick={() => toggleAmbientSound('rain')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              ambientSound === 'rain'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            🌧️ Study Rain
          </button>
          <button
            onClick={() => toggleAmbientSound('whitenoise')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              ambientSound === 'whitenoise'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            🌊 White Noise
          </button>
          {ambientSound !== 'off' && (
            <button
              onClick={() => toggleAmbientSound('off')}
              className="text-slate-400 hover:text-rose-400 p-1"
              title="Mute ambient"
            >
              <VolumeX size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
