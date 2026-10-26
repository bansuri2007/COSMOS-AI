import React, { useState } from 'react';
import {
  Monitor,
  Maximize2,
  Minimize2,
  X,
  ExternalLink,
  Code2,
  FileText,
  Globe,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Flame,
  Zap,
} from 'lucide-react';
import { pipAudio } from '../utils/audio';

interface DesktopSimulatorProps {
  onOpenFullHub: (tab?: string) => void;
  pathPilotUrl: string;
}

export const DesktopSimulator: React.FC<DesktopSimulatorProps> = ({
  onOpenFullHub,
  pathPilotUrl,
}) => {
  // Active window states on simulated desktop
  const [activeWindow, setActiveWindow] = useState<'browser' | 'vscode' | 'pdf'>('browser');
  const [browserMinimized, setBrowserMinimized] = useState(false);
  const [vscodeMinimized, setVscodeMinimized] = useState(false);
  const [pdfMinimized, setPdfMinimized] = useState(false);

  return (
    <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl bg-gradient-to-br from-slate-950 via-indigo-950/60 to-purple-950/80 flex flex-col justify-between select-none">
      {/* Virtual Desktop Background / Aurora wallpaper */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-600/25 rounded-full blur-3xl" />
      </div>

      {/* Virtual Desktop Workspace Area */}
      <div className="relative flex-1 p-4 md:p-6 overflow-hidden">
        {/* Info Banner in Desktop */}
        <div className="absolute top-4 left-6 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-purple-500/30 text-xs text-slate-300 backdrop-blur-md shadow-md">
          <Monitor size={14} className="text-purple-400" />
          <span>Interactive Windows Desktop Environment • Pip floats above all apps</span>
          <button
            onClick={() => onOpenFullHub('chat')}
            className="ml-2 font-bold text-purple-300 hover:text-white underline"
          >
            Open Full Hub
          </button>
        </div>

        {/* 1. Simulated App Window: PathPilot AI Classroom */}
        {!browserMinimized && (
          <div
            onClick={() => setActiveWindow('browser')}
            style={{ zIndex: activeWindow === 'browser' ? 30 : 20 }}
            className={`absolute top-14 left-6 w-[88%] md:w-[68%] h-[420px] rounded-2xl glass-panel-glow border shadow-2xl flex flex-col overflow-hidden transition-all ${
              activeWindow === 'browser' ? 'border-purple-500/50 ring-1 ring-purple-500/30' : 'border-slate-800 opacity-90'
            }`}
          >
            {/* Title Bar */}
            <div className="bg-slate-950/90 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={13} className="text-purple-400" />
                <span className="text-[11px] font-semibold text-white">
                  PathPilot AI Classroom — Chrome
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setBrowserMinimized(true);
                  }}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <Minimize2 size={11} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenFullHub('pathpilot');
                  }}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <Maximize2 size={11} />
                </button>
              </div>
            </div>

            {/* URL bar */}
            <div className="bg-slate-900/80 px-3 py-1.5 border-b border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-mono text-[10px]">🔒 https://</span>
              <span className="font-mono text-purple-300 truncate">{pathPilotUrl}</span>
            </div>

            {/* Window Content */}
            <div className="flex-1 bg-slate-950/90 p-4 overflow-y-auto space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Calculus III: Multivariable Optimization</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Module 4 of 6 • 84% Mastery Verified
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                  Active Goal
                </span>
              </div>

              <div className="space-y-2">
                <p className="leading-relaxed">
                  <strong>Concept in Focus:</strong> Lagrange Multipliers allow finding local extrema of multivariable functions subject to equality constraints. ∇f = λ∇g guarantees tangency of contour levels.
                </p>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-purple-200">
                  L(x, y, λ) = f(x, y) - λ · (g(x, y) - c)
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => onOpenFullHub('pyq')}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition shadow"
                >
                  Solve Practice Problem with Pip
                </button>
                <span className="text-[11px] text-slate-500">Pip is watching your progress</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Simulated App Window: VS Code Study Editor */}
        {!vscodeMinimized && (
          <div
            onClick={() => setActiveWindow('vscode')}
            style={{ zIndex: activeWindow === 'vscode' ? 30 : 15 }}
            className={`absolute top-28 right-6 w-[85%] md:w-[48%] h-[320px] rounded-2xl glass-panel-glow border shadow-2xl flex flex-col overflow-hidden transition-all ${
              activeWindow === 'vscode' ? 'border-indigo-500/50 ring-1 ring-indigo-500/30' : 'border-slate-800 opacity-90'
            }`}
          >
            {/* Title Bar */}
            <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold">
                <Code2 size={13} />
                <span className="text-[11px] text-slate-300">algorithm_practice.cpp — VS Code</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setVscodeMinimized(true);
                }}
                className="text-slate-400 hover:text-white"
              >
                <Minimize2 size={11} />
              </button>
            </div>

            {/* Code Body */}
            <div className="flex-1 bg-slate-950 p-3 font-mono text-[11px] text-slate-300 overflow-y-auto space-y-1">
              <p className="text-slate-500">// Pip Concurrency Review: Peterson Algorithm</p>
              <p><span className="text-purple-400">bool</span> flag[2] = &#123;<span className="text-amber-400">false</span>, <span className="text-amber-400">false</span>&#125;;</p>
              <p><span className="text-purple-400">int</span> turn = 0;</p>
              <p className="text-slate-500">// Process i critical section entry:</p>
              <p>flag[i] = <span className="text-amber-400">true</span>;</p>
              <p>turn = j;</p>
              <p><span className="text-purple-400">while</span> (flag[j] && turn == j) &#123; <span className="text-slate-500">/* wait */</span> &#125;</p>
              <p className="text-emerald-400">// Mutual Exclusion guaranteed!</p>
            </div>
          </div>
        )}
      </div>

      {/* Simulated Windows 11 Taskbar */}
      <div className="relative z-40 h-12 bg-slate-950/95 border-t border-purple-500/20 px-4 flex items-center justify-between backdrop-blur-xl">
        {/* Left / Center: Start & App Icons */}
        <div className="flex items-center gap-2">
          {/* Windows Start Button */}
          <button
            onClick={() => onOpenFullHub('desktop')}
            className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 hover:scale-105 text-white shadow-md transition"
            title="Start Menu: Open Pip Learning Hub"
          >
            <Sparkles size={16} />
          </button>

          {/* Chrome / PathPilot Tab */}
          <button
            onClick={() => {
              setBrowserMinimized(false);
              setActiveWindow('browser');
            }}
            className={`px-3 py-1 rounded-xl text-xs flex items-center gap-1.5 transition ${
              !browserMinimized && activeWindow === 'browser'
                ? 'bg-purple-600/30 text-white border border-purple-500/40'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Globe size={13} className="text-purple-400" />
            <span className="hidden sm:inline">PathPilot AI</span>
          </button>

          {/* VS Code Tab */}
          <button
            onClick={() => {
              setVscodeMinimized(false);
              setActiveWindow('vscode');
            }}
            className={`px-3 py-1 rounded-xl text-xs flex items-center gap-1.5 transition ${
              !vscodeMinimized && activeWindow === 'vscode'
                ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Code2 size={13} className="text-indigo-400" />
            <span className="hidden sm:inline">VS Code</span>
          </button>
        </div>

        {/* Right System Tray */}
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-bold text-purple-300">Pip Running</span>
          </div>

          <div className="text-right text-[11px] leading-tight font-mono text-slate-400 hidden sm:block">
            <div>11:15 PM</div>
            <div className="text-[10px]">10/25/2026</div>
          </div>
        </div>
      </div>
    </div>
  );
};
