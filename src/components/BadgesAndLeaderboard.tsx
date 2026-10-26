import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  Sparkles,
  Zap,
  Flame,
  Shield,
  Star,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Crown,
  Palette,
  Layers,
  ChevronRight,
  Check,
} from 'lucide-react';
import { StudentProgress, PipSettings, BackgroundTheme } from '../types/pip';
import { pipAudio } from '../utils/audio';

interface BadgesAndLeaderboardProps {
  progress: StudentProgress;
  onClaimBadgeReward?: (xpReward: number) => void;
  settings: PipSettings;
  onUpdateSettings: (newSettings: Partial<PipSettings>) => void;
}

export interface AchievementBadge {
  id: string;
  name: string;
  icon: string;
  tier: 'Diamond' | 'Gold' | 'Platinum' | 'Master';
  description: string;
  xpReward: number;
  currentValue: number;
  targetValue: number;
  unit: string;
  unlocked: boolean;
  claimed: boolean;
  color: string;
  glow: string;
}

export const BadgesAndLeaderboard: React.FC<BadgesAndLeaderboardProps> = ({
  progress,
  onClaimBadgeReward,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard' | 'themes'>('badges');

  // Badges state with claim functionality
  const [badges, setBadges] = useState<AchievementBadge[]>([
    {
      id: 'b1',
      name: 'Syllabus Slayer',
      icon: '⚔️',
      tier: 'Master',
      description: 'Master 3 full course modules inside the 3-Step Engine.',
      xpReward: 300,
      currentValue: 2,
      targetValue: 3,
      unit: 'modules',
      unlocked: false,
      claimed: false,
      color: 'from-amber-500 via-orange-400 to-yellow-500',
      glow: 'shadow-amber-500/30 border-amber-400',
    },
    {
      id: 'b2',
      name: 'PYQ Diagnostic Ace',
      icon: '⚡',
      tier: 'Diamond',
      description: 'Score 90%+ on any PYQ Diagnostic Quiz derived from notes.',
      xpReward: 250,
      currentValue: progress.averageScore,
      targetValue: 90,
      unit: '% score',
      unlocked: progress.averageScore >= 90,
      claimed: false,
      color: 'from-cyan-400 via-sky-500 to-blue-600',
      glow: 'shadow-cyan-500/30 border-cyan-400',
    },
    {
      id: 'b3',
      name: 'Consistent Momentum',
      icon: '🔥',
      tier: 'Gold',
      description: 'Achieve a 7+ day continuous university study streak.',
      xpReward: 200,
      currentValue: progress.streakDays,
      targetValue: 7,
      unit: 'days',
      unlocked: progress.streakDays >= 7,
      claimed: false,
      color: 'from-rose-500 via-pink-500 to-amber-500',
      glow: 'shadow-rose-500/30 border-rose-400',
    },
    {
      id: 'b4',
      name: 'Feynman Socratic Master',
      icon: '🧠',
      tier: 'Platinum',
      description: 'Clear 5 conceptual doubts with the interactive AI Tutor.',
      xpReward: 200,
      currentValue: 4,
      targetValue: 5,
      unit: 'doubts',
      unlocked: false,
      claimed: false,
      color: 'from-indigo-400 via-purple-500 to-pink-500',
      glow: 'shadow-indigo-500/30 border-indigo-400',
    },
    {
      id: 'b5',
      name: 'Deep Work Monolith',
      icon: '⏱️',
      tier: 'Diamond',
      description: 'Accumulate 120+ minutes of Pomodoro Lock Screen focus.',
      xpReward: 350,
      currentValue: progress.todayMinutes,
      targetValue: 120,
      unit: 'minutes',
      unlocked: progress.todayMinutes >= 120,
      claimed: false,
      color: 'from-emerald-400 via-teal-500 to-cyan-500',
      glow: 'shadow-emerald-500/30 border-emerald-400',
    },
    {
      id: 'b6',
      name: 'Polyglot Sprint Champion',
      icon: '🌐',
      tier: 'Gold',
      description: 'Win 5 Foreign Language Duolingo sprints in study breaks.',
      xpReward: 150,
      currentValue: 5,
      targetValue: 5,
      unit: 'sprints',
      unlocked: true,
      claimed: false,
      color: 'from-sky-400 via-teal-400 to-emerald-500',
      glow: 'shadow-sky-500/30 border-sky-400',
    },
  ]);

  const handleClaimReward = (badgeId: string, xpReward: number) => {
    pipAudio.playCelebrate();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#fbbf24', '#ffffff', '#10b981'],
    });

    setBadges((prev) =>
      prev.map((b) => (b.id === badgeId ? { ...b, claimed: true } : b))
    );

    if (onClaimBadgeReward) {
      onClaimBadgeReward(xpReward);
    }
  };

  // Student Leaderboard Data
  const LEADERBOARD = [
    { rank: 1, name: 'Siddharth V.', callsign: 'QuantumSidd', league: 'Grandmaster', streak: 24, accuracy: '98%', xp: 4890, avatar: '👨‍🎓', isUser: false },
    { rank: 2, name: 'Elena Rostova', callsign: 'NeuroElena', league: 'Grandmaster', streak: 19, accuracy: '96%', xp: 4420, avatar: '👩‍🔬', isUser: false },
    { rank: 3, name: 'Alex Rivera (You)', callsign: 'AlexRivera', league: 'Diamond', streak: progress.streakDays, accuracy: `${progress.averageScore}%`, xp: progress.totalXp, avatar: '🚀', isUser: true },
    { rank: 4, name: 'Marcus Chen', callsign: 'AlgorithmKing', league: 'Diamond', streak: 14, accuracy: '92%', xp: 1720, avatar: '👨‍💻', isUser: false },
    { rank: 5, name: 'Aria Thorne', callsign: 'BioGenius', league: 'Platinum', streak: 11, accuracy: '89%', xp: 1580, avatar: '🧬', isUser: false },
    { rank: 6, name: 'Devon Patel', callsign: 'MathMatrix', league: 'Platinum', streak: 9, accuracy: '88%', xp: 1390, avatar: '📐', isUser: false },
  ];

  const THEMES: { id: BackgroundTheme; name: string; desc: string; icon: string }[] = [
    {
      id: 'galaxy',
      name: 'Cosmic Milky Way & Moving Galaxy',
      desc: 'Interactive 3D cosmic starfield with moving galactic dust, nebulae, and mouse parallax.',
      icon: '🌌',
    },
    {
      id: 'cybergrid',
      name: 'Cyberpunk Neo-Tokyo Matrix Grid',
      desc: 'Glowing perspective laser horizon with traveling digital data streams.',
      icon: '⚡',
    },
    {
      id: 'quantum_void',
      name: 'Deep Obsidian Quantum Void',
      desc: 'Minimalist pitch-black dark matter space with pulsing quantum energy waves.',
      icon: '⚛️',
    },
    {
      id: 'solar_flare',
      name: 'Interstellar Solar Flare & Plasma',
      desc: 'High-energy coronal plasma waves with ambient stellar warmth.',
      icon: '☀️',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#040816]/95 border border-sky-500/30 shadow-2xl backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300">
              <Trophy size={16} />
            </span>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
              University Ranks & Holographic Badges
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Student Leaderboard & Milestone Badges
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Earn high-tier holographic badges, unlock exclusive companion abilities, and climb the university global mastery rankings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#02050f] border border-amber-500/40 text-center">
            <span className="text-[10px] text-slate-400 block font-mono">Current League</span>
            <span className="text-sm font-black text-amber-300 font-mono">Diamond Tier</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#02050f] border border-cyan-400/40 text-center">
            <span className="text-[10px] text-slate-400 block font-mono">Mastery XP</span>
            <span className="text-sm font-black text-cyan-300 font-mono">{progress.totalXp} XP</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-sky-500/20 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            pipAudio.playClick();
            setActiveTab('badges');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'badges'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-[#030612] border border-white/5'
          }`}
        >
          <Award size={15} />
          Holographic Tier Badges ({badges.filter((b) => b.unlocked).length}/{badges.length})
        </button>

        <button
          onClick={() => {
            pipAudio.playClick();
            setActiveTab('leaderboard');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'leaderboard'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-[#030612] border border-white/5'
          }`}
        >
          <Trophy size={15} />
          Global University Leaderboard
        </button>

        <button
          onClick={() => {
            pipAudio.playClick();
            setActiveTab('themes');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'themes'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-[#030612] border border-white/5'
          }`}
        >
          <Palette size={15} />
          Galactic Background Themes
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. HOLOGRAPHIC TIER BADGES TAB                                            */}
      {/* ========================================================================= */}
      {activeTab === 'badges' && (
        <div className="space-y-6 animate-bubble-pop">
          {/* Tier Overview Pill Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-amber-950/40 via-[#040816] to-[#040816] border border-amber-400/30 text-center">
              <span className="text-xl">🌌</span>
              <h4 className="text-xs font-bold text-amber-300 mt-1">Cosmic Grandmaster</h4>
              <p className="text-[10px] text-slate-500 font-mono">Rank #1 • Top 1%</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-cyan-950/40 via-[#040816] to-[#040816] border border-cyan-400/30 text-center">
              <span className="text-xl">⚡</span>
              <h4 className="text-xs font-bold text-cyan-300 mt-1">Quantum Scholar</h4>
              <p className="text-[10px] text-slate-500 font-mono">Level 7+ Required</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-950/40 via-[#040816] to-[#040816] border border-indigo-400/30 text-center">
              <span className="text-xl">🔮</span>
              <h4 className="text-xs font-bold text-indigo-300 mt-1">Neural Pioneer</h4>
              <p className="text-[10px] text-slate-500 font-mono">Level 5+ Required</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-950/40 via-[#040816] to-[#040816] border border-emerald-400/30 text-center">
              <span className="text-xl">🛡️</span>
              <h4 className="text-xs font-bold text-emerald-300 mt-1">Galactic Sentinel</h4>
              <p className="text-[10px] text-slate-500 font-mono">Level 3+ • Unlocked</p>
            </div>
          </div>

          {/* Badges Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {badges.map((b) => {
              const progressPct = Math.min(100, Math.round((b.currentValue / b.targetValue) * 100));

              return (
                <div
                  key={b.id}
                  className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 hover:scale-[1.02] shadow-xl ${
                    b.unlocked
                      ? `bg-gradient-to-b from-[#060c1e] to-[#02050f] ${b.glow}`
                      : 'bg-[#030612]/90 border-white/5 opacity-70'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                        {b.icon}
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold font-mono uppercase ${
                          b.tier === 'Master'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : b.tier === 'Diamond'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {b.tier} Tier
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-white leading-snug">{b.name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">{b.description}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Progress</span>
                        <span>
                          {b.currentValue} / {b.targetValue} {b.unit} ({progressPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${b.color} transition-all duration-500`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reward Action */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                      <Zap size={13} />
                      +{b.xpReward} XP
                    </span>

                    {b.claimed ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                        <Check size={14} />
                        Claimed
                      </span>
                    ) : b.unlocked ? (
                      <button
                        type="button"
                        onClick={() => handleClaimReward(b.id, b.xpReward)}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold text-xs shadow-md transition hover:scale-105 active:scale-95"
                      >
                        Claim Reward!
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Lock size={12} />
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. GLOBAL LEADERBOARD TAB                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="rounded-3xl bg-[#040816]/95 border border-sky-500/30 overflow-hidden shadow-2xl animate-bubble-pop">
          <div className="p-6 bg-[#02050e] border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Crown size={18} className="text-amber-400" />
                Global University Mastery Leaderboard
              </h3>
              <p className="text-xs text-slate-400">
                Rankings computed daily based on verified diagnostic scores, continuous streaks, and module completions.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
              Season 4 Active
            </span>
          </div>

          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#010309] border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px] font-mono">
              <tr>
                <th className="py-4 px-4 font-semibold">Rank</th>
                <th className="py-4 px-4 font-semibold">Student & Callsign</th>
                <th className="py-4 px-4 font-semibold">League</th>
                <th className="py-4 px-4 font-semibold">Daily Streak</th>
                <th className="py-4 px-4 font-semibold">Accuracy</th>
                <th className="py-4 px-4 font-semibold text-right">Mastery XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {LEADERBOARD.map((st) => (
                <tr
                  key={st.rank}
                  className={`transition hover:bg-sky-500/5 ${
                    st.isUser ? 'bg-cyan-500/15 border-l-4 border-l-cyan-400 font-bold text-white' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold">
                    {st.rank === 1 ? '🥇 #1' : st.rank === 2 ? '🥈 #2' : st.rank === 3 ? '🥉 #3' : `#${st.rank}`}
                  </td>
                  <td className="py-3.5 px-4 flex items-center gap-2.5">
                    <span className="text-base">{st.avatar}</span>
                    <div>
                      <span className={st.isUser ? 'text-cyan-300 font-bold' : 'text-white font-medium'}>
                        {st.name}
                      </span>
                      <p className="text-[10px] text-slate-500 font-mono">@{st.callsign}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        st.league === 'Grandmaster'
                          ? 'bg-amber-500/20 text-amber-300'
                          : st.league === 'Diamond'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}
                    >
                      {st.league}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                      <Flame size={13} />
                      {st.streak}d
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-mono font-semibold">{st.accuracy}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-cyan-300 font-bold">{st.xp} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GALACTIC BACKGROUND THEMES TAB                                         */}
      {/* ========================================================================= */}
      {activeTab === 'themes' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#040816]/95 border border-sky-500/30 shadow-2xl space-y-6 animate-bubble-pop">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
              Live Canvas Shaders
            </span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <Palette size={18} className="text-cyan-400" />
              Select Live Background Environment
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Rendered on canvas with moving galactic particles, perspective Tron grids, and mouse parallax.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {THEMES.map((th) => (
              <div
                key={th.id}
                onClick={() => {
                  pipAudio.playClick();
                  onUpdateSettings({ backgroundTheme: th.id });
                }}
                className={`p-5 rounded-3xl border cursor-pointer transition flex flex-col justify-between space-y-4 hover:scale-[1.02] active:scale-95 ${
                  settings.backgroundTheme === th.id
                    ? 'bg-gradient-to-br from-cyan-950/80 via-[#040816] to-[#040816] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl'
                    : 'bg-[#02050e] border-white/10 hover:border-cyan-500/50 text-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{th.icon}</span>
                    {settings.backgroundTheme === th.id && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                        Active
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">{th.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{th.desc}</p>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-end">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 font-mono">
                    Apply Theme →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
