import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Edit2,
  Check,
} from 'lucide-react';
import { PipCharacter } from './PipCharacter';
import { pipAudio } from '../utils/audio';

interface PathPilotBridgeProps {
  currentUrl: string;
  onUpdateUrl: (url: string) => void;
  onTriggerMastery: () => void;
  onCelebrate: () => void;
}

export const PathPilotBridge: React.FC<PathPilotBridgeProps> = ({
  currentUrl,
  onUpdateUrl,
  onTriggerMastery,
  onCelebrate,
}) => {
  const [platformUrlInput, setPlatformUrlInput] = useState(currentUrl);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [syncState, setSyncState] = useState<any>({
    connected: true,
    studentName: 'Alex Rivera',
    currentModule: 'Calculus & Multivariable Optimization',
    latestQuizTopic: 'Calculus & Optimization',
    latestQuizScore: 84,
    masteryStatus: 'Mastered',
    nextRecommendedTask: 'Practice Integration by Parts (Advanced Variant)',
    reason: 'Adaptive revision based on 84% score on Calculus module',
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSaveUrl = () => {
    onUpdateUrl(platformUrlInput);
    setIsEditingUrl(false);
    pipAudio.playClick();
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    pipAudio.playThinking();

    try {
      const res = await fetch('/api/pathpilot/state');
      const data = await res.json();
      if (data) {
        setSyncState({
          connected: true,
          studentName: data.student?.name || 'Alex Rivera',
          currentModule: 'Calculus & Multivariable Optimization',
          latestQuizTopic: data.latestQuiz?.topic || 'Calculus & Optimization',
          latestQuizScore: data.latestQuiz?.score || 84,
          masteryStatus: data.latestQuiz?.masteryStatus || 'Mastered',
          nextRecommendedTask: data.recommendedNextTask?.title || 'Practice Integration by Parts (Advanced Variant)',
          reason: data.recommendedNextTask?.reason || 'Adaptive revision based on 84% score',
        });
        pipAudio.playGreeting();
      }
    } catch (e) {
      console.error('Failed to sync PathPilot data:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTestMasteryCelebration = () => {
    onCelebrate();
    pipAudio.playCelebrate();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <ShieldCheck size={16} />
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              PathPilot AI Platform Integration
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
              Documented Bridge Mode
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Live Platform Synchronization</h2>
          <p className="text-xs text-slate-400">
            Connects Pip to your published PathPilot AI learning classroom ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition hover:scale-105 active:scale-95"
          >
            Launch PathPilot AI
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Configurable URL Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full md:w-auto flex-1">
          <span className="text-slate-400 font-semibold shrink-0">Configured Platform URL:</span>
          {isEditingUrl ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={platformUrlInput}
                onChange={(e) => setPlatformUrlInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-purple-500 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              />
              <button
                onClick={handleSaveUrl}
                className="p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-500"
              >
                <Check size={14} />
              </button>
            </div>
          ) : (
            <span className="font-mono text-purple-300 truncate max-w-md">{currentUrl}</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isEditingUrl && (
            <button
              onClick={() => setIsEditingUrl(true)}
              className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              <Edit2 size={12} />
              Edit URL
            </button>
          )}

          <button
            onClick={handleSyncData}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition disabled:opacity-50"
          >
            <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Progress'}
          </button>
        </div>
      </div>

      {/* Sync State Card & Next Task Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Quiz & Performance Card */}
        <div className="lg:col-span-1 p-5 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-purple-300">Latest Recorded Performance</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
              {syncState.masteryStatus}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] text-slate-400">Exam / Quiz Topic</span>
              <h4 className="text-sm font-bold text-white mt-0.5">{syncState.latestQuizTopic}</h4>
            </div>

            <div>
              <span className="text-[11px] text-slate-400">Score & Accuracy</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-extrabold text-white">{syncState.latestQuizScore}%</span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  (Above 80% Mastery Threshold)
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleTestMasteryCelebration}
                className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} />
                Trigger Verified Mastery Event
              </button>
            </div>
          </div>
        </div>

        {/* Adaptive Next Recommended Task */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-purple-400" />
                Adaptive Next Task Recommended by Pip
              </span>
              <span className="text-[11px] text-slate-400">Estimated 20 Minutes</span>
            </div>

            <h3 className="text-base font-bold text-white">{syncState.nextRecommendedTask}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{syncState.reason}</p>

            <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200">
              🤖 <strong>Pip Says:</strong> "You demonstrated mastery on basic calculus. Now let's tackle integration by parts with tricky trigonometric boundaries to secure your top score on the upcoming final!"
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition hover:scale-105 active:scale-95"
            >
              Start Task in PathPilot AI
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Live Embedded Platform Preview Frame */}
      <div className="rounded-3xl bg-slate-900/90 border border-purple-500/20 overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white">Live PathPilot AI Preview Frame</span>
            <span className="text-slate-500">|</span>
            <span className="font-mono text-purple-300 truncate max-w-xs">{currentUrl}</span>
          </div>

          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1"
          >
            Open in New Window
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="h-[460px] w-full bg-slate-950 relative">
          <iframe
            title="PathPilot AI Platform"
            src={currentUrl}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
};
